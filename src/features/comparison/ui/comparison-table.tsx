"use client";

import { compareMeasurements, normalisedBarWidth } from "@/domain/comparison";
import {
  formatMeasurement,
  MEASUREMENT_LABELS,
  type MeasurementRecord,
  pickMeasurement,
} from "@/domain/measurements";
import { usePreferencesStore } from "@/features/species/state";

const TYPES: MeasurementRecord["type"][] = [
  "BODY_MASS",
  "HEIGHT",
  "LENGTH",
  "WINGSPAN",
  "TOP_SPEED",
  "LIFESPAN",
];

export function ComparisonTable({
  leftName,
  rightName,
  left,
  right,
}: {
  leftName: string;
  rightName: string;
  left: MeasurementRecord[];
  right: MeasurementRecord[];
}) {
  const unitSystem = usePreferencesStore((state) => state.unitSystem);
  const rows = compareMeasurements(left, right);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-separate border-spacing-y-3 text-left">
        <caption className="mb-4 text-left text-sm text-ink/70">
          Bars are normalised to the larger of the two values in this
          comparison, not to all life on Earth.
        </caption>
        <thead>
          <tr className="text-sm">
            <th className="w-32 font-medium">Trait</th>
            <th>{leftName}</th>
            <th>{rightName}</th>
          </tr>
        </thead>
        <tbody>
          {TYPES.map((type) => {
            const row = rows.find((item) => item.type === type);
            const leftRecord = pickMeasurement(left, type);
            const rightRecord = pickMeasurement(right, type);
            const max = Math.max(row?.left ?? 0, row?.right ?? 0);
            if (!leftRecord && !rightRecord) {
              return null;
            }
            return (
              <tr key={type} className="align-top">
                <th className="pt-2 text-sm font-semibold">
                  {MEASUREMENT_LABELS[type]}
                </th>
                <td>
                  <ValueBlock
                    record={leftRecord}
                    width={normalisedBarWidth(row?.left ?? null, max)}
                    unitSystem={unitSystem}
                  />
                </td>
                <td>
                  <ValueBlock
                    record={rightRecord}
                    width={normalisedBarWidth(row?.right ?? null, max)}
                    unitSystem={unitSystem}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ValueBlock({
  record,
  width,
  unitSystem,
}: {
  record?: MeasurementRecord;
  width: number;
  unitSystem: "METRIC" | "IMPERIAL";
}) {
  if (!record) {
    return <p className="text-sm text-ink/50">Not reported</p>;
  }
  return (
    <div>
      <p className="font-display text-xl">
        {formatMeasurement(record, unitSystem)}
      </p>
      <div className="mt-2 h-2 rounded-full bg-bark/10">
        <div
          className="h-2 rounded-full bg-moss"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
