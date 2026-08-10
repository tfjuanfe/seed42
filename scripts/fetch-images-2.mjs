// One-off: fetch CC photos for modules 02–03 from Wikimedia Commons.
import { writeFile } from "node:fs/promises";

const UA = { "User-Agent": "Seed42Build/1.0 (educational; one-time fetch)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const queries = [
  ["transmilenio", "TransMilenio Bogotá"],
  ["celular", "hand holding smartphone screen"],
  ["medellin", "Medellín panorama Aburrá"],
  ["estacion", "automatic weather station instruments"],
];

async function search(term) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(term) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo" +
    "&iiprop=url|extmetadata|size&iiurlwidth=1400&format=json&origin=*";
  const res = await fetch(url, { headers: UA });
  const json = await res.json();
  return Object.values(json?.query?.pages ?? {})
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99))
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean);
}

async function grab(u) {
  const r = await fetch(u, { headers: UA });
  if (!r.ok) return null;
  if (!(r.headers.get("content-type") || "").startsWith("image/")) return null;
  return Buffer.from(await r.arrayBuffer());
}

for (const [name, term] of queries) {
  const cands = (await search(term)).filter(
    (i) =>
      /\.jpe?g$/i.test((i.url ?? "").split("?")[0]) &&
      i.width >= 1200 &&
      i.width > i.height,
  );
  let ok = false;
  for (const pick of cands.slice(0, 5)) {
    await sleep(1200);
    const buf =
      (await grab((pick.thumburl ?? "").split("?")[0])) ??
      (await grab(pick.url.split("?")[0]));
    if (!buf || buf.length < 20_000) continue;
    const meta = pick.extmetadata ?? {};
    const artist = (meta.Artist?.value ?? "").replace(/<[^>]*>/g, "").trim();
    console.log(
      JSON.stringify({
        name,
        kb: Math.round(buf.length / 1024),
        artist,
        license: meta.LicenseShortName?.value ?? "",
      }),
    );
    await writeFile(`public/images/${name}.jpg`, buf);
    ok = true;
    break;
  }
  if (!ok) console.log(name + ": FAILED");
}
