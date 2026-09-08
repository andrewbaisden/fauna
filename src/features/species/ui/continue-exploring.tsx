"use client";

import Link from "next/link";
import { useRecentsStore } from "@/features/species/state";

export function ContinueExploring() {
  const slugs = useRecentsStore((state) => state.slugs);

  if (slugs.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="font-display text-2xl">Continue exploring</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {slugs.slice(0, 8).map((slug) => (
          <li key={slug}>
            <Link
              href={`/animals/${slug}`}
              className="rounded-full bg-sand px-3 py-1 text-sm capitalize"
            >
              {slug.replaceAll("-", " ")}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
