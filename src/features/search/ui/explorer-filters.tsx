"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CONSERVATION_LABELS } from "@/domain/conservation";
import { DIET_LABELS, GROUP_LABELS, SIZE_LABELS } from "@/domain/labels";
import {
  ANIMAL_GROUPS,
  CONSERVATION_STATUSES,
  DIET_TYPES,
  SIZE_CATEGORIES,
} from "@/domain/search";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { captureEvent } from "@/lib/capture-event";

function toggleValue(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

export function ExplorerFilters({
  habitats,
  regions,
}: {
  habitats: { slug: string; name: string }[];
  regions: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(key: string, values: string[]) {
    const next = new URLSearchParams(params.toString());
    if (values.length === 0) {
      next.delete(key);
    } else {
      next.set(key, values.join(","));
    }
    next.delete("page");
    captureEvent(ANALYTICS_EVENTS.filterApplied, { key });
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function list(key: string): string[] {
    return params.get(key)?.split(",").filter(Boolean) ?? [];
  }

  return (
    <form className="space-y-6" aria-label="Species filters">
      <div>
        <label htmlFor="filter-q" className="mb-2 block text-sm font-medium">
          Search
        </label>
        <Input
          id="filter-q"
          defaultValue={params.get("q") ?? ""}
          name="q"
          placeholder="Common or scientific name"
          onBlur={(event) => {
            const next = new URLSearchParams(params.toString());
            if (event.target.value) {
              next.set("q", event.target.value);
            } else {
              next.delete("q");
            }
            next.delete("page");
            router.push(`${pathname}?${next.toString()}`);
          }}
        />
      </div>
      <FilterGroup title="Group">
        {ANIMAL_GROUPS.map((group) => (
          <FilterItem
            key={group}
            label={GROUP_LABELS[group]}
            checked={list("group").includes(group)}
            onChange={() => update("group", toggleValue(list("group"), group))}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Habitat">
        {habitats.map((habitat) => (
          <FilterItem
            key={habitat.slug}
            label={habitat.name}
            checked={list("habitat").includes(habitat.slug)}
            onChange={() =>
              update("habitat", toggleValue(list("habitat"), habitat.slug))
            }
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Region">
        {regions.map((region) => (
          <FilterItem
            key={region.slug}
            label={region.name}
            checked={list("region").includes(region.slug)}
            onChange={() =>
              update("region", toggleValue(list("region"), region.slug))
            }
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Diet">
        {DIET_TYPES.map((diet) => (
          <FilterItem
            key={diet}
            label={DIET_LABELS[diet]}
            checked={list("diet").includes(diet)}
            onChange={() => update("diet", toggleValue(list("diet"), diet))}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Conservation">
        {CONSERVATION_STATUSES.map((status) => (
          <FilterItem
            key={status}
            label={CONSERVATION_LABELS[status]}
            checked={list("status").includes(status)}
            onChange={() =>
              update("status", toggleValue(list("status"), status))
            }
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Size">
        {SIZE_CATEGORIES.map((size) => (
          <FilterItem
            key={size}
            label={SIZE_LABELS[size]}
            checked={list("size").includes(size)}
            onChange={() => update("size", toggleValue(list("size"), size))}
          />
        ))}
      </FilterGroup>
    </form>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function FilterItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={() => onChange()} />
      {label}
    </label>
  );
}
