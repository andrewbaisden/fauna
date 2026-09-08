/**
 * Copies Sketchfab GLBs from public/models-to-sort onto the catalogue slugs
 * in public/models, then updates licenses.json and species YAML threeD blocks.
 */
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

type SketchfabLicense = "CC_BY" | "CC_BY_NC" | "CC_BY_NC_SA" | "CC_BY_NC_ND";

type SketchfabModel = {
  slug: string;
  sourceFile: string;
  title: string;
  creator: string;
  source: string;
  license: SketchfabLicense;
  attribution: string;
  notes: string;
};

const MODELS: SketchfabModel[] = [
  {
    slug: "african-elephant",
    sourceFile: "elephant.glb",
    title: "ELEPHANT",
    creator: "Filcomet",
    source: "https://skfb.ly/DRJT",
    license: "CC_BY_NC",
    attribution:
      '"ELEPHANT" (https://skfb.ly/DRJT) by Filcomet is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    notes:
      "Sketchfab mesh for the Fauna viewer. CC-BY-NC: non-commercial hosting only.",
  },
  {
    slug: "american-bison",
    sourceFile: "bison.glb",
    title: "Bison",
    creator: "Anees Animates",
    source: "https://skfb.ly/p8VUp",
    license: "CC_BY_NC",
    attribution:
      '"Bison" (https://skfb.ly/p8VUp) by Anees Animates is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    notes:
      "Sketchfab mesh for the Fauna viewer. CC-BY-NC: non-commercial hosting only.",
  },
  {
    slug: "axolotl",
    sourceFile: "axolotl.glb",
    title: "Axolotl",
    creator: "varin",
    source: "https://skfb.ly/oRuyR",
    license: "CC_BY",
    attribution:
      '"Axolotl" (https://skfb.ly/oRuyR) by varin is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "bald-eagle",
    sourceFile: "bald_eagle.glb",
    title: "Bald Eagle",
    creator: "ucdavisterc",
    source: "https://skfb.ly/oIYEL",
    license: "CC_BY",
    attribution:
      '"Bald Eagle" (https://skfb.ly/oIYEL) by ucdavisterc is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "barn-owl",
    sourceFile: "common_barn_owl.glb",
    title: "Common Barn Owl",
    creator: "Innovation Studio",
    source: "https://skfb.ly/LPuI",
    license: "CC_BY",
    attribution:
      '"Common Barn Owl" (https://skfb.ly/LPuI) by Innovation Studio is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "blue-whale",
    sourceFile: "blue_whale_-_textured.glb",
    title: "Blue Whale - Textured",
    creator: "Bohdan Lvov",
    source: "https://skfb.ly/67RFV",
    license: "CC_BY",
    attribution:
      '"Blue Whale - Textured" (https://skfb.ly/67RFV) by Bohdan Lvov is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "cheetah",
    sourceFile: "cheetah.glb",
    title: "Cheetah",
    creator: "hendrikReyneke",
    source: "https://skfb.ly/osDGy",
    license: "CC_BY",
    attribution:
      '"Cheetah" (https://skfb.ly/osDGy) by hendrikReyneke is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "clownfish",
    sourceFile: "clownfish.glb",
    title: "Clownfish",
    creator: "zixisun02",
    source: "https://skfb.ly/6UpoS",
    license: "CC_BY",
    attribution:
      '"Clownfish" (https://skfb.ly/6UpoS) by zixisun02 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "emperor-penguin",
    sourceFile: "emperor_penguin.glb",
    title: "Emperor Penguin",
    creator: "David Wigforss",
    source: "https://skfb.ly/6UYv6",
    license: "CC_BY_NC",
    attribution:
      '"Emperor Penguin" (https://skfb.ly/6UYv6) by David Wigforss is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    notes:
      "Sketchfab mesh for the Fauna viewer. CC-BY-NC: non-commercial hosting only.",
  },
  {
    slug: "giant-pacific-octopus",
    sourceFile: "octopus.glb",
    title: "octopus",
    creator: "s4dned",
    source: "https://skfb.ly/pDoYT",
    license: "CC_BY",
    attribution:
      '"octopus" (https://skfb.ly/pDoYT) by s4dned is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes:
      "Sketchfab living-form mesh titled octopus, used for this catalogue entry.",
  },
  {
    slug: "giant-panda",
    sourceFile: "giant_panda.glb",
    title: "Giant Panda",
    creator: "GentryHS EAST",
    source: "https://skfb.ly/6xnGx",
    license: "CC_BY",
    attribution:
      '"Giant Panda" (https://skfb.ly/6xnGx) by GentryHS EAST is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "giant-squid",
    sourceFile: "squid.glb",
    title: "Squid",
    creator: "Chaitanya Krishnan",
    source: "https://skfb.ly/mlkj3gf10b",
    license: "CC_BY",
    attribution:
      '"Squid" (https://skfb.ly/mlkj3gf10b) by Chaitanya Krishnan is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes:
      "Sketchfab mesh titled Squid, used as a living-form stand-in for giant squid.",
  },
  {
    slug: "giraffe",
    sourceFile: "giraffe.glb",
    title: "Giraffe",
    creator: "BlueMesh",
    source: "https://skfb.ly/6xXVP",
    license: "CC_BY",
    attribution:
      '"Giraffe" (https://skfb.ly/6xXVP) by BlueMesh is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "golden-poison-frog",
    sourceFile: "model_20_-_panamanian_golden_frog.glb",
    title: "Model 20 - Panamanian Golden Frog",
    creator: "DigitalLife3D",
    source: "https://skfb.ly/67DEv",
    license: "CC_BY_NC",
    attribution:
      '"Model 20 - Panamanian Golden Frog" (https://skfb.ly/67DEv) by DigitalLife3D is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    notes:
      "Sketchfab mesh is a Panamanian golden frog (Atelopus zeteki), used as a living-form stand-in. CC-BY-NC: non-commercial hosting only.",
  },
  {
    slug: "great-white-shark",
    sourceFile: "great_white_shark.glb",
    title: "Great White Shark",
    creator: "Sealife Fan 3",
    source: "https://skfb.ly/oQXVs",
    license: "CC_BY",
    attribution:
      '"Great White Shark" (https://skfb.ly/oQXVs) by Sealife Fan 3 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "green-sea-turtle",
    sourceFile: "model_52a_-_kemps_ridley_sea_turtle_no_id.glb",
    title: "Model 52A - Kemps Ridley Sea Turtle (no ID)",
    creator: "DigitalLife3D",
    source: "https://skfb.ly/6VNVt",
    license: "CC_BY_NC",
    attribution:
      '"Model 52A - Kemps Ridley Sea Turtle (no ID)" (https://skfb.ly/6VNVt) by DigitalLife3D is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    notes:
      "Sketchfab mesh is a Kemp's Ridley sea turtle, used as a living-form stand-in. CC-BY-NC: non-commercial hosting only.",
  },
  {
    slug: "grey-wolf",
    sourceFile: "grey_wolf_rebuilt.glb",
    title: "Grey Wolf Rebuilt",
    creator: "kenchoo",
    source: "https://skfb.ly/oQZIM",
    license: "CC_BY",
    attribution:
      '"Grey Wolf Rebuilt" (https://skfb.ly/oQZIM) by kenchoo is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "hippopotamus",
    sourceFile: "hippopotamus_planet_zoo.glb",
    title: "Hippopotamus Planet Zoo",
    creator: "jimmyho905",
    source: "https://skfb.ly/pCYBB",
    license: "CC_BY",
    attribution:
      '"Hippopotamus Planet Zoo" (https://skfb.ly/pCYBB) by jimmyho905 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes:
      "Sketchfab mesh inspired by Planet Zoo, used as a living-form stand-in.",
  },
  {
    slug: "honey-bee",
    sourceFile: "honey_bee.glb",
    title: "Honey bee",
    creator: "Cybertron B-127",
    source: "https://skfb.ly/oT7Ax",
    license: "CC_BY",
    attribution:
      '"Honey bee" (https://skfb.ly/oT7Ax) by Cybertron B-127 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "king-cobra",
    sourceFile: "king_cobra.glb",
    title: "King Cobra",
    creator: "Yanez Designs",
    source: "https://skfb.ly/6DqSR",
    license: "CC_BY",
    attribution:
      '"King Cobra" (https://skfb.ly/6DqSR) by Yanez Designs is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "komodo-dragon",
    sourceFile: "komodo_dragon.glb",
    title: "Komodo Dragon",
    creator: "all of life",
    source: "https://skfb.ly/oF8MU",
    license: "CC_BY",
    attribution:
      '"Komodo Dragon" (https://skfb.ly/oF8MU) by all of life is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "lion",
    sourceFile: "lion.glb",
    title: "Lion",
    creator: "kenchoo",
    source: "https://skfb.ly/pwuFM",
    license: "CC_BY_NC_SA",
    attribution:
      '"Lion" (https://skfb.ly/pwuFM) by kenchoo is licensed under CC Attribution-NonCommercial-ShareAlike (http://creativecommons.org/licenses/by-nc-sa/4.0/).',
    notes:
      "Sketchfab mesh for the Fauna viewer. CC-BY-NC-SA: non-commercial hosting only; share alike.",
  },
  {
    slug: "monarch-butterfly",
    sourceFile: "monarch_butterfly.glb",
    title: "Monarch Butterfly",
    creator: "victorberdugo1",
    source: "https://skfb.ly/oSDUA",
    license: "CC_BY",
    attribution:
      '"Monarch Butterfly" (https://skfb.ly/oSDUA) by victorberdugo1 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "peregrine-falcon",
    sourceFile: "peregrine_falcon_in_flight.glb",
    title: "Peregrine Falcon In Flight",
    creator: "restore50",
    source: "https://skfb.ly/pKvNN",
    license: "CC_BY",
    attribution:
      '"Peregrine Falcon In Flight" (https://skfb.ly/pKvNN) by restore50 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "polar-bear",
    sourceFile: "polar_bear.glb",
    title: "Polar Bear",
    creator: "kenchoo",
    source: "https://skfb.ly/oRMzK",
    license: "CC_BY",
    attribution:
      '"Polar Bear" (https://skfb.ly/oRMzK) by kenchoo is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "red-fox",
    sourceFile: "fox_idle.glb",
    title: "Fox Idle",
    creator: "kenchoo",
    source: "https://skfb.ly/oRVHD",
    license: "CC_BY_NC_ND",
    attribution:
      '"Fox Idle" (https://skfb.ly/oRVHD) by kenchoo is licensed under CC Attribution-NonCommercial-NoDerivs (http://creativecommons.org/licenses/by-nc-nd/4.0/).',
    notes:
      "Sketchfab mesh for the Fauna viewer. CC-BY-NC-ND: non-commercial hosting only; no derivatives.",
  },
  {
    slug: "saltwater-crocodile",
    sourceFile: "crocodile_-_animal.glb",
    title: "Crocodile - animal",
    creator: "Brian Trepanier",
    source: "https://skfb.ly/pAuwO",
    license: "CC_BY",
    attribution:
      '"Crocodile - animal" (https://skfb.ly/pAuwO) by Brian Trepanier is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes:
      "Sketchfab living-form mesh titled Crocodile - animal, used for this catalogue entry.",
  },
  {
    slug: "tiger",
    sourceFile: "tiger.glb",
    title: "Tiger",
    creator: "Vavtrudner",
    source: "https://skfb.ly/pLBPy",
    license: "CC_BY",
    attribution:
      '"Tiger" (https://skfb.ly/pLBPy) by Vavtrudner is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes: "Sketchfab living-form mesh for the Fauna viewer.",
  },
  {
    slug: "western-gorilla",
    sourceFile: "gorilla.glb",
    title: "Gorilla",
    creator: "planeta-elefante",
    source: "https://skfb.ly/pwonM",
    license: "CC_BY",
    attribution:
      '"Gorilla" (https://skfb.ly/pwonM) by planeta-elefante is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    notes:
      "Sketchfab living-form mesh titled Gorilla, used for this catalogue entry.",
  },
  {
    slug: "whale-shark",
    sourceFile: "model_99a_-_whale_shark.glb",
    title: "Model 99A - Whale Shark",
    creator: "DigitalLife3D",
    source: "https://skfb.ly/oLzqI",
    license: "CC_BY_NC",
    attribution:
      '"Model 99A - Whale Shark" (https://skfb.ly/oLzqI) by DigitalLife3D is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    notes:
      "Sketchfab mesh for the Fauna viewer. CC-BY-NC: non-commercial hosting only.",
  },
];

function yamlQuote(value: string): string {
  if (
    /[:#{}[\],&*?|>!%@`]/.test(value) ||
    value.includes("'") ||
    value.includes('"')
  ) {
    return JSON.stringify(value);
  }
  return value;
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
  const sortDir = path.join(process.cwd(), "public/models-to-sort");
  const modelsDir = path.join(process.cwd(), "public/models");
  const licensesPath = path.join(process.cwd(), "content/assets/licenses.json");
  await mkdir(modelsDir, { recursive: true });

  const licenses = {
    models: [] as Array<Record<string, unknown>>,
  };

  for (const model of MODELS) {
    const sourcePath = path.join(sortDir, model.sourceFile);
    const destRelative = `public/models/${model.slug}.glb`;
    const destAbsolute = path.join(process.cwd(), destRelative);
    await copyFile(sourcePath, destAbsolute);
    const fileStats = await stat(destAbsolute);

    licenses.models.push({
      speciesSlug: model.slug,
      file: destRelative,
      creator: model.creator,
      source: model.source,
      license: model.license,
      attribution: model.attribution,
      modified: false,
      version: "2.0.0",
      notes: model.notes,
      title: model.title,
      fileSizeBytes: fileStats.size,
    });

    const yamlPath = path.join(
      process.cwd(),
      "content/species",
      `${model.slug}.yaml`,
    );
    const raw = await readFile(yamlPath, "utf8");
    const doc = parse(raw) as {
      media?: Array<{ kind?: string; url?: string }>;
      threeD?: Array<{
        posterImageUrl?: string;
        fallbackImageUrl?: string;
      }>;
    };
    const photo =
      doc.threeD?.[0]?.posterImageUrl ??
      doc.media?.find((item) => item.kind === "PHOTO")?.url ??
      doc.media?.[0]?.url;
    if (!photo) {
      throw new Error(`No poster/photo URL for ${model.slug}`);
    }
    const fallback = doc.threeD?.[0]?.fallbackImageUrl ?? photo;

    const threeDBlock = `threeD:
  - url: /models/${model.slug}.glb
    format: GLB
    fileSizeBytes: ${fileStats.size}
    creator: ${yamlQuote(model.creator)}
    source: ${yamlQuote(model.source)}
    license: ${model.license}
    attribution: ${yamlQuote(model.attribution)}
    modified: false
    version: "2.0.0"
    posterImageUrl: ${yamlQuote(photo)}
    fallbackImageUrl: ${yamlQuote(fallback)}
    notes: ${yamlQuote(model.notes)}`;

    await writeFile(yamlPath, upsertThreeD(raw, threeDBlock));
    console.info(
      `Replaced ${model.slug}.glb (${fileStats.size} bytes) ← ${model.sourceFile}`,
    );
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
