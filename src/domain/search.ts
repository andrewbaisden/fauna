import { z } from "zod";

export const ANIMAL_GROUPS = [
  "MAMMAL",
  "BIRD",
  "REPTILE",
  "AMPHIBIAN",
  "FISH",
  "INVERTEBRATE",
] as const;
export const DIET_TYPES = [
  "HERBIVORE",
  "CARNIVORE",
  "OMNIVORE",
  "INSECTIVORE",
  "FILTER_FEEDER",
  "DETRITIVORE",
  "NECTARIVORE",
  "PISCIVORE",
  "FRUGIVORE",
  "SCAVENGER",
] as const;
export const ACTIVITY_PATTERNS = [
  "DIURNAL",
  "NOCTURNAL",
  "CREPUSCULAR",
  "CATHEMERAL",
] as const;
export const SIZE_CATEGORIES = [
  "TINY",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "VERY_LARGE",
] as const;
export const CONSERVATION_STATUSES = [
  "EX",
  "EW",
  "CR",
  "EN",
  "VU",
  "NT",
  "LC",
  "DD",
  "NE",
] as const;

export const animalGroupSchema = z.enum(ANIMAL_GROUPS);
export const dietTypeSchema = z.enum(DIET_TYPES);
export const activityPatternSchema = z.enum(ACTIVITY_PATTERNS);
export const sizeCategorySchema = z.enum(SIZE_CATEGORIES);
export const conservationStatusSchema = z.enum(CONSERVATION_STATUSES);

export const explorerFiltersSchema = z.object({
  q: z.string().trim().max(120).optional().default(""),
  group: z.array(animalGroupSchema).optional().default([]),
  habitat: z.array(z.string().min(1)).optional().default([]),
  region: z.array(z.string().min(1)).optional().default([]),
  diet: z.array(dietTypeSchema).optional().default([]),
  status: z.array(conservationStatusSchema).optional().default([]),
  activity: z.array(activityPatternSchema).optional().default([]),
  size: z.array(sizeCategorySchema).optional().default([]),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export type ExplorerFilters = z.infer<typeof explorerFiltersSchema>;

function asList(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  const raw = Array.isArray(value) ? value : value.split(",");
  return raw.map((item) => item.trim()).filter(Boolean);
}

export function parseExplorerSearchParams(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
): ExplorerFilters {
  const read = (key: string): string | string[] | undefined => {
    if (params instanceof URLSearchParams) {
      const all = params.getAll(key);
      if (all.length > 1) {
        return all;
      }
      return params.get(key) ?? undefined;
    }
    return params[key];
  };

  return explorerFiltersSchema.parse({
    q: typeof read("q") === "string" ? read("q") : "",
    group: asList(read("group")),
    habitat: asList(read("habitat")),
    region: asList(read("region")),
    diet: asList(read("diet")),
    status: asList(read("status")),
    activity: asList(read("activity")),
    size: asList(read("size")),
    page: read("page") ?? 1,
  });
}

export function explorerQueryString(filters: ExplorerFilters): string {
  const search = new URLSearchParams();
  if (filters.q) {
    search.set("q", filters.q);
  }
  for (const [key, values] of [
    ["group", filters.group],
    ["habitat", filters.habitat],
    ["region", filters.region],
    ["diet", filters.diet],
    ["status", filters.status],
    ["activity", filters.activity],
    ["size", filters.size],
  ] as const) {
    if (values.length > 0) {
      search.set(key, values.join(","));
    }
  }
  if (filters.page > 1) {
    search.set("page", String(filters.page));
  }
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
}

export const PAGE_SIZE = 12;
