type Row = {
  slug: string;
  commonName: string;
  scientificName: string;
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
};

function t(
  group: "MAMMAL" | "BIRD" | "REPTILE" | "AMPHIBIAN" | "FISH" | "INVERTEBRATE",
  lineage: [string, string][],
) {
  const ranks =
    group === "INVERTEBRATE" && lineage[1]?.[0] === "Arthropoda"
      ? ["KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"]
      : ["KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];
  return lineage.map(([scientificName, slug], index) => ({
    rank: ranks[index] ?? "SPECIES",
    scientificName,
    slug,
  }));
}

export const catalogue: Row[] = [
  {
    slug: "giraffe",
    commonName: "Giraffe",
    scientificName: "Giraffa camelopardalis",
    animalGroup: "MAMMAL",
    diet: "HERBIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "VERY_LARGE",
    summary:
      "The giraffe is the tallest living terrestrial animal. A long neck and specialised circulation let it browse acacia canopies that shorter herbivores cannot reach. Taxonomy of giraffe lineages is actively revised; this profile follows a conservative single-species treatment used in many checklists.",
    taxonomy: t("MAMMAL", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Mammalia", "mammalia"],
      ["Artiodactyla", "artiodactyla"],
      ["Giraffidae", "giraffidae"],
      ["Giraffa", "giraffa"],
      ["Giraffa camelopardalis", "giraffa-camelopardalis"],
    ]),
    habitats: [
      {
        slug: "savanna",
        name: "Savanna",
        description: "Wooded grassland with browse trees.",
      },
    ],
    regions: [
      {
        slug: "africa",
        name: "Africa",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "calf",
        name: "Calf",
        description:
          "Precocial; stands soon after birth and joins crèches in some populations.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Browsing adults; males compete with necking displays.",
      },
    ],
    adaptations: [
      {
        title: "Long neck and high blood pressure",
        explanation:
          "A powerful heart and specialised valves help maintain brain blood flow despite the vertical distance from heart to head.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Selective browser on leaves, flowers and fruits of tall trees.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "DECREASING",
      yearAssessed: 2016,
      threats: ["Habitat loss", "Poaching"],
      sourceUrl: "https://www.iucnredlist.org/species/9194/136266699",
    },
    measurements: [
      {
        type: "HEIGHT",
        minValue: 4.3,
        maxValue: 5.7,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 800,
        maxValue: 1200,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 55,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 20,
        maxValue: 28,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/South_African_giraffe_%28Giraffa_camelopardalis_giraffa%29_head_with_oxpecker_Kruger.jpg",
      alt: "South African giraffe head with oxpecker in Kruger National Park",
      creator: "Charles J. Sharp",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:South_African_giraffe_(Giraffa_camelopardalis_giraffa)_head_with_oxpecker_Kruger.jpg",
    },
  },
  {
    slug: "bald-eagle",
    commonName: "Bald eagle",
    scientificName: "Haliaeetus leucocephalus",
    animalGroup: "BIRD",
    diet: "CARNIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "MEDIUM",
    featured: true,
    summary:
      "The bald eagle is a fish-eating sea eagle of North America. Recovery after DDT restrictions is a well-documented conservation case, though local threats remain.",
    taxonomy: t("BIRD", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Aves", "aves"],
      ["Accipitriformes", "accipitriformes"],
      ["Accipitridae", "accipitridae"],
      ["Haliaeetus", "haliaeetus"],
      ["Haliaeetus leucocephalus", "haliaeetus-leucocephalus"],
    ]),
    habitats: [
      {
        slug: "wetlands",
        name: "Wetlands and coasts",
        description: "Lakes, rivers and coasts with fish and tall nest trees.",
      },
    ],
    regions: [
      {
        slug: "north-america",
        name: "North America",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "nestling",
        name: "Nestling",
        description: "Raised in bulky stick nests, often reused for years.",
      },
      {
        slug: "immature",
        name: "Immature",
        description:
          "Mottled plumage for several years before the white head appears.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Territorial pairs defend nest areas near water.",
      },
    ],
    adaptations: [
      {
        title: "Fish-catching talons",
        explanation:
          "Rough foot pads and sharp talons help seize slippery fish near the surface.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Takes fish, waterbirds and carrion; piracy from other birds is common.",
      },
    ],
    conservation: {
      status: "LC",
      populationTrend: "INCREASING",
      yearAssessed: 2016,
      threats: ["Lead poisoning", "Collisions"],
      sourceUrl: "https://www.iucnredlist.org/species/22695144/93491570",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 3,
        maxValue: 6.3,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "WINGSPAN",
        minValue: 1.8,
        maxValue: 2.3,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 15,
        maxValue: 28,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Haliaeetus_leucocephalus-flight-USFWS.jpg",
      alt: "Bald eagle in flight",
      creator: "Steve Hillebrand, USFWS",
      license: "PUBLIC_DOMAIN",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Haliaeetus_leucocephalus-flight-USFWS.jpg",
    },
  },
  {
    slug: "emperor-penguin",
    commonName: "Emperor penguin",
    scientificName: "Aptenodytes forsteri",
    animalGroup: "BIRD",
    diet: "CARNIVORE",
    activityPattern: "CATHEMERAL",
    sizeCategory: "MEDIUM",
    featured: true,
    summary:
      "The emperor penguin breeds on Antarctic sea ice in winter. Males incubate the single egg on their feet while fasting through storms; chicks later form crèches.",
    taxonomy: t("BIRD", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Aves", "aves"],
      ["Sphenisciformes", "sphenisciformes"],
      ["Spheniscidae", "spheniscidae"],
      ["Aptenodytes", "aptenodytes"],
      ["Aptenodytes forsteri", "aptenodytes-forsteri"],
    ]),
    habitats: [
      {
        slug: "sea-ice",
        name: "Sea ice",
        description:
          "Fast ice used for colonies; foraging occurs in polar seas.",
      },
    ],
    regions: [
      {
        slug: "antarctica",
        name: "Antarctica",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "egg",
        name: "Egg",
        description: "Incubated on the parent's feet under a brood pouch.",
      },
      {
        slug: "chick",
        name: "Chick",
        description: "Downy chick fed regurgitated food; joins a crèche.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Walks long distances between colony and foraging leads.",
      },
    ],
    adaptations: [
      {
        title: "Huddling and insulation",
        explanation:
          "Dense plumage, fat and coordinated huddles reduce heat loss during Antarctic winter breeding.",
      },
    ],
    behaviours: [
      {
        category: "PARENTAL",
        summary: "Biparental care with a long male incubation fast.",
      },
    ],
    conservation: {
      status: "NT",
      populationTrend: "DECREASING",
      yearAssessed: 2019,
      threats: ["Sea-ice change", "Prey shifts"],
      sourceUrl: "https://www.iucnredlist.org/species/22697752/157658053",
    },
    measurements: [
      {
        type: "HEIGHT",
        minValue: 1.1,
        maxValue: 1.3,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 22,
        maxValue: 45,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 15,
        maxValue: 20,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg",
      alt: "Two adult emperor penguins with a juvenile on Snow Hill Island, Antarctica",
      creator: "Ian Duffy",
      license: "CC_BY",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Aptenodytes_forsteri_-Snow_Hill_Island,_Antarctica_-adults_and_juvenile-8.jpg",
    },
  },
  {
    slug: "komodo-dragon",
    commonName: "Komodo dragon",
    scientificName: "Varanus komodoensis",
    animalGroup: "REPTILE",
    diet: "CARNIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "LARGE",
    featured: true,
    summary:
      "The Komodo dragon is the largest living lizard, confined to a handful of Indonesian islands. It hunts and scavenges using a combination of stealth, a serrated bite and venom components.",
    taxonomy: t("REPTILE", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Reptilia", "reptilia"],
      ["Squamata", "squamata"],
      ["Varanidae", "varanidae"],
      ["Varanus", "varanus"],
      ["Varanus komodoensis", "varanus-komodoensis"],
    ]),
    habitats: [
      {
        slug: "savanna",
        name: "Savanna",
        description:
          "Tropical dry forest and savanna on a few Lesser Sunda islands.",
      },
    ],
    regions: [
      { slug: "asia", name: "Asia", type: "CONTINENT", rangeType: "NATIVE" },
    ],
    stages: [
      {
        slug: "hatchling",
        name: "Hatchling",
        description:
          "Arboreal and more insectivorous, reducing cannibalism risk.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Terrestrial ambush predator and scavenger of large vertebrates.",
      },
    ],
    adaptations: [
      {
        title: "Venom and serrated teeth",
        explanation:
          "Oral venom glands and a tearing bite help subdue prey; the old 'bacteria only' story is incomplete.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Eats deer, pigs and carrion; large meals may be followed by long rest.",
      },
    ],
    conservation: {
      status: "EN",
      populationTrend: "DECREASING",
      yearAssessed: 2019,
      threats: ["Climate-driven habitat loss", "Human encroachment"],
      sourceUrl: "https://www.iucnredlist.org/species/22884/9396711",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 2.0,
        maxValue: 3.0,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 70,
        maxValue: 90,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 25,
        maxValue: 40,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Komodo_dragon_at_Komodo_National_Park.jpg",
      alt: "Komodo dragon at Komodo National Park",
      creator: "Adhi Rachdian",
      license: "CC_BY",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Komodo_dragon_at_Komodo_National_Park.jpg",
    },
  },
  {
    slug: "axolotl",
    commonName: "Axolotl",
    scientificName: "Ambystoma mexicanum",
    animalGroup: "AMPHIBIAN",
    diet: "CARNIVORE",
    activityPattern: "NOCTURNAL",
    sizeCategory: "SMALL",
    featured: true,
    summary:
      "The axolotl is a paedomorphic salamander that typically retains larval features into adulthood. Wild populations are confined to remnant waters of the Mexico City basin and are critically endangered.",
    taxonomy: t("AMPHIBIAN", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Amphibia", "amphibia"],
      ["Urodela", "urodela"],
      ["Ambystomatidae", "ambystomatidae"],
      ["Ambystoma", "ambystoma"],
      ["Ambystoma mexicanum", "ambystoma-mexicanum"],
    ]),
    habitats: [
      {
        slug: "freshwater",
        name: "Freshwater",
        description: "High-altitude lakes and canals with aquatic vegetation.",
      },
    ],
    regions: [
      {
        slug: "north-america",
        name: "North America",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      { slug: "egg", name: "Egg", description: "Laid in water among plants." },
      {
        slug: "larva",
        name: "Larva",
        description: "Aquatic, gilled; this morphology is usually retained.",
      },
      {
        slug: "adult",
        name: "Paedomorphic adult",
        description:
          "Sexually mature without a full terrestrial metamorphosis in most individuals.",
      },
    ],
    adaptations: [
      {
        title: "Regeneration",
        explanation:
          "Can regenerate limbs, gills and some internal tissues, making it a model for developmental biology.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Sucks in aquatic invertebrates and small vertebrates by rapid mouth expansion.",
      },
    ],
    conservation: {
      status: "CR",
      populationTrend: "DECREASING",
      yearAssessed: 2019,
      threats: ["Habitat drainage", "Pollution", "Invasive fish"],
      sourceUrl: "https://www.iucnredlist.org/species/1095/139744672",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 0.15,
        maxValue: 0.3,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 0.06,
        maxValue: 0.12,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 10,
        maxValue: 15,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Ambystoma_mexicanum_1.jpg",
      alt: "Axolotl at the Steinhart Aquarium in San Francisco",
      creator: "Stan Shebs",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Ambystoma_mexicanum_1.jpg",
    },
  },
  {
    slug: "great-white-shark",
    commonName: "Great white shark",
    scientificName: "Carcharodon carcharias",
    animalGroup: "FISH",
    diet: "CARNIVORE",
    activityPattern: "CATHEMERAL",
    sizeCategory: "VERY_LARGE",
    featured: true,
    summary:
      "The great white shark is a wide-ranging lamnid predator of marine mammals, fishes and scavenged whales. It is fully aquatic and regional endothermy supports bursts of high performance in cool water.",
    taxonomy: t("FISH", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Chondrichthyes", "chondrichthyes"],
      ["Lamniformes", "lamniformes"],
      ["Lamnidae", "lamnidae"],
      ["Carcharodon", "carcharodon"],
      ["Carcharodon carcharias", "carcharodon-carcharias"],
    ]),
    habitats: [
      {
        slug: "marine",
        name: "Marine",
        description: "Coastal and offshore temperate to subtropical seas.",
      },
    ],
    regions: [
      {
        slug: "global-ocean",
        name: "Global ocean",
        type: "OCEAN",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "juvenile",
        name: "Juvenile",
        description:
          "Feeds more on fishes; uses nursery areas in some regions.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Takes larger prey including pinnipeds where available.",
      },
    ],
    adaptations: [
      {
        title: "Regional endothermy",
        explanation:
          "Vascular heat exchangers keep swimming muscles warmer than ambient water, supporting sustained cruising.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Ambush from below is documented at some seal colonies; diet is broader than that stereotype.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "DECREASING",
      yearAssessed: 2018,
      threats: ["Bycatch", "Direct fishing"],
      sourceUrl: "https://www.iucnredlist.org/species/3855/2878674",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 4.0,
        maxValue: 6.0,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 680,
        maxValue: 1100,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 56,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 30,
        maxValue: 70,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg",
      alt: "Great white shark swimming near the surface",
      creator: "Terry Goss",
      license: "CC_BY_SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:White_shark.jpg",
    },
  },
  {
    slug: "honey-bee",
    commonName: "Western honey bee",
    scientificName: "Apis mellifera",
    animalGroup: "INVERTEBRATE",
    diet: "NECTARIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "TINY",
    summary:
      "The western honey bee is a eusocial insect managed worldwide for honey and crop pollination. Wild and feral colonies still exist, but parasites and landscape change affect health. This is not a native-everywhere species; humans moved it globally.",
    taxonomy: t("INVERTEBRATE", [
      ["Animalia", "animalia"],
      ["Arthropoda", "arthropoda"],
      ["Insecta", "insecta"],
      ["Hymenoptera", "hymenoptera"],
      ["Apidae", "apidae"],
      ["Apis", "apis"],
      ["Apis mellifera", "apis-mellifera"],
    ]),
    habitats: [
      {
        slug: "grassland",
        name: "Grassland and meadow",
        description: "Flower-rich landscapes supplying nectar and pollen.",
      },
    ],
    regions: [
      {
        slug: "africa",
        name: "Africa",
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
      {
        slug: "north-america",
        name: "North America",
        type: "CONTINENT",
        rangeType: "INTRODUCED",
      },
    ],
    stages: [
      {
        slug: "egg",
        name: "Egg",
        description: "Laid in wax cells by the queen.",
      },
      {
        slug: "larva",
        name: "Larva",
        description:
          "Fed royal jelly then pollen and honey depending on caste.",
      },
      {
        slug: "pupa",
        name: "Pupa",
        description: "Metamorphoses inside a capped cell.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Workers, drones and a queen with strongly different roles.",
      },
    ],
    adaptations: [
      {
        title: "Waggle dance",
        explanation:
          "Returning foragers encode direction and distance to resources, a rare example of symbolic communication in insects.",
      },
    ],
    behaviours: [
      {
        category: "SOCIAL",
        summary:
          "Colony is a superorganism with division of labour and overlapping generations.",
      },
    ],
    conservation: {
      status: "DD",
      populationTrend: "UNKNOWN",
      yearAssessed: 2019,
      threats: ["Parasites", "Pesticides", "Floral scarcity"],
      sourceUrl: "https://www.iucnredlist.org/species/42463611/42463671",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 0.01,
        maxValue: 0.02,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        typicalValue: 0.0001,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 0.04,
        maxValue: 0.15,
        unit: "YEAR",
        qualifier: "TYPICAL",
        notes: "Workers in summer live weeks; queens live years.",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/9/99/Apis_mellifera_-_honey_bee.jpg",
      alt: "Western honey bee on a flower",
      creator: "Sam Fraser-Smith",
      license: "CC_BY",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Apis_mellifera_-_honey_bee.jpg",
    },
  },
  {
    slug: "barn-owl",
    commonName: "Barn owl",
    scientificName: "Tyto alba",
    animalGroup: "BIRD",
    diet: "CARNIVORE",
    activityPattern: "NOCTURNAL",
    sizeCategory: "SMALL",
    summary:
      "The barn owl is a nearly cosmopolitan owl that hunts small mammals by sound. Heart-shaped facial discs funnel noise toward asymmetrically placed ears.",
    taxonomy: t("BIRD", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Aves", "aves"],
      ["Strigiformes", "strigiformes"],
      ["Tytonidae", "tytonidae"],
      ["Tyto", "tyto"],
      ["Tyto alba", "tyto-alba"],
    ]),
    habitats: [
      {
        slug: "grassland",
        name: "Grassland and farmland",
        description: "Open country with rodent prey and cavities for nesting.",
      },
    ],
    regions: [
      {
        slug: "europe",
        name: "Europe",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
      {
        slug: "africa",
        name: "Africa",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
      {
        slug: "americas",
        name: "Americas",
        type: "BIOGEOGRAPHIC",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "nestling",
        name: "Nestling",
        description: "Raised in cavities, barns and nest boxes.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Mostly nocturnal hunter; pairs may reuse sites.",
      },
    ],
    adaptations: [
      {
        title: "Asymmetric ears",
        explanation:
          "Left and right ear openings sit at different heights, improving vertical localisation of rustling prey in darkness.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Specialises on small mammals; silent flight reduces detection.",
      },
    ],
    conservation: {
      status: "LC",
      populationTrend: "DECREASING",
      yearAssessed: 2021,
      threats: ["Rodenticides", "Road mortality"],
      sourceUrl: "https://www.iucnredlist.org/species/22688504/155542941",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 0.25,
        maxValue: 0.5,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "WINGSPAN",
        minValue: 0.8,
        maxValue: 0.95,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 4,
        maxValue: 10,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Barn_Owl_%28Tyto_alba%29.jpg",
      alt: "Barn owl perched facing the camera",
      creator: "सुगम पोखरेल",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Barn_Owl_(Tyto_alba).jpg",
    },
  },
  {
    slug: "clownfish",
    commonName: "Ocellaris clownfish",
    scientificName: "Amphiprion ocellaris",
    animalGroup: "FISH",
    diet: "OMNIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "TINY",
    summary:
      "The ocellaris clownfish lives among sea anemones on coral reefs. It is a sequential hermaphrodite: the largest fish in a group is typically female.",
    taxonomy: t("FISH", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Actinopterygii", "actinopterygii"],
      ["Ovalentaria", "ovalentaria"],
      ["Pomacentridae", "pomacentridae"],
      ["Amphiprion", "amphiprion"],
      ["Amphiprion ocellaris", "amphiprion-ocellaris"],
    ]),
    habitats: [
      {
        slug: "coral-reef",
        name: "Coral reef",
        description: "Shallow tropical reefs with host anemones.",
      },
    ],
    regions: [
      {
        slug: "indian-ocean",
        name: "Indian Ocean",
        type: "OCEAN",
        rangeType: "NATIVE",
      },
      {
        slug: "pacific-ocean",
        name: "Pacific Ocean",
        type: "OCEAN",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "larva",
        name: "Larva",
        description: "Pelagic larvae before settling to a reef.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Lives in a size-based social queue around an anemone.",
      },
    ],
    adaptations: [
      {
        title: "Anemone mucus coat",
        explanation:
          "A protective mucus layer reduces firing of host nematocysts, allowing the fish to shelter among tentacles.",
      },
    ],
    behaviours: [
      {
        category: "SOCIAL",
        summary:
          "Size-dominant hierarchy; if the female disappears, a breeding male may change sex.",
      },
    ],
    conservation: {
      status: "LC",
      populationTrend: "UNKNOWN",
      yearAssessed: 2021,
      threats: ["Reef degradation", "Aquarium harvest in some areas"],
      sourceUrl: "https://www.iucnredlist.org/species/188331/1856696",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 0.08,
        maxValue: 0.11,
        unit: "M",
        qualifier: "ADULT",
      },
      { type: "BODY_MASS", typicalValue: 0.02, unit: "KG", qualifier: "ADULT" },
      {
        type: "LIFESPAN",
        minValue: 6,
        maxValue: 10,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Amphiprion_ocellaris_%28Clown_anemonefish%29_by_Nick_Hobgood.jpg",
      alt: "Ocellaris clownfish among anemone tentacles",
      creator: "Nick Hobgood",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Amphiprion_ocellaris_(Clown_anemonefish)_by_Nick_Hobgood.jpg",
    },
  },
  {
    slug: "whale-shark",
    commonName: "Whale shark",
    scientificName: "Rhincodon typus",
    animalGroup: "FISH",
    diet: "FILTER_FEEDER",
    activityPattern: "DIURNAL",
    sizeCategory: "VERY_LARGE",
    summary:
      "The whale shark is the largest living fish. It filter-feeds on plankton and small fishes and is highly migratory. Despite its size it is not a hunter of large prey.",
    taxonomy: t("FISH", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Chondrichthyes", "chondrichthyes"],
      ["Orectolobiformes", "orectolobiformes"],
      ["Rhincodontidae", "rhincodontidae"],
      ["Rhincodon", "rhincodon"],
      ["Rhincodon typus", "rhincodon-typus"],
    ]),
    habitats: [
      {
        slug: "marine",
        name: "Marine",
        description: "Tropical and warm-temperate surface waters.",
      },
    ],
    regions: [
      {
        slug: "tropical-oceans",
        name: "Tropical oceans",
        type: "OCEAN",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "juvenile",
        name: "Juvenile",
        description: "Poorly known early life; neonates are rarely observed.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Aggregates at seasonal feeding sites rich in plankton.",
      },
    ],
    adaptations: [
      {
        title: "Gill raker filter",
        explanation:
          "Modified gill rakers strain tiny prey from huge volumes of water as the shark ram- or suction-feeds.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Filter feeding at the surface or in the water column; not a mammalian predator.",
      },
    ],
    conservation: {
      status: "EN",
      populationTrend: "DECREASING",
      yearAssessed: 2016,
      threats: ["Bycatch", "Vessel strikes", "Directed fisheries"],
      sourceUrl: "https://www.iucnredlist.org/species/19488/2365291",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 8,
        maxValue: 12,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 9000,
        maxValue: 20000,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 70,
        maxValue: 100,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Whale_shark_Georgia_aquarium.jpg",
      alt: "Whale shark swimming in an aquarium exhibit",
      creator: "Zac Wolf",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Whale_shark_Georgia_aquarium.jpg",
    },
  },
  {
    slug: "saltwater-crocodile",
    commonName: "Saltwater crocodile",
    scientificName: "Crocodylus porosus",
    animalGroup: "REPTILE",
    diet: "CARNIVORE",
    activityPattern: "NOCTURNAL",
    sizeCategory: "VERY_LARGE",
    summary:
      "The saltwater crocodile is the largest living reptile. It occupies rivers, mangroves and coastal waters from South Asia to northern Australia and can travel at sea.",
    taxonomy: t("REPTILE", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Reptilia", "reptilia"],
      ["Crocodylia", "crocodylia"],
      ["Crocodylidae", "crocodylidae"],
      ["Crocodylus", "crocodylus"],
      ["Crocodylus porosus", "crocodylus-porosus"],
    ]),
    habitats: [
      {
        slug: "mangrove",
        name: "Mangrove and estuary",
        description: "Tidal rivers and coasts used by adults.",
      },
      {
        slug: "freshwater",
        name: "Freshwater",
        description: "Rivers and billabongs, especially for nesting.",
      },
    ],
    regions: [
      { slug: "asia", name: "Asia", type: "CONTINENT", rangeType: "NATIVE" },
      {
        slug: "oceania",
        name: "Oceania",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "hatchling",
        name: "Hatchling",
        description:
          "Guarded after hatching; diet is invertebrates and small vertebrates.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Apex ambush predator capable of taking large mammals at the water's edge.",
      },
    ],
    adaptations: [
      {
        title: "Salt-excreting glands",
        explanation:
          "Lingual salt glands allow prolonged use of saline habitats that freshwater crocodiles tolerate less well.",
      },
    ],
    behaviours: [
      {
        category: "TERRITORIAL",
        summary:
          "Large males defend stretches of river; nesting females guard mounds.",
      },
    ],
    conservation: {
      status: "LC",
      populationTrend: "STABLE",
      yearAssessed: 2021,
      threats: ["Local hunting", "Habitat conversion"],
      sourceUrl: "https://www.iucnredlist.org/species/5668/3047556",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 4.0,
        maxValue: 6.0,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 400,
        maxValue: 1000,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 29,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
        notes: "Short swimming bursts.",
      },
      {
        type: "LIFESPAN",
        minValue: 50,
        maxValue: 70,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Saltwater_Crocodile_%28Crocodylus_porosus%29_%2810106331165%29.jpg",
      alt: "Saltwater crocodile resting on a muddy bank",
      creator: "Bernard DUPONT",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Saltwater_Crocodile_(Crocodylus_porosus)_(10106331165).jpg",
    },
  },
  {
    slug: "golden-poison-frog",
    commonName: "Golden poison frog",
    scientificName: "Phyllobates terribilis",
    animalGroup: "AMPHIBIAN",
    diet: "INSECTIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "TINY",
    summary:
      "The golden poison frog is a diurnal dendrobatid of Colombian rainforest. Wild toxicity comes from dietary alkaloids; captive-bred frogs lacking those prey are not comparably toxic.",
    taxonomy: t("AMPHIBIAN", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Amphibia", "amphibia"],
      ["Anura", "anura"],
      ["Dendrobatidae", "dendrobatidae"],
      ["Phyllobates", "phyllobates"],
      ["Phyllobates terribilis", "phyllobates-terribilis"],
    ]),
    habitats: [
      {
        slug: "tropical-rainforest",
        name: "Tropical rainforest",
        description:
          "Humid forest floor and low vegetation on the Pacific coast of Colombia.",
      },
    ],
    regions: [
      {
        slug: "south-america",
        name: "South America",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "egg",
        name: "Egg",
        description:
          "Terrestrial eggs; males often transport tadpoles to water.",
      },
      {
        slug: "tadpole",
        name: "Tadpole",
        description: "Aquatic larva before metamorphosis.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Diurnal, territorial frog with aposematic colouration.",
      },
    ],
    adaptations: [
      {
        title: "Dietary alkaloids",
        explanation:
          "Batrachotoxins acquired from arthropod prey make wild frogs dangerous to handle; colour advertises the defence.",
      },
    ],
    behaviours: [
      {
        category: "PARENTAL",
        summary: "Males typically carry tadpoles to small water bodies.",
      },
    ],
    conservation: {
      status: "EN",
      populationTrend: "DECREASING",
      yearAssessed: 2017,
      threats: ["Habitat loss", "Illegal collection"],
      sourceUrl: "https://www.iucnredlist.org/species/55264/11266026",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 0.045,
        maxValue: 0.055,
        unit: "M",
        qualifier: "ADULT",
      },
      { type: "BODY_MASS", typicalValue: 0.03, unit: "KG", qualifier: "ADULT" },
      {
        type: "LIFESPAN",
        minValue: 5,
        maxValue: 10,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Phyllobates_terribilis.jpg",
      alt: "Golden poison frog on a leaf",
      creator: "Biodiego88",
      license: "CC_BY",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Phyllobates_terribilis.jpg",
    },
  },
  {
    slug: "american-bison",
    commonName: "American bison",
    scientificName: "Bison bison",
    animalGroup: "MAMMAL",
    diet: "HERBIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "VERY_LARGE",
    summary:
      "The American bison is a grazing bovid of North American grasslands. Near extinction in the nineteenth century was followed by recovery in protected herds; most animals today live under some management.",
    taxonomy: t("MAMMAL", [
      ["Animalia", "animalia"],
      ["Chordata", "chordata"],
      ["Mammalia", "mammalia"],
      ["Artiodactyla", "artiodactyla"],
      ["Bovidae", "bovidae"],
      ["Bison", "bison"],
      ["Bison bison", "bison-bison"],
    ]),
    habitats: [
      {
        slug: "grassland",
        name: "Grassland",
        description:
          "Prairies and parklands where grazing maintains open structure.",
      },
    ],
    regions: [
      {
        slug: "north-america",
        name: "North America",
        type: "CONTINENT",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "calf",
        name: "Calf",
        description: "Born in spring; follows the mother within hours.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Lives in mixed herds; bulls compete during the rut.",
      },
    ],
    adaptations: [
      {
        title: "Massive forequarters",
        explanation:
          "A heavy head and shoulder hump help sweep snow aside to reach winter forage.",
      },
    ],
    behaviours: [
      {
        category: "SOCIAL",
        summary:
          "Gregarious grazer; herd size varies with season and management.",
      },
    ],
    conservation: {
      status: "NT",
      populationTrend: "STABLE",
      yearAssessed: 2017,
      threats: ["Habitat loss", "Genetic introgression from cattle"],
      sourceUrl: "https://www.iucnredlist.org/species/2815/123789863",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 400,
        maxValue: 1000,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "HEIGHT",
        minValue: 1.5,
        maxValue: 1.9,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 55,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 15,
        maxValue: 25,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/American_bison_k5680-1.jpg",
      alt: "American bison standing in grassland",
      creator: "Jack Dykinga",
      license: "PUBLIC_DOMAIN",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:American_bison_k5680-1.jpg",
    },
  },
  {
    slug: "giant-squid",
    commonName: "Giant squid",
    scientificName: "Architeuthis dux",
    animalGroup: "INVERTEBRATE",
    diet: "CARNIVORE",
    activityPattern: "CATHEMERAL",
    sizeCategory: "VERY_LARGE",
    summary:
      "The giant squid is a deep-ocean cephalopod known mainly from carcasses and rare live observations. Two elongated feeding tentacles plus eight arms capture prey in darkness.",
    taxonomy: t("INVERTEBRATE", [
      ["Animalia", "animalia"],
      ["Mollusca", "mollusca"],
      ["Cephalopoda", "cephalopoda"],
      ["Oegopsida", "oegopsida"],
      ["Architeuthidae", "architeuthidae"],
      ["Architeuthis", "architeuthis"],
      ["Architeuthis dux", "architeuthis-dux"],
    ]),
    habitats: [
      {
        slug: "marine",
        name: "Marine",
        description:
          "Deep pelagic waters; most records are from temperate oceans.",
      },
    ],
    regions: [
      {
        slug: "global-ocean",
        name: "Global ocean",
        type: "OCEAN",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "paralarva",
        name: "Paralarva",
        description: "Little is documented; presumed planktonic start.",
      },
      {
        slug: "adult",
        name: "Adult",
        description: "Solitary deep-water hunter preyed upon by sperm whales.",
      },
    ],
    adaptations: [
      {
        title: "Huge eyes",
        explanation:
          "Among the largest eyes in the animal kingdom, likely for detecting silhouettes or bioluminescence in dim water.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary: "Uses feeding tentacles to strike at fishes and other squid.",
      },
    ],
    conservation: {
      status: "LC",
      populationTrend: "UNKNOWN",
      yearAssessed: 2014,
      threats: ["Poorly known; deep-sea change may matter"],
      sourceUrl: "https://www.iucnredlist.org/species/163240/835858",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 8,
        maxValue: 13,
        unit: "M",
        qualifier: "ADULT",
        notes: "Including tentacles; mantle is much shorter.",
      },
      {
        type: "BODY_MASS",
        minValue: 200,
        maxValue: 275,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 3,
        maxValue: 5,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Giant_squid_Ranheim.jpg",
      alt: "Giant squid specimen photographed in Ranheim",
      creator: "NTNU Vitenskapsmuseet",
      license: "CC_BY",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Giant_squid_Ranheim.jpg",
    },
  },
];
