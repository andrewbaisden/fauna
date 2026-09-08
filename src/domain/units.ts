export type UnitSystem = "METRIC" | "IMPERIAL";

export type CanonicalUnit = "KG" | "M" | "KM_H" | "YEAR";

export interface ConvertedMeasurement {
  value: number;
  unitLabel: string;
  system: UnitSystem;
}

const KG_TO_LB = 2.2046226218;
const M_TO_FT = 3.280839895;
const KM_H_TO_MPH = 0.6213711922;

export function convertValue(
  value: number,
  unit: CanonicalUnit,
  system: UnitSystem,
): ConvertedMeasurement {
  if (system === "METRIC") {
    switch (unit) {
      case "KG":
        return { value, unitLabel: "kg", system };
      case "M":
        return { value, unitLabel: "m", system };
      case "KM_H":
        return { value, unitLabel: "km/h", system };
      case "YEAR":
        return { value, unitLabel: value === 1 ? "year" : "years", system };
    }
  }

  switch (unit) {
    case "KG":
      return { value: value * KG_TO_LB, unitLabel: "lb", system };
    case "M":
      return { value: value * M_TO_FT, unitLabel: "ft", system };
    case "KM_H":
      return { value: value * KM_H_TO_MPH, unitLabel: "mph", system };
    case "YEAR":
      return { value, unitLabel: value === 1 ? "year" : "years", system };
  }
}

export function convertPair(
  metricValue: number,
  unit: CanonicalUnit,
): { metric: ConvertedMeasurement; imperial: ConvertedMeasurement } {
  return {
    metric: convertValue(metricValue, unit, "METRIC"),
    imperial: convertValue(metricValue, unit, "IMPERIAL"),
  };
}
