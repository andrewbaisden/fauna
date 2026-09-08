"use client";

import {
  type MeasurementRecord,
  pickMeasurement,
  representativeValue,
} from "@/domain/measurements";
import {
  choosePrimaryLength,
  relativeScaleWidth,
  type SizeCategory,
  scaleReferencesFor,
} from "@/domain/scale";
import { convertValue } from "@/domain/units";
import { usePreferencesStore } from "@/features/species/state";
import { formatNumber } from "@/lib/utils";

export function ScaleComparison({
  sizeCategory,
  measurements,
  commonName,
}: {
  sizeCategory: SizeCategory;
  measurements: MeasurementRecord[];
  commonName: string;
}) {
  const unitSystem = usePreferencesStore((state) => state.unitSystem);
  const height = pickMeasurement(measurements, "HEIGHT");
  const length = pickMeasurement(measurements, "LENGTH");
  const animalMeters = choosePrimaryLength(
    height ? representativeValue(height) : null,
    length ? representativeValue(length) : null,
  );

  if (animalMeters == null) {
    return null;
  }

  const refs = scaleReferencesFor(sizeCategory);
  const max = Math.max(animalMeters, ...refs.map((item) => item.heightMeters));

  return (
    <section className="space-y-4">
      <h2 className="font-display text-3xl">Scale</h2>
      <p className="text-sm text-ink/70">
        Bars are proportional to a linear dimension (height or length). They are
        not mass. Human reference is 1.7&nbsp;m.
      </p>
      <ul className="space-y-3">
        <ScaleRow
          label={commonName}
          meters={animalMeters}
          max={max}
          unitSystem={unitSystem}
          accent
        />
        {refs.map((ref) => (
          <ScaleRow
            key={ref.id}
            label={ref.label}
            meters={ref.heightMeters}
            max={max}
            unitSystem={unitSystem}
          />
        ))}
      </ul>
    </section>
  );
}

function ScaleRow({
  label,
  meters,
  max,
  unitSystem,
  accent,
}: {
  label: string;
  meters: number;
  max: number;
  unitSystem: "METRIC" | "IMPERIAL";
  accent?: boolean;
}) {
  const converted = convertValue(meters, "M", unitSystem);
  return (
    <li>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {formatNumber(converted.value)} {converted.unitLabel}
        </span>
      </div>
      <div className="h-3 rounded-full bg-bark/10">
        <div
          className={`h-3 rounded-full ${accent ? "bg-moss" : "bg-bark/40"}`}
          style={{ width: `${relativeScaleWidth(meters, max)}%` }}
        />
      </div>
    </li>
  );
}
