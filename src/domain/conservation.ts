export type ConservationStatus =
  | "EX"
  | "EW"
  | "CR"
  | "EN"
  | "VU"
  | "NT"
  | "LC"
  | "DD"
  | "NE";

export type PopulationTrend =
  | "INCREASING"
  | "DECREASING"
  | "STABLE"
  | "UNKNOWN";

export const CONSERVATION_LABELS: Record<ConservationStatus, string> = {
  EX: "Extinct",
  EW: "Extinct in the Wild",
  CR: "Critically Endangered",
  EN: "Endangered",
  VU: "Vulnerable",
  NT: "Near Threatened",
  LC: "Least Concern",
  DD: "Data Deficient",
  NE: "Not Evaluated",
};

export const CONSERVATION_SHORT: Record<ConservationStatus, string> = {
  EX: "EX",
  EW: "EW",
  CR: "CR",
  EN: "EN",
  VU: "VU",
  NT: "NT",
  LC: "LC",
  DD: "DD",
  NE: "NE",
};

export const TREND_LABELS: Record<PopulationTrend, string> = {
  INCREASING: "Increasing",
  DECREASING: "Decreasing",
  STABLE: "Stable",
  UNKNOWN: "Unknown",
};

export function isThreatened(status: ConservationStatus): boolean {
  return status === "CR" || status === "EN" || status === "VU";
}

export function conservationTone(
  status: ConservationStatus,
): "critical" | "warning" | "ok" | "neutral" {
  if (status === "EX" || status === "EW" || status === "CR") {
    return "critical";
  }
  if (status === "EN" || status === "VU") {
    return "warning";
  }
  if (status === "LC") {
    return "ok";
  }
  return "neutral";
}
