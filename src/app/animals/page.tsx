import type { Metadata } from "next";
import Link from "next/link";
import {
  explorerQueryString,
  PAGE_SIZE,
  parseExplorerSearchParams,
} from "@/domain/search";
import { ExplorerFilters } from "@/features/search/ui/explorer-filters";
import { SpeciesCard } from "@/features/species/ui/species-card";
import { getFilterFacets, listSpecies } from "@/server/species";

export const metadata: Metadata = {
  title: "Explore species",
  description: "Browse and filter a curated wildlife catalogue.",
};

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseExplorerSearchParams(await searchParams);
  const [{ habitats, regions }, result] = await Promise.all([
    getFilterFacets(),
    listSpecies(filters),
  ]);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[16rem_1fr]">
      <aside>
        <h1 className="font-display text-4xl">Explore species</h1>
        <p className="mt-2 mb-6 text-sm text-ink/70">
          {result.total} species in this view.
        </p>
        <ExplorerFilters habitats={habitats} regions={regions} />
      </aside>
      <div>
        {result.species.length === 0 ? (
          <div className="rounded-3xl bg-sand p-10">
            <h2 className="font-display text-2xl">
              No species match those filters
            </h2>
            <p className="mt-2 text-ink/70">
              Clear a filter or try a broader search term.
            </p>
            <Link
              href="/animals"
              className="mt-4 inline-block text-moss underline"
            >
              Reset filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {result.species.map((species) => (
              <SpeciesCard key={species.slug} species={species} />
            ))}
          </div>
        )}
        {result.pageCount > 1 ? (
          <nav className="mt-8 flex gap-3" aria-label="Pagination">
            {result.page > 1 ? (
              <Link
                href={`/animals${explorerQueryString({ ...filters, page: result.page - 1 })}`}
              >
                Previous
              </Link>
            ) : null}
            <span className="text-sm text-ink/60">
              Page {result.page} of {result.pageCount} ({PAGE_SIZE} per page)
            </span>
            {result.page < result.pageCount ? (
              <Link
                href={`/animals${explorerQueryString({ ...filters, page: result.page + 1 })}`}
              >
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
