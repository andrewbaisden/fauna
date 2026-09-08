"use client";

import {
  formatDualMeasurement,
  MEASUREMENT_LABELS,
  type MeasurementRecord,
} from "@/domain/measurements";
import { usePreferencesStore } from "@/features/species/state";

export function MeasurementGrid({
  measurements,
}: {
  measurements: MeasurementRecord[];
}) {
  const unitSystem = usePreferencesStore((state) => state.unitSystem);

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {measurements.map((measurement) => {
        const formatted = formatDualMeasurement(measurement, unitSystem);
        return (
          <div
            key={`${measurement.type}-${measurement.qualifier}-${measurement.sex}`}
            className="rounded-2xl bg-sand/50 p-4"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-bark">
              {MEASUREMENT_LABELS[measurement.type]}
            </dt>
            <dd className="mt-1 font-display text-2xl">{formatted.primary}</dd>
            <dd className="text-sm text-ink/60">{formatted.secondary}</dd>
            {measurement.notes ? (
              <p className="mt-2 text-xs text-ink/60">{measurement.notes}</p>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}
