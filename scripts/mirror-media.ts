import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { parse } from "yaml";
import "dotenv/config";

interface MediaMap {
  version: number;
  description?: string;
  hosts: Record<string, string>;
}

interface SpeciesDoc {
  slug: string;
  media?: Array<{ url?: string; kind?: string }>;
  threeD?: Array<{
    posterImageUrl?: string;
    fallbackImageUrl?: string;
  }>;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extensionFromContentType(
  contentType: string | null,
  url: string,
): string {
  if (contentType?.includes("png")) {
    return "png";
  }
  if (contentType?.includes("webp")) {
    return "webp";
  }
  if (contentType?.includes("gif")) {
    return "gif";
  }
  if (url.toLowerCase().endsWith(".png")) {
    return "png";
  }
  if (url.toLowerCase().endsWith(".webp")) {
    return "webp";
  }
  return "jpg";
}

async function loadMap(mapPath: string): Promise<MediaMap> {
  const raw = await readFile(mapPath, "utf8");
  return JSON.parse(raw) as MediaMap;
}

async function collectSourceUrls(): Promise<
  Array<{ slug: string; url: string }>
> {
  const dir = path.join(process.cwd(), "content/species");
  const { readdir } = await import("node:fs/promises");
  const files = (await readdir(dir)).filter((file) => file.endsWith(".yaml"));
  const entries: Array<{ slug: string; url: string }> = [];

  for (const file of files) {
    const doc = parse(
      await readFile(path.join(dir, file), "utf8"),
    ) as SpeciesDoc;
    const slug = doc.slug ?? file.replace(/\.ya?ml$/, "");
    for (const asset of doc.media ?? []) {
      if (asset.url?.includes("upload.wikimedia.org")) {
        entries.push({ slug, url: asset.url });
      }
    }
    for (const asset of doc.threeD ?? []) {
      for (const key of ["posterImageUrl", "fallbackImageUrl"] as const) {
        const value = asset[key];
        if (value?.includes("upload.wikimedia.org")) {
          entries.push({ slug, url: value });
        }
      }
    }
  }

  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }
    seen.add(entry.url);
    return true;
  });
}

async function download(url: string): Promise<{
  buffer: Buffer;
  contentType: string;
  extension: string;
}> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "FaunaMediaMirror/1.0 (educational encyclopedia; contact via GitHub)",
      Accept: "image/*",
    },
  });
  if (!response.ok) {
    throw new Error(`Download failed ${response.status} for ${url}`);
  }
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    buffer,
    contentType,
    extension: extensionFromContentType(contentType, url),
  };
}

async function mirrorToBlob() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is required. Create a Vercel Blob store, then add the token to .env",
    );
  }

  const mapPath = path.join(process.cwd(), "content/assets/media-map.json");
  const map = await loadMap(mapPath);
  const entries = await collectSourceUrls();
  let uploaded = 0;

  for (const entry of entries) {
    if (map.hosts[entry.url]?.includes("blob.vercel-storage.com")) {
      console.info(`skip (already on Blob) ${entry.slug}`);
      continue;
    }

    console.info(`fetch ${entry.slug}…`);
    const file = await download(entry.url);
    const hash = createHash("sha1")
      .update(entry.url)
      .digest("hex")
      .slice(0, 12);
    const pathname = `media/${entry.slug}-${hash}.${file.extension}`;
    const blob = await put(pathname, file.buffer, {
      access: "public",
      contentType: file.contentType,
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    map.hosts[entry.url] = blob.url;
    uploaded += 1;
    console.info(`  → ${blob.url}`);
    await sleep(400);
  }

  await writeFile(mapPath, `${JSON.stringify(map, null, 2)}\n`);
  console.info(`Done. Uploaded ${uploaded}. Updated ${mapPath}`);
  console.info("Run pnpm db:seed so the database uses Blob URLs.");
}

async function mirrorLocal() {
  const mediaDir = path.join(process.cwd(), "public/media");
  await mkdir(mediaDir, { recursive: true });
  const mapPath = path.join(process.cwd(), "content/assets/media-map.json");
  const map = await loadMap(mapPath);
  const entries = await collectSourceUrls();
  let written = 0;

  for (const entry of entries) {
    if (
      map.hosts[entry.url]?.startsWith("/media/") ||
      map.hosts[entry.url]?.includes("blob.vercel-storage.com")
    ) {
      console.info(`skip ${entry.slug}`);
      continue;
    }

    console.info(`fetch ${entry.slug}…`);
    const file = await download(entry.url);
    const hash = createHash("sha1")
      .update(entry.url)
      .digest("hex")
      .slice(0, 12);
    const filename = `${entry.slug}-${hash}.${file.extension}`;
    await writeFile(path.join(mediaDir, filename), file.buffer);
    map.hosts[entry.url] = `/media/${filename}`;
    written += 1;
    console.info(`  → /media/${filename}`);
    await sleep(500);
  }

  await writeFile(mapPath, `${JSON.stringify(map, null, 2)}\n`);
  console.info(`Done. Wrote ${written} local files. Run pnpm db:seed.`);
}

async function rewriteYamlFromMap() {
  const mapPath = path.join(process.cwd(), "content/assets/media-map.json");
  const map = await loadMap(mapPath);
  if (Object.keys(map.hosts).length === 0) {
    throw new Error(
      "media-map.json has no hosts. Run assets:mirror-media first.",
    );
  }

  const dir = path.join(process.cwd(), "content/species");
  const { readdir } = await import("node:fs/promises");
  const files = (await readdir(dir)).filter((file) => file.endsWith(".yaml"));

  for (const file of files) {
    const full = path.join(dir, file);
    let text = await readFile(full, "utf8");
    let changed = false;
    for (const [from, to] of Object.entries(map.hosts)) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      await writeFile(full, text);
      console.info(`rewrote ${file}`);
    }
  }
}

async function main() {
  const mode = process.argv[2] ?? "blob";
  if (mode === "blob") {
    await mirrorToBlob();
  } else if (mode === "local") {
    await mirrorLocal();
  } else if (mode === "rewrite-yaml") {
    await rewriteYamlFromMap();
  } else {
    console.error(
      "Usage: pnpm assets:mirror-media -- [blob|local|rewrite-yaml]",
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
