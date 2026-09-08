import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConservationBadge } from "@/components/conservation-badge";
import { CONSERVATION_LABELS, TREND_LABELS } from "@/domain/conservation";
import {
  ACTIVITY_LABELS,
  DIET_LABELS,
  GROUP_SINGULAR,
  RANK_LABELS,
} from "@/domain/labels";
import { lineageFrom, type TaxonNode } from "@/domain/taxonomy";
import { PageEvent } from "@/features/analytics/ui/page-event";
import { ComparePicker } from "@/features/comparison/ui/compare-picker";
import { FavouriteButton } from "@/features/favourites/ui/favourite-button";
import { RangeMap } from "@/features/habitats/ui/range-map";
import { MeasurementGrid } from "@/features/species/ui/measurement-grid";
import { RecentlyViewedTracker } from "@/features/species/ui/recently-viewed-tracker";
import { ScaleComparison } from "@/features/species/ui/scale-comparison";
import { SpeciesCard } from "@/features/species/ui/species-card";
import { AnimalViewer } from "@/features/viewer/ui/animal-viewer";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { primaryImage, toMeasurementRecord } from "@/server/mappers";
import {
  getAllSlugs,
  getRelatedSpecies,
  getSpeciesBySlug,
  searchSpeciesOptions,
} from "@/server/species";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((item) => ({ slug: item.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) {
    return { title: "Species not found" };
  }
  const image = primaryImage(species.media);
  return {
    title: species.commonName,
    description: species.summary,
    alternates: { canonical: `/animals/${species.slug}` },
    openGraph: {
      title: `${species.commonName} · Fauna`,
      description: species.summary,
      images: image ? [{ url: image.url, alt: image.alt }] : undefined,
    },
  };
}

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) {
    notFound();
  }

  const taxa = await prisma.taxon.findMany();
  const byId = new Map<string, TaxonNode>(
    taxa.map((taxon) => [
      taxon.id,
      {
        id: taxon.id,
        slug: taxon.slug,
        rank: taxon.rank,
        scientificName: taxon.scientificName,
        commonName: taxon.commonName,
        parentId: taxon.parentId,
      },
    ]),
  );
  const currentTaxon = byId.get(species.taxonId);
  const lineage = currentTaxon ? lineageFrom(currentTaxon, byId) : [];
  const measurements = species.measurements.map(toMeasurementRecord);
  const image = primaryImage(species.media);
  const poster = species.media.find((item) => item.kind === "POSTER") ?? image;
  const model = species.threeDAssets[0] ?? null;
  const related = await getRelatedSpecies(species.taxonId, species.id);
  const options = await searchSpeciesOptions("");
  const geometry = species.rangeGeometries[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Taxon",
    name: species.scientificName,
    alternateName: species.commonName,
    description: species.summary,
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecentlyViewedTracker slug={species.slug} />
      <PageEvent
        event={ANALYTICS_EVENTS.speciesViewed}
        properties={{ slug: species.slug }}
      />
      <p className="text-sm uppercase tracking-[0.2em] text-moss">
        {GROUP_SINGULAR[species.animalGroup]} · {DIET_LABELS[species.diet]}
        {species.habitats[0] ? ` · ${species.habitats[0].habitat.name}` : ""}
      </p>
      <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-5xl md:text-6xl">
            {species.commonName}
          </h1>
          <p className="mt-2 text-xl italic text-ink/60">
            {species.scientificName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {species.conservation ? (
            <ConservationBadge
              status={species.conservation.status}
              label={CONSERVATION_LABELS[species.conservation.status]}
            />
          ) : null}
          <FavouriteButton slug={species.slug} />
        </div>
      </div>

      <p className="mt-8 max-w-3xl text-lg leading-8 text-ink/80">
        {species.summary}
      </p>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-3xl">Interactive model</h2>
        <AnimalViewer
          commonName={species.commonName}
          asset={model}
          poster={poster ? { url: poster.url, alt: poster.alt } : null}
        />
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="font-display text-3xl">Characteristics</h2>
        <MeasurementGrid measurements={measurements} />
        <ScaleComparison
          sizeCategory={species.sizeCategory}
          measurements={measurements}
          commonName={species.commonName}
        />
        {species.activityPattern ? (
          <p className="text-sm text-ink/70">
            Activity: {ACTIVITY_LABELS[species.activityPattern]}
          </p>
        ) : null}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Taxonomy</h2>
        <ol className="mt-4 space-y-2">
          {lineage.map((taxon, index) => (
            <li key={taxon.id} className="flex items-baseline gap-3">
              <span className="w-28 text-xs uppercase tracking-wide text-bark">
                {RANK_LABELS[taxon.rank]}
              </span>
              <Link
                href={`/taxonomy/${taxon.slug}`}
                className="italic hover:underline"
              >
                {taxon.scientificName}
              </Link>
              {index < lineage.length - 1 ? (
                <span className="text-ink/30">↓</span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Life stages</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {species.lifeStages.map((stage) => (
            <li key={stage.id} className="rounded-2xl bg-sand/60 p-5">
              <p className="text-xs uppercase tracking-wide text-bark">
                Stage {stage.sortOrder + 1}
              </p>
              <h3 className="font-display text-2xl">{stage.name}</h3>
              {stage.ageUnit ? (
                <p className="text-sm text-ink/60">
                  {stage.ageMin == null ? 0 : Number(stage.ageMin)}–
                  {stage.ageMax == null ? "∞" : Number(stage.ageMax)}{" "}
                  {stage.ageUnit.toLowerCase()}
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-6">{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Adaptations</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {species.adaptations.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-bark/10 p-5"
            >
              <h3 className="font-display text-2xl">{item.title}</h3>
              {item.bodySystem ? (
                <p className="text-xs uppercase tracking-wide text-bark">
                  {item.bodySystem}
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-6">{item.explanation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Behaviour</h2>
        <ul className="mt-4 space-y-3">
          {species.behaviours.map((item) => (
            <li key={item.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-bark">
                {item.category}
              </p>
              <p>{item.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Habitat and range</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {species.habitats.map((item) => (
            <li key={item.id}>
              <Link
                href={`/habitats/${item.habitat.slug}`}
                className="rounded-full bg-sand px-3 py-1 text-sm"
              >
                {item.habitat.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-4 list-disc pl-5 text-sm">
          {species.regions.map((item) => (
            <li key={item.id}>
              {item.region.name} ({item.rangeType.toLowerCase()})
            </li>
          ))}
        </ul>
        {geometry?.geojson &&
        typeof geometry.geojson === "object" &&
        "type" in geometry.geojson ? (
          <div className="mt-6">
            <RangeMap
              geojson={
                geometry.geojson as unknown as import("@/features/habitats/ui/range-map").RangePolygon
              }
              regions={species.regions.map((item) => item.region.name)}
              notes={geometry.notes ?? "Illustrative range only."}
            />
          </div>
        ) : null}
      </section>

      {species.conservation ? (
        <section className="mt-12 rounded-3xl bg-ink p-6 text-paper">
          <h2 className="font-display text-3xl">Conservation</h2>
          <p className="mt-2 text-lg">
            {CONSERVATION_LABELS[species.conservation.status]}
          </p>
          <p className="text-paper/70">
            Population trend:{" "}
            {TREND_LABELS[species.conservation.populationTrend]}
          </p>
          {species.conservation.yearAssessed ? (
            <p className="text-sm text-paper/60">
              Assessment year {species.conservation.yearAssessed} (curated, not
              live).
            </p>
          ) : null}
          <ul className="mt-4 list-disc pl-5">
            {species.conservation.threats.map((threat) => (
              <li key={threat.id}>{threat.label}</li>
            ))}
          </ul>
          {species.conservation.efforts ? (
            <p className="mt-4 text-sm text-paper/80">
              {species.conservation.efforts}
            </p>
          ) : null}
          <p className="mt-4 text-xs text-paper/50">
            Source: {species.conservation.source.title}
          </p>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl">Compare</h2>
        <div className="mt-4">
          <ComparePicker currentSlug={species.slug} options={options} />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl">Related species</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <SpeciesCard key={item.slug} species={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl">Sources</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {species.sources.map((item) => (
            <li key={item.id}>
              {item.source.url ? (
                <a
                  href={item.source.url}
                  className="text-moss underline-offset-2 hover:underline"
                >
                  {item.source.title}
                </a>
              ) : (
                item.source.title
              )}
              <span className="text-ink/50"> — {item.role.toLowerCase()}</span>
            </li>
          ))}
        </ul>
        {image ? (
          <p className="mt-4 text-xs text-ink/50">
            Photograph: {image.attribution}
          </p>
        ) : null}
      </section>
    </article>
  );
}
