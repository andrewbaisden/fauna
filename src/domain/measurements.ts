import {
  type CanonicalUnit,
  convertValue,
  type UnitSystem,
} from "@/domain/units";
import { formatNumber } from "@/lib/utils";

export type MeasurementType =
  | "BODY_MASS"
  | "HEIGHT"
  | "LENGTH"
  | "WINGSPAN"
  | "TOP_SPEED"
  | "LIFESPAN";

export type MeasurementQualifier =
  | "ADULT"
  | "JUVENILE"
  | "NEONATE"
  | "TYPICAL"
  | "MAXIMUM_RECORDED"
  | "AVERAGE";

export type Sex = "ANY" | "FEMALE" | "MALE";

export interface MeasurementRecord {
  type: MeasurementType;
  minValue: number | null;
  maxValue: number | null;
  typicalValue: number | null;
  unit: CanonicalUnit;
  qualifier: MeasurementQualifier;
  sex: Sex;
  notes?: string | null;
}

export const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  BODY_MASS: "Mass",
  HEIGHT: "Height",
  LENGTH: "Length",
  WINGSPAN: "Wingspan",
  TOP_SPEED: "Top speed",
  LIFESPAN: "Lifespan",
};

export const QUALIFIER_LABELS: Record<MeasurementQualifier, string> = {
  ADULT: "adult",
  JUVENILE: "juvenile",
  NEONATE: "newborn",
  TYPICAL: "typical",
  MAXIMUM_RECORDED: "maximum recorded",
  AVERAGE: "average",
};

export function representativeValue(
  measurement: MeasurementRecord,
): number | null {
  if (measurement.typicalValue != null) {
    return measurement.typicalValue;
  }

  if (measurement.minValue != null && measurement.maxValue != null) {
    return (measurement.minValue + measurement.maxValue) / 2;
  }

  return measurement.maxValue ?? measurement.minValue;
}

export function formatMeasurement(
  measurement: MeasurementRecord,
  system: UnitSystem,
): string {
  const parts: string[] = [];

  if (
    measurement.minValue != null &&
    measurement.maxValue != null &&
    measurement.minValue !== measurement.maxValue
  ) {
    const min = convertValue(measurement.minValue, measurement.unit, system);
    const max = convertValue(measurement.maxValue, measurement.unit, system);
    parts.push(
      `${formatNumber(min.value)}–${formatNumber(max.value)} ${max.unitLabel}`,
    );
  } else {
    const value = representativeValue(measurement);
    if (value == null) {
      return "Not reported";
    }
    const converted = convertValue(value, measurement.unit, system);
    const prefix = measurement.qualifier === "MAXIMUM_RECORDED" ? "up to " : "";
    parts.push(
      `${prefix}${formatNumber(converted.value)} ${converted.unitLabel}`,
    );
  }

  if (
    measurement.qualifier !== "TYPICAL" &&
    measurement.qualifier !== "AVERAGE"
  ) {
    parts.push(`(${QUALIFIER_LABELS[measurement.qualifier]})`);
  }

  return parts.join(" ");
}

export function formatDualMeasurement(
  measurement: MeasurementRecord,
  system: UnitSystem,
): { primary: string; secondary: string } {
  const other: UnitSystem = system === "METRIC" ? "IMPERIAL" : "METRIC";
  return {
    primary: formatMeasurement(measurement, system),
    secondary: `≈ ${formatMeasurement(measurement, other)}`,
  };
}

export function pickMeasurement(
  measurements: MeasurementRecord[],
  type: MeasurementType,
): MeasurementRecord | undefined {
  return measurements.find((item) => item.type === type);
}
