/**
 * Generates CC0 educational stand-in GLBs for every species (box silhouettes).
 * Quaternius wolf/fox from `pnpm assets:fetch` overwrite these when available.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { createBox, writeBoxMeshGlb } from "./lib/glb-box-mesh";

type AnimalGroup =
  | "MAMMAL"
  | "BIRD"
  | "FISH"
  | "REPTILE"
  | "AMPHIBIAN"
  | "INVERTEBRATE";

interface SpeciesDoc {
  slug: string;
  commonName: string;
  animalGroup: AnimalGroup;
  media?: Array<{ kind?: string; url?: string }>;
}

type Silhouette =
  | "elephant"
  | "quadruped"
  | "tall"
  | "whale"
  | "bird"
  | "penguin"
  | "fish"
  | "shark"
  | "snake"
  | "lizard"
  | "turtle"
  | "frog"
  | "insect"
  | "butterfly"
  | "octopus"
  | "squid"
  | "ape";

const LICENSED_POLY_PIZZA: Record<
  string,
  {
    source: string;
    attribution: string;
    notes: string;
    creator: string;
    license: "CC0" | "CC_BY";
  }
> = {
  "african-elephant": {
    source: "https://poly.pizza/m/a27MA0rXyyj",
    attribution: "Poly by Google, CC BY 3.0 (via Poly Pizza)",
    notes:
      "Low-poly stylized educational mesh from Google Poly archive. Not a photogrammetric scan.",
    creator: "Poly by Google",
    license: "CC_BY",
  },
  "grey-wolf": {
    source: "https://poly.pizza/m/P1gU3Qkr9r",
    attribution: "Quaternius, CC0 (via Poly Pizza)",
    notes:
      "Low-poly stylized educational mesh from Quaternius. Not a photogrammetric scan.",
    creator: "Quaternius",
    license: "CC0",
  },
  "red-fox": {
    source: "https://poly.pizza/m/Bc97C66HKi",
    attribution: "Quaternius, CC0 (via Poly Pizza)",
    notes:
      "Low-poly stylized educational mesh from Quaternius. Not a photogrammetric scan.",
    creator: "Quaternius",
    license: "CC0",
  },
};

function silhouetteFor(slug: string, group: AnimalGroup): Silhouette {
  const overrides: Record<string, Silhouette> = {
    "african-elephant": "elephant",
    giraffe: "tall",
    "blue-whale": "whale",
    "emperor-penguin": "penguin",
    "great-white-shark": "shark",
    "whale-shark": "shark",
    "king-cobra": "snake",
    "green-sea-turtle": "turtle",
    "komodo-dragon": "lizard",
    "saltwater-crocodile": "lizard",
    "golden-poison-frog": "frog",
    axolotl: "frog",
    "honey-bee": "insect",
    "monarch-butterfly": "butterfly",
    "giant-pacific-octopus": "octopus",
    "giant-squid": "squid",
    "western-gorilla": "ape",
  };
  if (overrides[slug]) {
    return overrides[slug];
  }
  if (group === "BIRD") {
    return "bird";
  }
  if (group === "FISH") {
    return "fish";
  }
  if (group === "REPTILE") {
    return "lizard";
  }
  if (group === "AMPHIBIAN") {
    return "frog";
  }
  if (group === "INVERTEBRATE") {
    return "insect";
  }
  return "quadruped";
}

function colorFor(slug: string): [number, number, number] {
  const palette: Record<string, [number, number, number]> = {
    "african-elephant": [0.45, 0.45, 0.48],
    "grey-wolf": [0.55, 0.55, 0.58],
    "red-fox": [0.82, 0.42, 0.18],
    lion: [0.86, 0.68, 0.28],
    tiger: [0.85, 0.45, 0.12],
    cheetah: [0.9, 0.72, 0.35],
    "polar-bear": [0.92, 0.93, 0.95],
    "giant-panda": [0.2, 0.2, 0.22],
    "american-bison": [0.35, 0.22, 0.12],
    giraffe: [0.78, 0.58, 0.28],
    hippopotamus: [0.55, 0.48, 0.5],
    "western-gorilla": [0.18, 0.18, 0.2],
    "blue-whale": [0.25, 0.4, 0.55],
    "bald-eagle": [0.55, 0.42, 0.28],
    "barn-owl": [0.85, 0.78, 0.65],
    "peregrine-falcon": [0.45, 0.48, 0.55],
    "emperor-penguin": [0.15, 0.15, 0.18],
    clownfish: [1, 0.45, 0.1],
    "great-white-shark": [0.55, 0.6, 0.65],
    "whale-shark": [0.25, 0.35, 0.45],
    "king-cobra": [0.35, 0.45, 0.28],
    "komodo-dragon": [0.4, 0.42, 0.28],
    "saltwater-crocodile": [0.28, 0.38, 0.25],
    "green-sea-turtle": [0.25, 0.5, 0.35],
    "golden-poison-frog": [0.95, 0.75, 0.1],
    axolotl: [0.95, 0.65, 0.7],
    "honey-bee": [0.95, 0.75, 0.15],
    "monarch-butterfly": [0.9, 0.4, 0.1],
    "giant-pacific-octopus": [0.55, 0.25, 0.35],
    "giant-squid": [0.7, 0.45, 0.4],
  };
  return palette[slug] ?? [0.35, 0.55, 0.45];
}

function boxesFor(silhouette: Silhouette): ReturnType<typeof createBox>[] {
  switch (silhouette) {
    case "elephant":
      return [
        createBox(1.6, 1.1, 0.9, [0, 1.1, 0]),
        createBox(0.7, 0.6, 0.6, [1.05, 1.35, 0]),
        createBox(0.18, 0.7, 0.18, [1.35, 0.85, 0]),
        createBox(0.7, 0.9, 0.08, [0.1, 1.5, 0.52]),
        createBox(0.7, 0.9, 0.08, [0.1, 1.5, -0.52]),
        createBox(0.22, 0.9, 0.22, [-0.5, 0.45, 0.28]),
        createBox(0.22, 0.9, 0.22, [-0.5, 0.45, -0.28]),
        createBox(0.22, 0.9, 0.22, [0.5, 0.45, 0.28]),
        createBox(0.22, 0.9, 0.22, [0.5, 0.45, -0.28]),
      ];
    case "tall":
      return [
        createBox(0.7, 1.4, 0.55, [0, 1.4, 0]),
        createBox(0.35, 1.2, 0.35, [0.15, 2.5, 0]),
        createBox(0.45, 0.35, 0.4, [0.35, 3.1, 0]),
        createBox(0.18, 1.2, 0.18, [-0.2, 0.6, 0.18]),
        createBox(0.18, 1.2, 0.18, [-0.2, 0.6, -0.18]),
        createBox(0.18, 1.2, 0.18, [0.25, 0.6, 0.18]),
        createBox(0.18, 1.2, 0.18, [0.25, 0.6, -0.18]),
      ];
    case "whale":
      return [
        createBox(3.2, 0.9, 1.1, [0, 0.7, 0]),
        createBox(0.7, 0.55, 0.7, [1.7, 0.75, 0]),
        createBox(0.15, 0.7, 1.4, [-1.7, 0.85, 0]),
        createBox(0.5, 0.15, 1.2, [0.2, 0.55, 0]),
      ];
    case "bird":
      return [
        createBox(0.55, 0.45, 0.4, [0, 0.85, 0]),
        createBox(0.35, 0.3, 0.35, [0.4, 1.05, 0]),
        createBox(1.4, 0.08, 0.45, [0, 0.95, 0]),
        createBox(0.12, 0.55, 0.12, [-0.1, 0.4, 0.08]),
        createBox(0.12, 0.55, 0.12, [-0.1, 0.4, -0.08]),
      ];
    case "penguin":
      return [
        createBox(0.55, 1.1, 0.45, [0, 0.85, 0]),
        createBox(0.4, 0.35, 0.4, [0, 1.55, 0]),
        createBox(0.12, 0.7, 0.25, [0, 0.9, 0.28]),
        createBox(0.12, 0.7, 0.25, [0, 0.9, -0.28]),
        createBox(0.35, 0.12, 0.5, [0, 0.2, 0]),
      ];
    case "fish":
      return [
        createBox(1.2, 0.55, 0.25, [0, 0.55, 0]),
        createBox(0.25, 0.35, 0.08, [-0.7, 0.55, 0]),
        createBox(0.15, 0.35, 0.08, [0.1, 0.85, 0]),
      ];
    case "shark":
      return [
        createBox(1.8, 0.55, 0.45, [0, 0.55, 0]),
        createBox(0.45, 0.55, 0.12, [0.1, 1.0, 0]),
        createBox(0.35, 0.4, 0.08, [-1.0, 0.55, 0]),
        createBox(0.5, 0.12, 0.9, [0.2, 0.4, 0]),
      ];
    case "snake":
      return [
        createBox(2.4, 0.18, 0.18, [0, 0.2, 0]),
        createBox(0.35, 0.28, 0.28, [1.2, 0.35, 0]),
        createBox(0.12, 0.45, 0.12, [1.35, 0.55, 0]),
      ];
    case "lizard":
      return [
        createBox(1.5, 0.35, 0.45, [0, 0.4, 0]),
        createBox(0.45, 0.3, 0.4, [0.85, 0.5, 0]),
        createBox(0.8, 0.12, 0.12, [-1.0, 0.35, 0]),
        createBox(0.15, 0.35, 0.15, [0.4, 0.2, 0.25]),
        createBox(0.15, 0.35, 0.15, [0.4, 0.2, -0.25]),
        createBox(0.15, 0.35, 0.15, [-0.3, 0.2, 0.25]),
        createBox(0.15, 0.35, 0.15, [-0.3, 0.2, -0.25]),
      ];
    case "turtle":
      return [
        createBox(1.1, 0.35, 0.9, [0, 0.45, 0]),
        createBox(0.4, 0.25, 0.35, [0.7, 0.4, 0]),
        createBox(0.55, 0.08, 0.35, [0.2, 0.35, 0.55]),
        createBox(0.55, 0.08, 0.35, [0.2, 0.35, -0.55]),
      ];
    case "frog":
      return [
        createBox(0.55, 0.3, 0.4, [0, 0.35, 0]),
        createBox(0.3, 0.25, 0.3, [0.35, 0.4, 0]),
        createBox(0.15, 0.35, 0.15, [-0.15, 0.2, 0.22]),
        createBox(0.15, 0.35, 0.15, [-0.15, 0.2, -0.22]),
        createBox(0.12, 0.25, 0.12, [0.2, 0.18, 0.2]),
        createBox(0.12, 0.25, 0.12, [0.2, 0.18, -0.2]),
      ];
    case "insect":
      return [
        createBox(0.35, 0.2, 0.2, [0, 0.25, 0]),
        createBox(0.2, 0.18, 0.18, [0.25, 0.28, 0]),
        createBox(0.5, 0.04, 0.25, [0, 0.32, 0]),
        createBox(0.04, 0.25, 0.04, [-0.05, 0.15, 0.12]),
        createBox(0.04, 0.25, 0.04, [-0.05, 0.15, -0.12]),
      ];
    case "butterfly":
      return [
        createBox(0.2, 0.15, 0.12, [0, 0.4, 0]),
        createBox(0.7, 0.05, 0.55, [0, 0.45, 0.35]),
        createBox(0.7, 0.05, 0.55, [0, 0.45, -0.35]),
      ];
    case "octopus":
      return [
        createBox(0.7, 0.55, 0.7, [0, 0.7, 0]),
        createBox(0.12, 0.9, 0.12, [0.45, 0.35, 0.25]),
        createBox(0.12, 0.9, 0.12, [0.45, 0.35, -0.25]),
        createBox(0.12, 0.9, 0.12, [-0.45, 0.35, 0.25]),
        createBox(0.12, 0.9, 0.12, [-0.45, 0.35, -0.25]),
        createBox(0.12, 0.9, 0.12, [0.15, 0.35, 0.45]),
        createBox(0.12, 0.9, 0.12, [-0.15, 0.35, -0.45]),
      ];
    case "squid":
      return [
        createBox(0.45, 1.2, 0.45, [0, 1.0, 0]),
        createBox(0.35, 0.35, 0.35, [0, 1.7, 0]),
        createBox(0.08, 1.0, 0.08, [0.2, 0.4, 0.12]),
        createBox(0.08, 1.0, 0.08, [-0.2, 0.4, 0.12]),
        createBox(0.08, 1.0, 0.08, [0.2, 0.4, -0.12]),
        createBox(0.08, 1.0, 0.08, [-0.2, 0.4, -0.12]),
      ];
    case "ape":
      return [
        createBox(0.7, 0.9, 0.5, [0, 1.1, 0]),
        createBox(0.45, 0.4, 0.45, [0, 1.7, 0]),
        createBox(0.2, 0.85, 0.2, [0.35, 0.9, 0.15]),
        createBox(0.2, 0.85, 0.2, [-0.35, 0.9, 0.15]),
        createBox(0.22, 0.7, 0.22, [0.18, 0.4, 0.1]),
        createBox(0.22, 0.7, 0.22, [-0.18, 0.4, 0.1]),
      ];
    default:
      return [
        createBox(1.1, 0.7, 0.5, [0, 0.9, 0]),
        createBox(0.45, 0.4, 0.4, [0.7, 1.05, 0]),
        createBox(0.35, 0.35, 0.12, [0.55, 1.25, 0.28]),
        createBox(0.18, 0.65, 0.18, [-0.3, 0.4, 0.18]),
        createBox(0.18, 0.65, 0.18, [-0.3, 0.4, -0.18]),
        createBox(0.18, 0.65, 0.18, [0.35, 0.4, 0.18]),
        createBox(0.18, 0.65, 0.18, [0.35, 0.4, -0.18]),
      ];
  }
}

function yamlQuote(value: string): string {
  if (/[:#{}[\],&*?|>!%@`]/.test(value) || value.includes("'")) {
    return JSON.stringify(value);
  }
  return value;
}

function buildThreeDBlock(options: {
  slug: string;
  photoUrl: string;
  fileSizeBytes: number;
  licensed: boolean;
}): string {
  const meta = LICENSED_POLY_PIZZA[options.slug];
  const creator = options.licensed ? (meta?.creator ?? "Fauna") : "Fauna";
  const source = options.licensed
    ? (meta?.source ?? "https://poly.pizza")
    : "Project-authored stylized educational mesh";
  const attribution = options.licensed
    ? (meta?.attribution ?? "Licensed educational mesh")
    : "Fauna educational mesh, CC0. Not a photogrammetric scan of a living animal.";
  const notes = options.licensed
    ? (meta?.notes ?? "Licensed educational mesh.")
    : "Stylized box-mesh stand-in so every species has a viewable model. Replace with a licensed living-form mesh when available.";
  const license = options.licensed ? (meta?.license ?? "CC0") : "CC0";

  return `threeD:
  - url: /models/${options.slug}.glb
    format: GLB
    fileSizeBytes: ${options.fileSizeBytes}
    creator: ${yamlQuote(creator)}
    source: ${yamlQuote(source)}
    license: ${license}
    attribution: ${yamlQuote(attribution)}
    modified: false
    version: "1.0.0"
    posterImageUrl: ${yamlQuote(options.photoUrl)}
    fallbackImageUrl: ${yamlQuote(options.photoUrl)}
    notes: ${yamlQuote(notes)}`;
}

function upsertThreeD(yamlText: string, threeDBlock: string): string {
  const normalized = yamlText.endsWith("\n") ? yamlText : `${yamlText}\n`;
  if (/^threeD:/m.test(normalized)) {
    return normalized.replace(/^threeD:\n(?:[ \t]+.*\n)*/m, `${threeDBlock}\n`);
  }
  if (/^rangeGeometry:/m.test(normalized)) {
    return normalized.replace(
      /^rangeGeometry:/m,
      `${threeDBlock}\nrangeGeometry:`,
    );
  }
  return `${normalized.trimEnd()}\n${threeDBlock}\n`;
}

async function main() {
  const speciesDir = path.join(process.cwd(), "content/species");
  const modelsDir = path.join(process.cwd(), "public/models");
  const licensesPath = path.join(process.cwd(), "content/assets/licenses.json");
  const files = (await readdir(speciesDir))
    .filter((file) => file.endsWith(".yaml"))
    .sort();

  const licenses = {
    models: [] as Array<Record<string, unknown>>,
  };

  for (const file of files) {
    const full = path.join(speciesDir, file);
    const raw = await readFile(full, "utf8");
    const doc = parse(raw) as SpeciesDoc;
    const slug = doc.slug;
    const dest = path.join(modelsDir, `${slug}.glb`);
    const licensedMeta = LICENSED_POLY_PIZZA[slug];
    let fileSizeBytes = 0;
    let usedLicensedFile = false;

    if (licensedMeta) {
      try {
        const existing = await stat(dest);
        if (existing.size > 50_000) {
          fileSizeBytes = existing.size;
          usedLicensedFile = true;
          console.info(
            `keep licensed ${slug} (${fileSizeBytes} bytes, ${licensedMeta.creator})`,
          );
        }
      } catch {
        // fall through to generate
      }
    }

    if (!usedLicensedFile) {
      const result = await writeBoxMeshGlb({
        outputPath: dest,
        name: `${doc.commonName.replace(/\s+/g, "")}Educational`,
        boxes: boxesFor(silhouetteFor(slug, doc.animalGroup)),
        color: colorFor(slug),
      });
      fileSizeBytes = result.byteLength;
      console.info(`wrote ${dest} (${fileSizeBytes} bytes)`);
    }

    const photo =
      doc.media?.find((item) => item.kind === "PHOTO")?.url ??
      doc.media?.[0]?.url;
    if (!photo) {
      throw new Error(`No photo URL for ${slug}`);
    }

    const threeDBlock = buildThreeDBlock({
      slug,
      photoUrl: photo,
      fileSizeBytes,
      licensed: usedLicensedFile,
    });
    await writeFile(full, upsertThreeD(raw, threeDBlock));

    licenses.models.push({
      speciesSlug: slug,
      file: `public/models/${slug}.glb`,
      creator: usedLicensedFile ? licensedMeta?.creator : "Fauna",
      source: usedLicensedFile
        ? licensedMeta?.source
        : "scripts/generate-species-models.ts",
      license: usedLicensedFile ? licensedMeta?.license : "CC0",
      attribution: usedLicensedFile
        ? licensedMeta?.attribution
        : "Fauna educational mesh, CC0. Not a photogrammetric scan.",
      modified: false,
      version: "1.0.0",
      notes: usedLicensedFile
        ? "Licensed educational mesh from Poly Pizza."
        : "Box-construction educational stand-in.",
      fileSizeBytes,
    });
  }

  licenses.models.sort((a, b) =>
    String(a.speciesSlug).localeCompare(String(b.speciesSlug)),
  );
  await writeFile(licensesPath, `${JSON.stringify(licenses, null, 2)}\n`);
  console.info(`Updated ${licensesPath} (${licenses.models.length} models)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
