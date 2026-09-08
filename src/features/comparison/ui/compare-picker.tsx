"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { canonicalCompareSlugs } from "@/domain/slugs";

export function ComparePicker({
  currentSlug,
  options,
}: {
  currentSlug: string;
  options: { slug: string; commonName: string }[];
}) {
  const router = useRouter();
  const [other, setOther] = useState(
    options.find((item) => item.slug !== currentSlug)?.slug ?? "",
  );

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        if (!other || other === currentSlug) {
          return;
        }
        const [a, b] = canonicalCompareSlugs(currentSlug, other);
        router.push(`/compare/${a}/${b}`);
      }}
    >
      <label htmlFor="compare-with" className="text-sm font-medium">
        Compare with
      </label>
      <select
        id="compare-with"
        className="h-10 rounded-full border border-bark/20 bg-paper px-3 text-sm"
        value={other}
        onChange={(event) => setOther(event.target.value)}
      >
        {options
          .filter((item) => item.slug !== currentSlug)
          .map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.commonName}
            </option>
          ))}
      </select>
      <Button type="submit">Open comparison</Button>
    </form>
  );
}
