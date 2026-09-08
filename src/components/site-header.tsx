import Link from "next/link";
import { AuthStatus } from "@/features/auth/ui/auth-status";
import { SiteSearch } from "@/features/search/ui/site-search";
import { UnitToggle } from "@/features/species/ui/unit-toggle";

const links = [
  { href: "/animals", label: "Explore" },
  { href: "/compare/african-elephant/peregrine-falcon", label: "Compare" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-bark/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-moss"
        >
          Fauna
        </Link>
        <nav
          aria-label="Primary"
          className="order-3 flex w-full items-center gap-4 text-sm md:order-none md:w-auto"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/80 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/surprise" className="text-ink/80 hover:text-ink">
            Surprise me
          </Link>
        </nav>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 md:max-w-md">
          <SiteSearch />
          <UnitToggle />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
