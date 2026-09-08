/**
 * Fetches licensed Poly Pizza GLBs used by the catalogue.
 * Run after clone: pnpm assets:fetch
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MODELS = [
  {
    slug: "african-elephant",
    url: "https://static.poly.pizza/b8ca84f2-02b2-4c84-92c0-b5f8b0eee90e.glb",
    source: "https://poly.pizza/m/a27MA0rXyyj",
  },
  {
    slug: "grey-wolf",
    url: "https://static.poly.pizza/f1d12388-e39b-4157-b32a-646a1d089fc4.glb",
    source: "https://poly.pizza/m/P1gU3Qkr9r",
  },
  {
    slug: "red-fox",
    url: "https://static.poly.pizza/e18e86df-1692-48d8-ac6e-1e25ab4ad574.glb",
    source: "https://poly.pizza/m/Bc97C66HKi",
  },
] as const;

async function main() {
  const dir = path.join(process.cwd(), "public/models");
  await mkdir(dir, { recursive: true });

  for (const model of MODELS) {
    const response = await fetch(model.url, {
      headers: { "User-Agent": "FaunaAssetFetch/1.0" },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to download ${model.slug}: ${response.status} ${response.statusText} (${model.source})`,
      );
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const dest = path.join(dir, `${model.slug}.glb`);
    await writeFile(dest, buffer);
    console.info(`Wrote ${dest} (${buffer.length} bytes) from ${model.source}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
