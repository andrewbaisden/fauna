import type {
  ACTIVITY_PATTERNS,
  ANIMAL_GROUPS,
  DIET_TYPES,
  SIZE_CATEGORIES,
} from "@/domain/search";

type AnimalGroup = (typeof ANIMAL_GROUPS)[number];
type DietType = (typeof DIET_TYPES)[number];
type ActivityPattern = (typeof ACTIVITY_PATTERNS)[number];
type SizeCategory = (typeof SIZE_CATEGORIES)[number];

export const GROUP_LABELS: Record<AnimalGroup, string> = {
  MAMMAL: "Mammals",
  BIRD: "Birds",
  REPTILE: "Reptiles",
  AMPHIBIAN: "Amphibians",
  FISH: "Fish",
  INVERTEBRATE: "Invertebrates",
};

export const GROUP_SINGULAR: Record<AnimalGroup, string> = {
  MAMMAL: "Mammal",
  BIRD: "Bird",
  REPTILE: "Reptile",
  AMPHIBIAN: "Amphibian",
  FISH: "Fish",
  INVERTEBRATE: "Invertebrate",
};

export const DIET_LABELS: Record<DietType, string> = {
  HERBIVORE: "Herbivore",
  CARNIVORE: "Carnivore",
  OMNIVORE: "Omnivore",
  INSECTIVORE: "Insectivore",
  FILTER_FEEDER: "Filter feeder",
  DETRITIVORE: "Detritivore",
  NECTARIVORE: "Nectarivore",
  PISCIVORE: "Piscivore",
  FRUGIVORE: "Frugivore",
  SCAVENGER: "Scavenger",
};

export const ACTIVITY_LABELS: Record<ActivityPattern, string> = {
  DIURNAL: "Mostly diurnal",
  NOCTURNAL: "Mostly nocturnal",
  CREPUSCULAR: "Crepuscular",
  CATHEMERAL: "Cathemeral",
};

export const SIZE_LABELS: Record<SizeCategory, string> = {
  TINY: "Tiny",
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large",
  VERY_LARGE: "Very large",
};

export const RANK_LABELS = {
  KINGDOM: "Kingdom",
  PHYLUM: "Phylum",
  CLASS: "Class",
  ORDER: "Order",
  FAMILY: "Family",
  GENUS: "Genus",
  SPECIES: "Species",
  SUBSPECIES: "Subspecies",
} as const;
