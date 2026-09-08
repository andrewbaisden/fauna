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

/** Prefer Commons FilePath (often better-behaved than direct upload.wikimedia.org). */
function candidateDownloadUrls(sourceUrl: string): string[] {
  const urls = [sourceUrl];
  try {
    const parsed = new URL(sourceUrl);
    if (parsed.hostname === "upload.wikimedia.org") {
      const fileName = decodeURIComponent(
        parsed.pathname.split("/").pop() ?? "",
      );
      if (fileName) {
        urls.unshift(
          `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`,
        );
      }
    }
  } catch {
    // keep original
  }
  return [...new Set(urls)];
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

async function downloadOnce(url: string): Promise<{
  buffer: Buffer;
  contentType: string;
  extension: string;
} | null> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "FaunaMediaMirror/1.0 (https://github.com/andrewbaisden/fauna; educational encyclopedia)",
      Accept: "image/*",
    },
    redirect: "follow",
  });
  if (!response.ok) {
    console.warn(`  ${response.status} ${url}`);
    return null;
  }
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.startsWith("image/")) {
    console.warn(`  non-image content-type ${contentType} for ${url}`);
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    buffer,
    contentType,
    extension: extensionFromContentType(contentType, url),
  };
}

async function download(sourceUrl: string): Promise<{
  buffer: Buffer;
  contentType: string;
  extension: string;
}> {
  const candidates = candidateDownloadUrls(sourceUrl);

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    for (const url of candidates) {
      const file = await downloadOnce(url);
      if (file) {
        return file;
      }
    }
    const waitMs = Math.min(attempt * 8000, 60000);
    console.warn(`  retry ${attempt}/8 after ${waitMs}ms`);
    await sleep(waitMs);
  }

  throw new Error(`Download failed for ${sourceUrl} after retries`);
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
  const failures: string[] = [];

  for (const entry of entries) {
    if (map.hosts[entry.url]?.startsWith("/api/media/media/")) {
      console.info(`skip (already mirrored) ${entry.slug}`);
      continue;
    }

    console.info(`fetch ${entry.slug}…`);
    try {
      const file = await download(entry.url);
      const hash = createHash("sha1")
        .update(entry.url)
        .digest("hex")
        .slice(0, 12);
      const pathname = `media/${entry.slug}-${hash}.${file.extension}`;
      await put(pathname, file.buffer, {
        access: "private",
        contentType: file.contentType,
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      const hosted = `/api/media/${pathname}`;
      map.hosts[entry.url] = hosted;
      uploaded += 1;
      await writeFile(mapPath, `${JSON.stringify(map, null, 2)}\n`);
      console.info(`  → ${hosted}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  FAILED ${entry.slug}: ${message}`);
      failures.push(entry.slug);
    }
    await sleep(3000);
  }

  console.info(
    `Done. Uploaded ${uploaded}. Mapped ${Object.keys(map.hosts).length}.`,
  );
  if (failures.length > 0) {
    console.error(
      `Failed ${failures.length}: ${failures.join(", ")}. Re-run pnpm assets:mirror-media to resume.`,
    );
    process.exit(1);
  }
  console.info("Run pnpm db:seed so the database uses /api/media/… URLs.");
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
      map.hosts[entry.url]?.startsWith("/api/media/")
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
    await writeFile(mapPath, `${JSON.stringify(map, null, 2)}\n`);
    console.info(`  → /media/${filename}`);
    await sleep(3000);
  }

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
