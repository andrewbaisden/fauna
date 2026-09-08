"use client";

import { usePreferencesStore } from "@/features/species/state";

export function UnitToggle() {
  const unitSystem = usePreferencesStore((state) => state.unitSystem);
  const setUnitSystem = usePreferencesStore((state) => state.setUnitSystem);

  return (
    <div
      className="hidden rounded-full border border-bark/20 p-0.5 text-xs sm:flex"
      role="group"
      aria-label="Unit system"
    >
      {(["METRIC", "IMPERIAL"] as const).map((system) => (
        <button
          key={system}
          type="button"
          className={`rounded-full px-2.5 py-1 ${unitSystem === system ? "bg-moss text-paper" : "text-ink/70"}`}
          onClick={() => setUnitSystem(system)}
          aria-pressed={unitSystem === system}
        >
          {system === "METRIC" ? "Metric" : "Imperial"}
        </button>
      ))}
    </div>
  );
}
