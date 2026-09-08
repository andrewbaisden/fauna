import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl">
        That page is not in the field guide
      </h1>
      <p className="mt-3 text-ink/70">
        The species or habitat may not be in this curated catalogue yet.
      </p>
      <Link href="/animals" className="mt-6 inline-block text-moss underline">
        Browse species
      </Link>
    </div>
  );
}
