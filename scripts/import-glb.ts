import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_LICENSES = [
  "CC0",
  "CC_BY",
  "CC_BY_SA",
  "SMITHSONIAN_OA",
  "PUBLIC_DOMAIN",
] as const;

type License = (typeof ALLOWED_LICENSES)[number];

function usage(): never {
  console.error(`Usage:
  pnpm assets:import -- \\
    --slug <species-slug> \\
    --file <path-to.glb> \\
    --creator <name> \\
    --source <url-or-description> \\
    --license <${ALLOWED_LICENSES.join("|")}> \\
    --attribution <text> \\
    --version <semver> \\
    [--notes <text>] \\
    [--modified]

Copies the GLB into public/models/<slug>.glb, updates content/assets/licenses.json,
and prints a YAML threeD block to paste into content/species/<slug>.yaml.
`);
  process.exit(1);
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    usage();
  }

  const slug = argValue("--slug");
  const file = argValue("--file");
  const creator = argValue("--creator");
  const source = argValue("--source");
  const license = argValue("--license") as License | undefined;
  const attribution = argValue("--attribution");
  const version = argValue("--version");
  const notes = argValue("--notes");
  const modified = hasFlag("--modified");

  if (
    !slug ||
    !file ||
    !creator ||
    !source ||
    !license ||
    !attribution ||
    !version
  ) {
    usage();
  }

  if (!ALLOWED_LICENSES.includes(license)) {
    console.error(`Invalid license: ${license}`);
    process.exit(1);
  }

  const absoluteSource = path.resolve(file);
  const modelsDir = path.join(process.cwd(), "public/models");
  await mkdir(modelsDir, { recursive: true });
  const destRelative = `public/models/${slug}.glb`;
  const destAbsolute = path.join(process.cwd(), destRelative);
  await copyFile(absoluteSource, destAbsolute);

  const fileStats = await stat(destAbsolute);
  const licensesPath = path.join(process.cwd(), "content/assets/licenses.json");
  const licenses = JSON.parse(await readFile(licensesPath, "utf8")) as {
    models: Array<Record<string, unknown>>;
  };

  const entry = {
    speciesSlug: slug,
    file: destRelative,
    creator,
    source,
    license,
    attribution,
    modified,
    version,
    notes: notes ?? null,
    fileSizeBytes: fileStats.size,
  };

  licenses.models = [
    ...licenses.models.filter((item) => item.speciesSlug !== slug),
    entry,
  ].sort((a, b) => String(a.speciesSlug).localeCompare(String(b.speciesSlug)));
  await writeFile(licensesPath, `${JSON.stringify(licenses, null, 2)}\n`);

  const yamlBlock = `threeD:
  - url: /models/${slug}.glb
    format: GLB
    fileSizeBytes: ${fileStats.size}
    creator: ${JSON.stringify(creator).slice(1, -1)}
    source: ${JSON.stringify(source).slice(1, -1)}
    license: ${license}
    attribution: ${JSON.stringify(attribution).slice(1, -1)}
    modified: ${modified}
    version: ${JSON.stringify(version)}
    posterImageUrl: <paste species PHOTO url>
    fallbackImageUrl: <paste species PHOTO url>
    notes: ${JSON.stringify(notes ?? "Licensed educational mesh for Fauna viewer.").slice(1, -1)}`;

  console.info(`Wrote ${destRelative} (${fileStats.size} bytes)`);
  console.info(`Updated ${licensesPath}`);
  console.info("\nPaste into content/species/%s.yaml:\n", slug);
  console.info(yamlBlock);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
