import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-teal/15 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-paper/75 md:flex-row md:items-center md:justify-between">
        <p>
          Fauna is an educational field guide. Measurements are ranges, not game
          stats.
        </p>
        <p>
          <Link
            href="/animals"
            className="text-teal underline-offset-2 hover:underline"
          >
            Explore species
          </Link>
          {" · "}
          <a
            href="https://www.iucnredlist.org/"
            className="text-teal underline-offset-2 hover:underline"
          >
            IUCN Red List
          </a>
        </p>
      </div>
    </footer>
  );
}
