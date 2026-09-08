export type SizeCategory = "TINY" | "SMALL" | "MEDIUM" | "LARGE" | "VERY_LARGE";

export interface ScaleReference {
  id: string;
  label: string;
  heightMeters: number;
}

export const HUMAN_REFERENCE: ScaleReference = {
  id: "human",
  label: "Average adult human",
  heightMeters: 1.7,
};

const REFERENCES: Record<SizeCategory, ScaleReference[]> = {
  TINY: [
    { id: "coin", label: "2 pence coin", heightMeters: 0.026 },
    { id: "hand", label: "Human hand", heightMeters: 0.19 },
    HUMAN_REFERENCE,
  ],
  SMALL: [
    { id: "basketball", label: "Basketball", heightMeters: 0.24 },
    { id: "cat", label: "Domestic cat", heightMeters: 0.25 },
    HUMAN_REFERENCE,
  ],
  MEDIUM: [HUMAN_REFERENCE, { id: "door", label: "Door", heightMeters: 2.0 }],
  LARGE: [
    HUMAN_REFERENCE,
    { id: "car", label: "Family car", heightMeters: 1.5 },
    { id: "bus", label: "Double-decker bus", heightMeters: 4.4 },
  ],
  VERY_LARGE: [
    HUMAN_REFERENCE,
    { id: "bus", label: "Double-decker bus", heightMeters: 4.4 },
    { id: "house", label: "Two-storey house", heightMeters: 8 },
  ],
};

export function scaleReferencesFor(size: SizeCategory): ScaleReference[] {
  return REFERENCES[size];
}

export function relativeScaleWidth(
  valueMeters: number,
  maxMeters: number,
): number {
  if (maxMeters <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(2, (valueMeters / maxMeters) * 100));
}

export function choosePrimaryLength(
  heightMeters: number | null,
  lengthMeters: number | null,
): number | null {
  const candidates = [heightMeters, lengthMeters].filter(
    (value): value is number => value != null,
  );
  if (candidates.length === 0) {
    return null;
  }

  return Math.max(...candidates);
}
