import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GROUP_LABELS } from "@/domain/labels";
import { ANIMAL_GROUPS } from "@/domain/search";
import { ContinueExploring } from "@/features/species/ui/continue-exploring";
import { SpeciesCard } from "@/features/species/ui/species-card";
import { getFeaturedSpecies } from "@/server/species";

export default async function HomePage() {
  const featured = await getFeaturedSpecies();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-bark/10 bg-[radial-gradient(circle_at_top_left,_#e4d6c1,_#f4efe4_55%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              Field guide
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-7xl">
              Explore life on Earth.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/75">
              Fauna is a structured wildlife encyclopedia: size, diet, habitat,
              conservation, life stages and — where a licensed model exists — an
              interactive 3D specimen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/animals">Browse species</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/surprise">Discover a random animal</Link>
              </Button>
            </div>
          </div>
          <aside className="self-end rounded-3xl bg-ink p-6 text-paper">
            <p className="text-sm uppercase tracking-wide text-sand">
              Not a Pokédex
            </p>
            <p className="mt-3 text-paper/85">
              No hit points, no capture. Just measurable biology, original
              explanations, and sources you can check.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl">Explore by group</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {ANIMAL_GROUPS.map((group) => (
            <li key={group}>
              <Link
                href={`/animals?group=${group}`}
                className="block rounded-2xl bg-sand px-4 py-6 text-lg font-medium hover:bg-moss hover:text-paper"
              >
                {GROUP_LABELS[group]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-3xl">Featured species</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((species) => (
            <SpeciesCard key={species.slug} species={species} />
          ))}
        </div>
      </section>
      <ContinueExploring />
    </div>
  );
}
