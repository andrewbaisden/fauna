export const catalogue = [
  {
    slug: "hippopotamus",
    commonName: "Hippopotamus",
    scientificName: "Hippopotamus amphibius",
    animalGroup: "MAMMAL",
    diet: "HERBIVORE",
    activityPattern: "NOCTURNAL",
    sizeCategory: "VERY_LARGE",
    summary:
      "The common hippopotamus is a large African ungulate that spends days in water and grazes on land at night. Territorial males defend stretches of river; most feeding is terrestrial grass, not aquatic plants.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Artiodactyla", slug: "artiodactyla" },
      {
        rank: "FAMILY",
        scientificName: "Hippopotamidae",
        slug: "hippopotamidae",
      },
      {
        rank: "GENUS",
        scientificName: "Hippopotamus",
        slug: "hippopotamus",
      },
      {
        rank: "SPECIES",
        scientificName: "Hippopotamus amphibius",
        slug: "hippopotamus-amphibius",
      },
    ],
    habitats: [
      {
        slug: "freshwater",
        name: "Freshwater",
        description:
          "Rivers, lakes and wetlands used as daytime refuges and social arenas.",
      },
      {
        slug: "savanna",
        name: "Savanna",
        description:
          "Floodplain grassland used for nocturnal grazing around water.",
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
          "Nurses underwater and on land; stays close to the mother in pods.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Males may hold river territories; females and young form groups.",
      },
    ],
    adaptations: [
      {
        title: "Semi-aquatic body",
        explanation:
          "Dense bone, high-set eyes and nostrils, and skin that needs moisture let hippos rest in water while remaining alert.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Leaves water at dusk to graze grasses, often several kilometres inland.",
      },
      {
        category: "SOCIAL",
        summary: "Pods form in water; fights among males can be severe.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "DECREASING",
      yearAssessed: 2016,
      threats: ["Habitat loss", "Unregulated hunting", "Drought"],
      sourceUrl: "https://www.iucnredlist.org/species/10103/18567364",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 1300,
        maxValue: 1800,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LENGTH",
        minValue: 2.9,
        maxValue: 5.0,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 35,
        maxValue: 50,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Hippo_pod_edit.jpg",
      alt: "Pod of hippopotamuses in the Luangwa Valley, Zambia",
      creator: "Paul Maritz",
      license: "CC_BY_SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hippo_pod_edit.jpg",
    },
  },
  {
    slug: "tiger",
    commonName: "Tiger",
    scientificName: "Panthera tigris",
    animalGroup: "MAMMAL",
    diet: "CARNIVORE",
    activityPattern: "CREPUSCULAR",
    sizeCategory: "LARGE",
    featured: true,
    summary:
      "The tiger is the largest living cat, a solitary forest hunter of Asia. Stripe patterns are individual; remaining populations are fragmented across a fraction of the historical range.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Carnivora", slug: "carnivora" },
      { rank: "FAMILY", scientificName: "Felidae", slug: "felidae" },
      { rank: "GENUS", scientificName: "Panthera", slug: "panthera" },
      {
        rank: "SPECIES",
        scientificName: "Panthera tigris",
        slug: "panthera-tigris",
      },
    ],
    habitats: [
      {
        slug: "tropical-forest",
        name: "Tropical forest",
        description:
          "Moist and dry forests with cover and ungulate prey, from mangrove to montane woodland.",
      },
    ],
    regions: [
      { slug: "asia", name: "Asia", type: "CONTINENT", rangeType: "NATIVE" },
    ],
    stages: [
      {
        slug: "cub",
        name: "Cub",
        description:
          "Born in dens and dependent on the mother for more than a year.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Solitary adults hold large territories sized by prey density and sex.",
      },
    ],
    adaptations: [
      {
        title: "Disruptive striping",
        explanation:
          "Vertical stripes break up the outline in tall grass and dappled forest light, aiding ambush rather than open pursuit.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Takes deer, wild pig and other large ungulates; surplus killing is rare.",
      },
      {
        category: "COMMUNICATION",
        summary:
          "Scent marks and vocalisations advertise occupancy of a range.",
      },
    ],
    conservation: {
      status: "EN",
      populationTrend: "DECREASING",
      yearAssessed: 2021,
      threats: ["Poaching", "Prey depletion", "Habitat fragmentation"],
      sourceUrl: "https://www.iucnredlist.org/species/15955/214862637",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 65,
        maxValue: 260,
        unit: "KG",
        qualifier: "ADULT",
        notes: "Mainland subspecies are larger than island forms.",
      },
      {
        type: "LENGTH",
        minValue: 1.4,
        maxValue: 2.8,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 8,
        maxValue: 15,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/49/Panthera_tigris_tigris.jpg",
      alt: "Bengal tiger in profile",
      creator: "John and Karen Hollingsworth, USFWS",
      license: "PUBLIC_DOMAIN",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Panthera_tigris_tigris.jpg",
    },
  },
  {
    slug: "king-cobra",
    commonName: "King cobra",
    scientificName: "Ophiophagus hannah",
    animalGroup: "REPTILE",
    diet: "CARNIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "LARGE",
    summary:
      "The king cobra is the longest venomous snake, a forest elapid of South and Southeast Asia that specialises on other snakes. It is not a true cobra (Naja) despite the hood display.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Reptilia", slug: "reptilia" },
      { rank: "ORDER", scientificName: "Squamata", slug: "squamata" },
      { rank: "FAMILY", scientificName: "Elapidae", slug: "elapidae" },
      {
        rank: "GENUS",
        scientificName: "Ophiophagus",
        slug: "ophiophagus",
      },
      {
        rank: "SPECIES",
        scientificName: "Ophiophagus hannah",
        slug: "ophiophagus-hannah",
      },
    ],
    habitats: [
      {
        slug: "tropical-forest",
        name: "Tropical forest",
        description:
          "Lowland and hill forest with dense cover and abundant snake prey.",
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
          "Independent from hatching; venomous from the first meal of small snakes.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Females may guard a nest of vegetation; adults are largely solitary.",
      },
    ],
    adaptations: [
      {
        title: "Ophiophagous diet",
        explanation:
          "A skull and venom suited to subduing other snakes, including other elapids, reduce competition with generalist predators.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary: "Primarily eats snakes; lizards and rodents are occasional.",
      },
      {
        category: "REPRODUCTIVE",
        summary:
          "Builds and may attend a nest of leaf litter — unusual among snakes.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "DECREASING",
      yearAssessed: 2011,
      threats: ["Habitat loss", "Persecution", "Collection"],
      sourceUrl: "https://www.iucnredlist.org/species/177540/148142882",
    },
    measurements: [
      {
        type: "LENGTH",
        minValue: 3.0,
        maxValue: 5.5,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "BODY_MASS",
        minValue: 5,
        maxValue: 12,
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
      url: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Ophiophagus_hannah.jpg",
      alt: "King cobra with hood spread",
      creator: "TimVickers",
      license: "PUBLIC_DOMAIN",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Ophiophagus_hannah.jpg",
    },
  },
  {
    slug: "giant-panda",
    commonName: "Giant panda",
    scientificName: "Ailuropoda melanoleuca",
    animalGroup: "MAMMAL",
    diet: "HERBIVORE",
    activityPattern: "CATHEMERAL",
    sizeCategory: "LARGE",
    summary:
      "The giant panda is a bear specialised on bamboo in montane forests of China. A carnivoran gut plus a ‘false thumb’ let it process a low-nutrient plant diet for most of the day.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Carnivora", slug: "carnivora" },
      { rank: "FAMILY", scientificName: "Ursidae", slug: "ursidae" },
      {
        rank: "GENUS",
        scientificName: "Ailuropoda",
        slug: "ailuropoda",
      },
      {
        rank: "SPECIES",
        scientificName: "Ailuropoda melanoleuca",
        slug: "ailuropoda-melanoleuca",
      },
    ],
    habitats: [
      {
        slug: "temperate-forest",
        name: "Temperate forest",
        description:
          "Cool montane bamboo forest in a few mountain ranges of south-central China.",
      },
    ],
    regions: [
      { slug: "asia", name: "Asia", type: "CONTINENT", rangeType: "NATIVE" },
    ],
    stages: [
      {
        slug: "cub",
        name: "Cub",
        description:
          "Altricial and tiny at birth relative to the mother; dens in tree hollows or caves.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Mostly solitary except during a short mating season; days are dominated by feeding.",
      },
    ],
    adaptations: [
      {
        title: "Radial sesamoid ‘thumb’",
        explanation:
          "An enlarged wrist bone opposes the paw and helps grasp bamboo culms — a feeding tool, not a true digit.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Eats tens of kilograms of bamboo daily; still an occasional scavenger or predator.",
      },
      {
        category: "SOCIAL",
        summary:
          "Scent marks advertise occupancy; ranges overlap more than in many solitary carnivores.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "INCREASING",
      yearAssessed: 2016,
      threats: ["Habitat fragmentation", "Bamboo flowering cycles"],
      sourceUrl: "https://www.iucnredlist.org/species/712/121745669",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 70,
        maxValue: 125,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LENGTH",
        minValue: 1.2,
        maxValue: 1.8,
        unit: "M",
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
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG",
      alt: "Giant panda at Ocean Park Hong Kong",
      creator: "J. Patrick Fischer",
      license: "CC_BY_SA",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Grosser_Panda.JPG",
    },
  },
];
