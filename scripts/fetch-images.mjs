// One-off build script: fetch CC-licensed photos from Wikimedia Commons
// into public/images/ and print a credits map. Not part of the app runtime.
import { writeFile } from "node:fs/promises";

const queries = [
  ["bogota", "Bogotá cityscape monserrate"],
  ["cafe", "coffee farm Colombia landscape"],
  ["metrocable", "Metrocable Medellín"],
  ["lluvia", "rainy day street umbrella"],
  ["radiografia", "chest X-ray hospital"],
];

const UA = { "User-Agent": "seed42-build/1.0 (educational; one-time fetch)" };

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

for (const [name, term] of queries) {
  const candidates = await search(term);
  const pick = candidates.find(
    (i) =>
      /\.jpe?g$/i.test((i.url ?? "").split("?")[0]) &&
      i.width >= 1200 &&
      i.width > i.height,
  );
  if (!pick) {
    console.log(name + ": NO MATCH of " + candidates.length);
    continue;
  }
  const meta = pick.extmetadata ?? {};
  const artist = (meta.Artist?.value ?? "").replace(/<[^>]*>/g, "").trim();
  const license = meta.LicenseShortName?.value ?? "";
  const img = await fetch(pick.thumburl, { headers: UA });
  const buf = Buffer.from(await img.arrayBuffer());
  await writeFile(`public/images/${name}.jpg`, buf);
  console.log(
    JSON.stringify({ name, kb: Math.round(buf.length / 1024), artist, license }),
  );
}
