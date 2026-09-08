import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageEvent } from "@/features/analytics/ui/page-event";
import { SpeciesCard } from "@/features/species/ui/species-card";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getHabitatBySlug, serializeCard } from "@/server/species";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const habitat = await getHabitatBySlug(slug);
  return { title: habitat ? habitat.name : "Habitat" };
}

export default async function HabitatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const habitat = await getHabitatBySlug(slug);
  if (!habitat) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageEvent
        event={ANALYTICS_EVENTS.habitatViewed}
        properties={{ slug: habitat.slug }}
      />
      <p className="text-sm uppercase tracking-[0.2em] text-moss">Habitat</p>
      <h1 className="font-display text-5xl">{habitat.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/75">
        {habitat.description}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habitat.species.map((item) => (
          <SpeciesCard
            key={item.species.id}
            species={serializeCard(item.species)}
          />
        ))}
      </div>
    </div>
  );
}
