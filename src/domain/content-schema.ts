import { z } from "zod";
import {
  activityPatternSchema,
  animalGroupSchema,
  conservationStatusSchema,
  dietTypeSchema,
  sizeCategorySchema,
} from "@/domain/search";

const taxonRankSchema = z.enum([
  "KINGDOM",
  "PHYLUM",
  "CLASS",
  "ORDER",
  "FAMILY",
  "GENUS",
  "SPECIES",
  "SUBSPECIES",
]);

export const speciesContentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  commonName: z.string().min(1),
  scientificName: z.string().min(1),
  aliases: z.array(z.string().min(1)).default([]),
  animalGroup: animalGroupSchema,
  diet: dietTypeSchema,
  activityPattern: activityPatternSchema.optional(),
  sizeCategory: sizeCategorySchema,
  featured: z.boolean().default(false),
  summary: z.string().min(40),
  taxonomy: z
    .array(
      z.object({
        rank: taxonRankSchema,
        scientificName: z.string().min(1),
        slug: z.string().min(1),
        commonName: z.string().optional(),
        gbifKey: z.number().int().optional(),
      }),
    )
    .min(6),
  habitats: z
    .array(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(20),
        notes: z.string().optional(),
      }),
    )
    .min(1),
  regions: z
    .array(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        type: z.enum(["CONTINENT", "OCEAN", "COUNTRY", "BIOGEOGRAPHIC"]),
        rangeType: z.enum(["NATIVE", "INTRODUCED", "VAGRANT", "MIGRATORY"]),
        notes: z.string().optional(),
      }),
    )
    .min(1),
  lifeStages: z
    .array(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        sortOrder: z.number().int().min(0),
        ageMin: z.number().optional(),
        ageMax: z.number().optional(),
        ageUnit: z.string().optional(),
        description: z.string().min(20),
        physicalTraits: z.string().optional(),
        behaviouralNotes: z.string().optional(),
        socialRole: z.string().optional(),
        dietNotes: z.string().optional(),
      }),
    )
    .min(2),
  adaptations: z
    .array(
      z.object({
        title: z.string().min(1),
        bodySystem: z.string().optional(),
        explanation: z.string().min(40),
        relatedMeasurementType: z
          .enum([
            "BODY_MASS",
            "HEIGHT",
            "LENGTH",
            "WINGSPAN",
            "TOP_SPEED",
            "LIFESPAN",
          ])
          .optional(),
      }),
    )
    .min(1),
  behaviours: z
    .array(
      z.object({
        category: z.enum([
          "SOCIAL",
          "FEEDING",
          "COMMUNICATION",
          "MIGRATION",
          "TERRITORIAL",
          "REPRODUCTIVE",
          "PARENTAL",
        ]),
        summary: z.string().min(20),
      }),
    )
    .min(1),
  conservation: z.object({
    status: conservationStatusSchema,
    populationTrend: z.enum(["INCREASING", "DECREASING", "STABLE", "UNKNOWN"]),
    yearAssessed: z.number().int().optional(),
    threats: z.array(z.string().min(1)).default([]),
    efforts: z.string().optional(),
    sourceKey: z.string().min(1),
  }),
  measurements: z
    .array(
      z.object({
        type: z.enum([
          "BODY_MASS",
          "HEIGHT",
          "LENGTH",
          "WINGSPAN",
          "TOP_SPEED",
          "LIFESPAN",
        ]),
        minValue: z.number().optional(),
        maxValue: z.number().optional(),
        typicalValue: z.number().optional(),
        unit: z.enum(["KG", "M", "KM_H", "YEAR"]),
        qualifier: z.enum([
          "ADULT",
          "JUVENILE",
          "NEONATE",
          "TYPICAL",
          "MAXIMUM_RECORDED",
          "AVERAGE",
        ]),
        sex: z.enum(["ANY", "FEMALE", "MALE"]).default("ANY"),
        notes: z.string().optional(),
        sourceKey: z.string().min(1),
      }),
    )
    .min(2),
  sources: z
    .array(
      z.object({
        key: z.string().min(1),
        title: z.string().min(1),
        url: z.string().url().optional(),
        publisher: z.string().optional(),
        accessedAt: z.string().min(8),
        license: z.string().optional(),
        roles: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
  media: z
    .array(
      z.object({
        kind: z.enum([
          "PHOTO",
          "ILLUSTRATION",
          "MAP_OVERLAY",
          "THUMBNAIL",
          "POSTER",
        ]),
        url: z.union([z.string().url(), z.string().regex(/^\/media\/.+/)]),
        alt: z.string().min(8),
        creator: z.string().min(1),
        license: z.enum([
          "CC0",
          "CC_BY",
          "CC_BY_SA",
          "SMITHSONIAN_OA",
          "PUBLIC_DOMAIN",
        ]),
        attribution: z.string().min(8),
        sourceUrl: z.string().url(),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
      }),
    )
    .min(1),
  threeD: z
    .array(
      z.object({
        url: z.string().min(1),
        format: z.string().default("GLB"),
        polyCount: z.number().int().optional(),
        fileSizeBytes: z.number().int().optional(),
        creator: z.string().min(1),
        source: z.string().min(1),
        license: z.enum([
          "CC0",
          "CC_BY",
          "CC_BY_SA",
          "SMITHSONIAN_OA",
          "PUBLIC_DOMAIN",
        ]),
        attribution: z.string().min(8),
        modified: z.boolean().default(false),
        version: z.string().min(1),
        posterImageUrl: z.string().optional(),
        fallbackImageUrl: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
  rangeGeometry: z
    .object({
      geojson: z.unknown(),
      confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
      sourceKey: z.string().min(1),
      notes: z.string().min(10),
    })
    .optional(),
});

export type SpeciesContent = z.infer<typeof speciesContentSchema>;

export function parseSpeciesContent(data: unknown): SpeciesContent {
  const parsed = speciesContentSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const sourceKeys = new Set(parsed.data.sources.map((source) => source.key));
  if (!sourceKeys.has(parsed.data.conservation.sourceKey)) {
    throw new Error(
      `Conservation sourceKey "${parsed.data.conservation.sourceKey}" is not defined in sources`,
    );
  }

  for (const measurement of parsed.data.measurements) {
    if (!sourceKeys.has(measurement.sourceKey)) {
      throw new Error(
        `Measurement sourceKey "${measurement.sourceKey}" is not defined in sources`,
      );
    }
    if (
      measurement.minValue == null &&
      measurement.maxValue == null &&
      measurement.typicalValue == null
    ) {
      throw new Error(
        `Measurement ${measurement.type} needs at least one numeric value`,
      );
    }
  }

  if (
    parsed.data.rangeGeometry &&
    !sourceKeys.has(parsed.data.rangeGeometry.sourceKey)
  ) {
    throw new Error(
      `Range geometry sourceKey "${parsed.data.rangeGeometry.sourceKey}" is not defined in sources`,
    );
  }

  return parsed.data;
}
