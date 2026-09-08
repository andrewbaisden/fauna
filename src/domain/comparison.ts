import {
  type MeasurementRecord,
  representativeValue,
} from "@/domain/measurements";

export interface ComparisonRow {
  type: MeasurementRecord["type"];
  left: number | null;
  right: number | null;
  unit: MeasurementRecord["unit"] | null;
  leftWins: boolean | null;
}

export function compareMeasurements(
  left: MeasurementRecord[],
  right: MeasurementRecord[],
): ComparisonRow[] {
  const types = [...new Set([...left, ...right].map((item) => item.type))];

  return types.map((type) => {
    const leftRecord = left.find((item) => item.type === type);
    const rightRecord = right.find((item) => item.type === type);
    const leftValue = leftRecord ? representativeValue(leftRecord) : null;
    const rightValue = rightRecord ? representativeValue(rightRecord) : null;
    const unit = leftRecord?.unit ?? rightRecord?.unit ?? null;

    let leftWins: boolean | null = null;
    if (leftValue != null && rightValue != null && leftValue !== rightValue) {
      leftWins = leftValue > rightValue;
    }

    return { type, left: leftValue, right: rightValue, unit, leftWins };
  });
}

export function normalisedBarWidth(
  value: number | null,
  maxValue: number,
): number {
  if (value == null || maxValue <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(4, (value / maxValue) * 100));
}
