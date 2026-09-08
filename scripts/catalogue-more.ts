export const catalogue = [
  {
    slug: "polar-bear",
    commonName: "Polar bear",
    scientificName: "Ursus maritimus",
    animalGroup: "MAMMAL",
    diet: "CARNIVORE",
    activityPattern: "CATHEMERAL",
    sizeCategory: "VERY_LARGE",
    featured: true,
    summary:
      "The polar bear is a marine mammal of the Arctic sea-ice ecosystem. It hunts seals at breathing holes and ice edges; sea-ice loss is the central conservation pressure.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Carnivora", slug: "carnivora" },
      { rank: "FAMILY", scientificName: "Ursidae", slug: "ursidae" },
      { rank: "GENUS", scientificName: "Ursus", slug: "ursus" },
      {
        rank: "SPECIES",
        scientificName: "Ursus maritimus",
        slug: "ursus-maritimus",
      },
    ],
    habitats: [
      {
        slug: "sea-ice",
        name: "Sea ice",
        description:
          "Frozen marine habitat used for hunting seals and travelling.",
      },
      {
        slug: "tundra",
        name: "Tundra",
        description:
          "Coastal land used when ice is absent, often with reduced hunting success.",
      },
    ],
    regions: [
      {
        slug: "arctic",
        name: "Arctic",
        type: "BIOGEOGRAPHIC",
        rangeType: "NATIVE",
      },
    ],
    stages: [
      {
        slug: "cub",
        name: "Cub",
        description:
          "Born in snow dens; twins are common; they stay with the mother for more than two years.",
      },
      {
        slug: "subadult",
        name: "Subadult",
        description: "Independent but still learning to hunt on shifting ice.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Solitary except for mating and family groups of females with cubs.",
      },
    ],
    adaptations: [
      {
        title: "Fur and fat insulation",
        explanation:
          "Dense fur and a thick adipose layer reduce heat loss in water and wind. Dark skin beneath translucent hair absorbs solar radiation.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary: "Primarily hunts ringed and bearded seals from sea ice.",
      },
      {
        category: "PARENTAL",
        summary:
          "Females fast in dens while nursing cubs, then lead them onto the ice.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "DECREASING",
      yearAssessed: 2015,
      threats: ["Sea-ice loss", "Pollution", "Human disturbance"],
      sourceUrl: "https://www.iucnredlist.org/species/22823/14871490",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 150,
        maxValue: 800,
        unit: "KG",
        qualifier: "ADULT",
        notes: "Strong sexual dimorphism.",
      },
      {
        type: "LENGTH",
        minValue: 2.0,
        maxValue: 3.0,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 40,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 20,
        maxValue: 30,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/09/Polar_Bear_-_Alaska.jpg",
      alt: "Polar bear walking on snow in Alaska",
      creator: "Alan Wilson",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Polar_Bear_-_Alaska.jpg",
    },
  },
  {
    slug: "cheetah",
    commonName: "Cheetah",
    scientificName: "Acinonyx jubatus",
    animalGroup: "MAMMAL",
    diet: "CARNIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "MEDIUM",
    featured: true,
    summary:
      "The cheetah is a lightly built felid specialised for short, high-speed chases in open habitat. Low genetic diversity and habitat fragmentation constrain many populations.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Carnivora", slug: "carnivora" },
      { rank: "FAMILY", scientificName: "Felidae", slug: "felidae" },
      { rank: "GENUS", scientificName: "Acinonyx", slug: "acinonyx" },
      {
        rank: "SPECIES",
        scientificName: "Acinonyx jubatus",
        slug: "acinonyx-jubatus",
      },
    ],
    habitats: [
      {
        slug: "savanna",
        name: "Savanna",
        description:
          "Open grassland and woodland edges that allow long visual chases.",
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
          "Mantle fur may provide camouflage; cub mortality is high.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Females are usually solitary with cubs; males may form coalitions.",
      },
    ],
    adaptations: [
      {
        title: "Flexible spine and long limbs",
        explanation:
          "A highly flexible lumbar spine increases stride length during a sprint, trading climbing power for acceleration.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Diurnal hunter of small to medium ungulates; kills are often lost to larger carnivores.",
      },
    ],
    conservation: {
      status: "VU",
      populationTrend: "DECREASING",
      yearAssessed: 2021,
      threats: ["Habitat loss", "Conflict", "Illegal trade"],
      sourceUrl: "https://www.iucnredlist.org/species/219/124366642",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 21,
        maxValue: 72,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LENGTH",
        minValue: 1.1,
        maxValue: 1.5,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 103,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 8,
        maxValue: 12,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Cheetah_%28Acinonyx_jubatus%29_female_2.jpg",
      alt: "Female cheetah lying in grass at Phinda Private Game Reserve",
      creator: "Charles J. Sharp",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_female_2.jpg",
    },
  },
  {
    slug: "blue-whale",
    commonName: "Blue whale",
    scientificName: "Balaenoptera musculus",
    animalGroup: "MAMMAL",
    diet: "FILTER_FEEDER",
    activityPattern: "CATHEMERAL",
    sizeCategory: "VERY_LARGE",
    featured: true,
    summary:
      "The blue whale is the largest known animal. It lunge-feeds on krill in productive oceans. Populations remain far below pre-whaling estimates in most ocean basins.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Artiodactyla", slug: "artiodactyla" },
      {
        rank: "FAMILY",
        scientificName: "Balaenopteridae",
        slug: "balaenopteridae",
      },
      { rank: "GENUS", scientificName: "Balaenoptera", slug: "balaenoptera" },
      {
        rank: "SPECIES",
        scientificName: "Balaenoptera musculus",
        slug: "balaenoptera-musculus",
      },
    ],
    habitats: [
      {
        slug: "marine",
        name: "Marine",
        description: "Open ocean feeding and migratory corridors.",
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
        slug: "calf",
        name: "Calf",
        description:
          "Nursed on fat-rich milk; grows extremely quickly in the first months.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Migrates between feeding and breeding areas in several populations.",
      },
    ],
    adaptations: [
      {
        title: "Expandable throat pleats",
        explanation:
          "Ventral grooves let the mouth engulf enormous volumes of water and krill, then filter the catch through baleen.",
      },
    ],
    behaviours: [
      { category: "FEEDING", summary: "Lunge feeding on dense krill patches." },
      {
        category: "COMMUNICATION",
        summary:
          "Produces very low-frequency sounds that can travel long distances in water.",
      },
    ],
    conservation: {
      status: "EN",
      populationTrend: "INCREASING",
      yearAssessed: 2018,
      threats: ["Ship strikes", "Entanglement", "Historical whaling depletion"],
      sourceUrl: "https://www.iucnredlist.org/species/2477/156923585",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 80000,
        maxValue: 150000,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LENGTH",
        minValue: 24,
        maxValue: 30,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 48,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 70,
        maxValue: 90,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Blue_Whale_Tail_Fluke%2C_Indian_Ocean.JPG",
      alt: "Blue whale tail fluke above the Indian Ocean near Sri Lanka",
      creator: "Arvindkumarn",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Blue_Whale_Tail_Fluke,_Indian_Ocean.JPG",
    },
  },
  {
    slug: "western-gorilla",
    commonName: "Western gorilla",
    scientificName: "Gorilla gorilla",
    animalGroup: "MAMMAL",
    diet: "HERBIVORE",
    activityPattern: "DIURNAL",
    sizeCategory: "LARGE",
    summary:
      "The western gorilla is a forest ape living in family groups led by a silverback. Fruit availability strongly shapes ranging; Ebola, hunting and forest loss have driven steep declines.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Primates", slug: "primates" },
      { rank: "FAMILY", scientificName: "Hominidae", slug: "hominidae" },
      { rank: "GENUS", scientificName: "Gorilla", slug: "gorilla" },
      {
        rank: "SPECIES",
        scientificName: "Gorilla gorilla",
        slug: "gorilla-gorilla",
      },
    ],
    habitats: [
      {
        slug: "tropical-rainforest",
        name: "Tropical rainforest",
        description: "Dense equatorial forest with seasonal fruiting trees.",
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
        slug: "infant",
        name: "Infant",
        description: "Carried and nursed; weaning is gradual.",
      },
      {
        slug: "juvenile",
        name: "Juvenile",
        description: "Plays within the group and samples adult foods.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Males may become silverbacks and hold groups; females transfer between groups.",
      },
    ],
    adaptations: [
      {
        title: "Large gut for fibrous plants",
        explanation:
          "A capacious digestive tract processes leaves and pith when fruit is scarce, supporting a mostly herbivorous diet.",
      },
    ],
    behaviours: [
      {
        category: "SOCIAL",
        summary:
          "Cohesive groups with one dominant male and several females plus offspring.",
      },
      {
        category: "FEEDING",
        summary:
          "Day ranges track fruit; fallback foods include leaves, pith and invertebrates occasionally.",
      },
    ],
    conservation: {
      status: "CR",
      populationTrend: "DECREASING",
      yearAssessed: 2016,
      threats: ["Hunting", "Disease", "Forest loss"],
      sourceUrl: "https://www.iucnredlist.org/species/9404/136250677",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 70,
        maxValue: 180,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "HEIGHT",
        minValue: 1.4,
        maxValue: 1.8,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "LIFESPAN",
        minValue: 30,
        maxValue: 40,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Gorilla_Male_Global.jpg",
      alt: "Western gorilla male specimen, multiple views",
      creator: "Didier Descouens",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Gorilla_Male_Global.jpg",
    },
  },
  {
    slug: "red-fox",
    commonName: "Red fox",
    scientificName: "Vulpes vulpes",
    animalGroup: "MAMMAL",
    diet: "OMNIVORE",
    activityPattern: "NOCTURNAL",
    sizeCategory: "SMALL",
    summary:
      "The red fox is a highly adaptable canid occupying wild, rural and urban landscapes across the Northern Hemisphere. Diet is opportunistic rather than strictly carnivorous.",
    taxonomy: [
      { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
      { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
      { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
      { rank: "ORDER", scientificName: "Carnivora", slug: "carnivora" },
      { rank: "FAMILY", scientificName: "Canidae", slug: "canidae" },
      { rank: "GENUS", scientificName: "Vulpes", slug: "vulpes" },
      {
        rank: "SPECIES",
        scientificName: "Vulpes vulpes",
        slug: "vulpes-vulpes",
      },
    ],
    habitats: [
      {
        slug: "temperate-forest",
        name: "Temperate forest",
        description: "Woodland and edge habitats with small mammals and fruit.",
      },
      {
        slug: "urban",
        name: "Urban",
        description:
          "Cities and suburbs where refuse and rodents supplement wild prey.",
      },
    ],
    regions: [
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
        rangeType: "NATIVE",
      },
      {
        slug: "australia",
        name: "Australia",
        type: "CONTINENT",
        rangeType: "INTRODUCED",
      },
    ],
    stages: [
      {
        slug: "kit",
        name: "Kit",
        description: "Born in dens; both parents may provision.",
      },
      {
        slug: "adult",
        name: "Adult",
        description:
          "Territorial pairs or small family groups depending on resources.",
      },
    ],
    adaptations: [
      {
        title: "Hearing for hidden prey",
        explanation:
          "Sensitive hearing helps locate small mammals under snow or vegetation before a pouncing strike.",
      },
    ],
    behaviours: [
      {
        category: "FEEDING",
        summary:
          "Eats rodents, birds, invertebrates, fruit and scavenged food.",
      },
    ],
    conservation: {
      status: "LC",
      populationTrend: "STABLE",
      yearAssessed: 2016,
      threats: ["Local persecution", "Vehicle collisions"],
      sourceUrl: "https://www.iucnredlist.org/species/23062/46190249",
    },
    measurements: [
      {
        type: "BODY_MASS",
        minValue: 3,
        maxValue: 11,
        unit: "KG",
        qualifier: "ADULT",
      },
      {
        type: "LENGTH",
        minValue: 0.45,
        maxValue: 0.9,
        unit: "M",
        qualifier: "ADULT",
      },
      {
        type: "TOP_SPEED",
        typicalValue: 50,
        unit: "KM_H",
        qualifier: "MAXIMUM_RECORDED",
      },
      {
        type: "LIFESPAN",
        minValue: 2,
        maxValue: 6,
        unit: "YEAR",
        qualifier: "TYPICAL",
      },
    ],
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Alaska_Red_Fox_%28Vulpes_vulpes%29.jpg",
      alt: "Alaska red fox standing in grass",
      creator: "Gregory Smith",
      license: "CC_BY_SA",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Alaska_Red_Fox_(Vulpes_vulpes).jpg",
    },
  },
];
