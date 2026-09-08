import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RANK_LABELS } from "@/domain/labels";
import { PageEvent } from "@/features/analytics/ui/page-event";
import { SpeciesCard } from "@/features/species/ui/species-card";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getTaxonBySlug, serializeCard } from "@/server/species";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ taxonSlug: string }>;
}): Promise<Metadata> {
  const { taxonSlug } = await params;
  const taxon = await getTaxonBySlug(taxonSlug);
  return { title: taxon ? taxon.scientificName : "Taxon" };
}

export default async function TaxonomyPage({
  params,
}: {
  params: Promise<{ taxonSlug: string }>;
}) {
  const { taxonSlug } = await params;
  const taxon = await getTaxonBySlug(taxonSlug);
  if (!taxon) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageEvent
        event={ANALYTICS_EVENTS.taxonomyNavigated}
        properties={{ slug: taxon.slug }}
      />
      <p className="text-sm uppercase tracking-[0.2em] text-moss">
        {RANK_LABELS[taxon.rank]}
      </p>
      <h1 className="font-display text-5xl italic">{taxon.scientificName}</h1>
      {taxon.parent ? (
        <p className="mt-2">
          Parent:{" "}
          <Link
            href={`/taxonomy/${taxon.parent.slug}`}
            className="text-moss underline"
          >
            {taxon.parent.scientificName}
          </Link>
        </p>
      ) : null}
      {taxon.children.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl">Child taxa</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {taxon.children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/taxonomy/${child.slug}`}
                  className="rounded-full bg-sand px-3 py-1 italic"
                >
                  {child.scientificName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {taxon.species.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Species in this taxon</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {taxon.species.map((species) => (
              <SpeciesCard key={species.id} species={serializeCard(species)} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
