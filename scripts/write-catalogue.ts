import { writeFile } from "node:fs/promises";
import path from "node:path";
import { stringify } from "yaml";

interface Spec {
  slug: string;
  commonName: string;
  scientificName: string;
  aliases?: string[];
  animalGroup: string;
  diet: string;
  activityPattern?: string;
  sizeCategory: string;
  featured?: boolean;
  summary: string;
  taxonomy: { rank: string; scientificName: string; slug: string }[];
  habitats: { slug: string; name: string; description: string }[];
  regions: { slug: string; name: string; type: string; rangeType: string }[];
  stages: { slug: string; name: string; description: string }[];
  adaptations: { title: string; explanation: string }[];
  behaviours: { category: string; summary: string }[];
  conservation: {
    status: string;
    populationTrend: string;
    yearAssessed?: number;
    threats: string[];
    sourceUrl: string;
  };
  measurements: Record<string, unknown>[];
  image: {
    url: string;
    alt: string;
    creator: string;
    license: string;
    sourceUrl: string;
  };
}

function chain(parts: [string, string][]): Spec["taxonomy"] {
  const ranks = [
    "KINGDOM",
    "PHYLUM",
    "CLASS",
    "ORDER",
    "FAMILY",
    "GENUS",
    "SPECIES",
  ] as const;
  return parts.map(([scientificName, slug], index) => ({
    rank: ranks[index] ?? "SPECIES",
    scientificName,
    slug,
  }));
}

function doc(spec: Spec) {
  return {
    slug: spec.slug,
    commonName: spec.commonName,
    scientificName: spec.scientificName,
    aliases: spec.aliases ?? [],
    animalGroup: spec.animalGroup,
    diet: spec.diet,
    activityPattern: spec.activityPattern,
    sizeCategory: spec.sizeCategory,
    featured: spec.featured ?? false,
    summary: spec.summary,
    taxonomy: spec.taxonomy,
    habitats: spec.habitats,
    regions: spec.regions,
    lifeStages: spec.stages.map((stage, index) => ({
      slug: stage.slug,
      name: stage.name,
      sortOrder: index,
      description: stage.description,
    })),
    adaptations: spec.adaptations,
    behaviours: spec.behaviours,
    conservation: {
      ...spec.conservation,
      sourceKey: `iucn-${spec.slug}`,
    },
    measurements: spec.measurements.map((item) => ({
      ...item,
      sourceKey: `adw-${spec.slug}`,
    })),
    sources: [
      {
        key: `iucn-${spec.slug}`,
        title: `${spec.scientificName}. The IUCN Red List of Threatened Species`,
        url: spec.conservation.sourceUrl,
        publisher: "IUCN",
        accessedAt: "2026-09-08",
        roles: ["CONSERVATION"],
      },
      {
        key: `adw-${spec.slug}`,
        title: `${spec.scientificName} on Animal Diversity Web or equivalent secondary literature`,
        url: "https://animaldiversity.org/",
        publisher: "Animal Diversity Web",
        accessedAt: "2026-09-08",
        roles: ["MEASUREMENT", "TEXT"],
      },
    ],
    media: [
      {
        kind: "PHOTO",
        url: spec.image.url,
        alt: spec.image.alt,
        creator: spec.image.creator,
        license: spec.image.license,
        attribution: `${spec.image.creator}, Wikimedia Commons, ${spec.image.license.replace("_", " ")}`,
        sourceUrl: spec.image.sourceUrl,
      },
    ],
  };
}

const mammal = (
  order: string,
  family: string,
  genus: string,
  species: string,
  slugs: string[],
) =>
  chain([
    ["Animalia", "animalia"],
    ["Chordata", "chordata"],
    ["Mammalia", "mammalia"],
    [order, slugs[0] ?? "order"],
    [family, slugs[1] ?? "family"],
    [genus, slugs[2] ?? "genus"],
    [species, slugs[3] ?? "species"],
  ]);

const catalogue: Spec[] = [
  {
    slug: "lion",
    commonName: "Lion",
    scientificName: "Panthera leo",
    animalGroup: "MAMMAL",
    diet: "CARNIVORE",
    activityPattern: "CREPUSCULAR",
    sizeCategory: "LARGE",
    featured: true,
    summary:
      "The lion is a social big cat of African savannas and a remnant population in India. Cooperative hunting and pride structure vary with prey and habitat; males are not universally the sole hunters.",
    taxonomy: mammal("Carnivora", "Felidae", "Panthera", "Panthera leo", [
      "carnivora",
      "felidae",
      "panthera",
      "panthera-leo",
    ]),
    habitats: [
      {
        slug: "savanna",
        name: "Savanna",
        description:
          "Open woodland and grassland mosaics used by large herbivores and their predators.",
      },
    ],
    regions: [
      {
        slug: "africa",
        name: "Africa",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
      { slug: "asia", name: "Asia", type: "CONTINENT", rangeType: "NATIVE" },
    ],
    stages: [
      {
        slug: "cub",
        name: "Cub",
        description:
          "Dependent on the pride; high early mortality from infanticide and starvation.",
      },
      {
        slug: "subadult",
        name: "Subadult",
        description: "Young males often disperse; young females may remain.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Breeding adults live in prides or nomadic coalitions depending on sex and density.",
      },
    ],
    adaptations: [
      {
        title: "Cooperative hunting",
        explanation:
          "Group hunts can improve success on large prey, though lions also hunt alone. Social hunting is an ecological tactic, not a video-game combo.",
      },
    ],
    behaviours: [
      {
        category: "SOCIAL",
        summary: "Prides are typically related females plus associated males.",
      },
      {
        category: "FEEDING",
        summary: "Takes medium to large ungulates; scavenging is common.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "DECREASING",
      yearAssessed: 2015,
      threats: [
        "Prey depletion",
        "Human–lion conflict",
        "Habitat fragmentation",
      ],
      sourceUrl: "https://www.iucnredlist.org/species/15951/115130419",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 120,
        maxValue: 250,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LENGTH",
        minValue: 1.4,
        maxValue: 2.5,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 80,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 10,
        maxValue: 16,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg",
      alt: "Lion lying in dry grass in Namibia",
      creator: "Kevin Pluck",
      license: "CC_BY",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lion_waiting_in_Namibia.jpg",
    },
  },
  {
    slug: "grey-wolf",
    commonName: "Grey wolf",
    scientificName: "Canis lupus",
    aliases: ["Gray wolf"],
    animalGroup: "MAMMAL",
    diet: "CARNIVORE",
    activityPattern: "CREPUSCULAR",
    sizeCategory: "MEDIUM",
    summary:
      "The grey wolf is a wide-ranging canid that hunts in packs where prey and snow conditions favour cooperation. Subspecies and dog domestication make the taxonomy historically contested; Fauna treats the wild wolf as Canis lupus.",
    taxonomy: mammal("Carnivora", "Canidae", "Canis", "Canis lupus", [
      "carnivora",
      "canidae",
      "canis",
      "canis-lupus",
    ]),
    habitats: [
      {
        slug: "temperate-forest",
        name: "Temperate forest",
        description: "Seasonal forests and woodland used by ungulate prey.",
      },
      {
        slug: "tundra",
        name: "Tundra",
        description: "Open northern landscapes used by some wolf populations.",
      },
    ],
    regions: [
      {
        slug: "north-america",
        name: "North America",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
      {
        slug: "europe",
        name: "Europe",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
      { slug: "asia", name: "Asia", type: "CONTINENT", rangeType: "NATIVE" },
    ],
    stages: [
      {
        slug: "pup",
        name: "Pup",
        description: "Born in dens; provisioned by the pack.",
      },
      {
        slug: "yearling",
        name: "Yearling",
        description: "Learns hunting routes and may disperse.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Breeding is usually limited to a dominant pair in a pack.",
      },
    ],
    adaptations: [
      {
        title: "Endurance gait",
        explanation:
          "Long legs and a cursorial body plan support covering large home ranges in search of ungulate prey.",
      },
    ],
    behaviours: [
      {
        category: "SOCIAL",
        summary:
          "Packs are typically family groups; size tracks prey size and habitat.",
      },
      {
        category: "COMMUNICATION",
        summary:
          "Howls, scent marks and body language coordinate spacing and reunions.",
      },
    ],
    conservation: {
      status: "LC",
      populationTrend: "STABLE",
      yearAssessed: 2018,
      threats: ["Persecution", "Habitat fragmentation"],
      sourceUrl: "https://www.iucnredlist.org/species/3746/163508960",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 23,
        maxValue: 55,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LENGTH",
        minValue: 1.0,
        maxValue: 1.6,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 64,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 6,
        maxValue: 13,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/23/Canis_lupus.jpg",
      alt: "Grey wolf standing in snow",
      creator: "Bernard Landgraf",
      license: "CC_BY_SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Canis_lupus.jpg",
    },
  },
];

async function main() {
  const extra = await import("./catalogue-more");
  const rest = await import("./catalogue-rest");
  const launch = await import("./catalogue-launch");
  const all = [
    ...catalogue,
    ...extra.catalogue,
    ...rest.catalogue,
    ...launch.catalogue,
  ];
  for (const spec of all) {
    const dest = path.join(
      process.cwd(),
      "content/species",
      `${spec.slug}.yaml`,
    );
    await writeFile(dest, stringify(doc(spec), { lineWidth: 100 }));
    console.info(dest);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
