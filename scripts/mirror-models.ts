/**
 * Uploads public/models/*.glb to private Vercel Blob and maps
 * /models/<slug>.glb → /api/media/models/<slug>.glb in media-map.json
 */
import { createReadStream } from "node:fs";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import "dotenv/config";

interface MediaMap {
  version: number;
  description?: string;
  hosts: Record<string, string>;
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
  for (const file of files) {
    const localPath = path.join(modelsDir, file);
    const pathname = `models/${file}`;
    const sourceUrl = `/models/${file}`;
    const hosted = `/api/media/${pathname}`;

    if (map.hosts[sourceUrl] === hosted) {
      const info = await stat(localPath);
      console.info(`skip ${file} (${info.size} bytes)`);
      continue;
    }

    console.info(`upload ${file}…`);
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
    `Done. Uploaded ${uploaded}. Mapped models: ${files.length}. Run pnpm db:seed.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
