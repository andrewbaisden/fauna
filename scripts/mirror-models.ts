/**
 * Uploads public/models/*.glb to private Vercel Blob and maps
 * /models/<slug>.glb → /api/media/models/<slug>.glb in media-map.json
 */
import { createReadStream } from "node:fs";
import { open, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import "dotenv/config";

interface MediaMap {
  version: number;
  description?: string;
  hosts: Record<string, string>;
}

const GLB_MAGIC = Buffer.from("glTF");

async function isValidGlb(
  filePath: string,
): Promise<{ ok: boolean; size: number }> {
  const info = await stat(filePath);
  if (info.size < 12) {
    return { ok: false, size: info.size };
  }
  const handle = await open(filePath, "r");
  try {
    const header = Buffer.alloc(4);
    const { bytesRead } = await handle.read(header, 0, 4, 0);
    return {
      ok: bytesRead === 4 && header.equals(GLB_MAGIC),
      size: info.size,
    };
  } finally {
    await handle.close();
  }
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required");
  }

  const modelsDir = path.join(process.cwd(), "public/models");
  const mapPath = path.join(process.cwd(), "content/assets/media-map.json");
  const map = JSON.parse(await readFile(mapPath, "utf8")) as MediaMap;
  const files = (await readdir(modelsDir)).filter((file) =>
    file.endsWith(".glb"),
  );

  if (files.length === 0) {
    throw new Error(
      "No GLBs in public/models. Run pnpm assets:models then pnpm assets:fetch",
    );
  }

  let uploaded = 0;
  let skipped = 0;
  for (const file of files) {
    const localPath = path.join(modelsDir, file);
    const pathname = `models/${file}`;
    const sourceUrl = `/models/${file}`;
    const hosted = `/api/media/${pathname}`;
    const validity = await isValidGlb(localPath);

    if (!validity.ok) {
      console.warn(`skip ${file}: not a valid GLB (${validity.size} bytes)`);
      skipped += 1;
      continue;
    }

    console.info(`upload ${file} (${validity.size} bytes)…`);
    const stream = createReadStream(localPath);
    await put(pathname, stream, {
      access: "private",
      contentType: "model/gltf-binary",
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    map.hosts[sourceUrl] = hosted;
    uploaded += 1;
    await writeFile(mapPath, `${JSON.stringify(map, null, 2)}\n`);
    console.info(`  → ${hosted}`);
  }

  console.info(
    `Done. Uploaded ${uploaded}, skipped ${skipped}. Mapped models: ${Object.keys(map.hosts).filter((key) => key.startsWith("/models/")).length}. Run pnpm db:seed.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
