import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-bark/10 bg-sand/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-ink/70 md:flex-row md:items-center md:justify-between">
        <p>
          Fauna is an educational field guide. Measurements are ranges, not game
          stats.
        </p>
        <p>
          <Link href="/animals" className="underline-offset-2 hover:underline">
            Explore species
          </Link>
          {" · "}
          <a
            href="https://www.iucnredlist.org/"
            className="underline-offset-2 hover:underline"
          >
            IUCN Red List
          </a>
        </p>
      </div>
    </footer>
  );
}
