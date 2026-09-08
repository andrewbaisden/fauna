import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CONSERVATION_LABELS } from "@/domain/conservation";
import { DIET_LABELS, GROUP_SINGULAR } from "@/domain/labels";
import { canonicalCompareSlugs } from "@/domain/slugs";
import { PageEvent } from "@/features/analytics/ui/page-event";
import { ComparisonTable } from "@/features/comparison/ui/comparison-table";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { toMeasurementRecord } from "@/server/mappers";
import { getSpeciesBySlug } from "@/server/species";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugA: string; slugB: string }>;
}): Promise<Metadata> {
  const { slugA, slugB } = await params;
  return {
    title: `Compare ${slugA.replaceAll("-", " ")} and ${slugB.replaceAll("-", " ")}`,
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slugA: string; slugB: string }>;
}) {
  const { slugA, slugB } = await params;
  if (slugA === slugB) {
    notFound();
  }
  const [canonicalA, canonicalB] = canonicalCompareSlugs(slugA, slugB);
  if (slugA !== canonicalA || slugB !== canonicalB) {
    redirect(`/compare/${canonicalA}/${canonicalB}`);
  }

  const [left, right] = await Promise.all([
    getSpeciesBySlug(canonicalA),
    getSpeciesBySlug(canonicalB),
  ]);
  if (!left || !right) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageEvent
        event={ANALYTICS_EVENTS.speciesCompared}
        properties={{ a: left.slug, b: right.slug }}
      />
      <p className="text-sm uppercase tracking-[0.2em] text-moss">Comparison</p>
      <h1 className="font-display text-4xl md:text-5xl">
        {left.commonName} vs {right.commonName}
      </h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {[left, right].map((species) => (
          <section key={species.id} className="rounded-3xl bg-sand/50 p-5">
            <h2 className="font-display text-3xl">
              <Link
                href={`/animals/${species.slug}`}
                className="hover:underline"
              >
                {species.commonName}
              </Link>
            </h2>
            <p className="italic text-ink/60">{species.scientificName}</p>
            <p className="mt-2 text-sm">
              {GROUP_SINGULAR[species.animalGroup]} ·{" "}
              {DIET_LABELS[species.diet]}
            </p>
            {species.conservation ? (
              <p className="text-sm">
                {CONSERVATION_LABELS[species.conservation.status]}
              </p>
            ) : null}
          </section>
        ))}
      </div>
      <div className="mt-10">
        <ComparisonTable
          leftName={left.commonName}
          rightName={right.commonName}
          left={left.measurements.map(toMeasurementRecord)}
          right={right.measurements.map(toMeasurementRecord)}
        />
      </div>
    </div>
  );
}
