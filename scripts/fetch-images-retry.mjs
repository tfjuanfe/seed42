// Retry the failed thumbnails with pacing and a fallback to the
// original file when the thumb endpoint refuses.
import { writeFile } from "node:fs/promises";

const UA = { "User-Agent": "Seed42Build/1.0 (https://seed42.tech; contact: build script) node-fetch" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const queries = [
  ["metrocable", "Metrocable Medellín"],
  ["lluvia", "rain umbrella street city"],
  ["radiografia", "chest X-ray radiograph"],
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

async function grab(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) return null;
  return Buffer.from(await res.arrayBuffer());
}

for (const [name, term] of queries) {
  const candidates = await search(term).then((c) =>
    c.filter(
      (i) =>
        /\.jpe?g$/i.test((i.url ?? "").split("?")[0]) &&
        i.width >= 1200 &&
        i.width > i.height,
    ),
  );
  let saved = false;
  for (const pick of candidates.slice(0, 4)) {
    await sleep(1500);
    const thumb = (pick.thumburl ?? "").split("?")[0];
    const buf = (await grab(thumb)) ?? (await grab(pick.url.split("?")[0]));
    if (!buf || buf.length < 20_000) continue;
    const meta = pick.extmetadata ?? {};
    const artist = (meta.Artist?.value ?? "").replace(/<[^>]*>/g, "").trim();
    const license = meta.LicenseShortName?.value ?? "";
    await writeFile(`public/images/${name}.jpg`, buf);
    console.log(JSON.stringify({ name, kb: Math.round(buf.length / 1024), artist, license }));
    saved = true;
    break;
  }
  if (!saved) console.log(name + ": FAILED");
}
