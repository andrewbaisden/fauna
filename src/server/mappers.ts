import type { MeasurementRecord } from "@/domain/measurements";
import type { Prisma } from "@/generated/prisma/client";

export const speciesCardInclude = {
  conservation: true,
  habitats: { include: { habitat: true } },
  media: true,
  measurements: true,
} satisfies Prisma.SpeciesInclude;

export const speciesProfileInclude = {
  taxon: true,
  aliases: true,
  habitats: { include: { habitat: true } },
  regions: { include: { region: true } },
  lifeStages: { orderBy: { sortOrder: "asc" } },
  adaptations: true,
  behaviours: true,
  conservation: { include: { source: true, threats: true } },
  measurements: { include: { source: true } },
  sources: { include: { source: true } },
  media: true,
  threeDAssets: true,
  rangeGeometries: { include: { source: true } },
} satisfies Prisma.SpeciesInclude;

export type SpeciesCardRecord = Prisma.SpeciesGetPayload<{
  include: typeof speciesCardInclude;
}>;
export type SpeciesProfileRecord = Prisma.SpeciesGetPayload<{
  include: typeof speciesProfileInclude;
}>;

export function toMeasurementRecord(
  measurement:
    | SpeciesProfileRecord["measurements"][number]
    | SpeciesCardRecord["measurements"][number],
): MeasurementRecord {
  return {
    type: measurement.type,
    minValue:
      measurement.minValue == null ? null : Number(measurement.minValue),
    maxValue:
      measurement.maxValue == null ? null : Number(measurement.maxValue),
    typicalValue:
      measurement.typicalValue == null
        ? null
        : Number(measurement.typicalValue),
    unit: measurement.unit,
    qualifier: measurement.qualifier,
    sex: measurement.sex,
    notes: measurement.notes,
  };
}

export function primaryImage(
  media: { kind: string; url: string; alt: string; attribution: string }[],
) {
  return media.find((item) => item.kind === "PHOTO") ?? media[0] ?? null;
}
