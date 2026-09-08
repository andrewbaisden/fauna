import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/features/auth/ui/sign-out-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyFaunaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in?from=/my-fauna");
  }

  const favourites = await prisma.favourite.findMany({
    where: { userId: session.user.id },
    include: { species: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">My Fauna</h1>
          <p className="mt-2 text-ink/70">
            Saved species for {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </div>
      {favourites.length === 0 ? (
        <p className="mt-8">
          Nothing saved yet.{" "}
          <Link href="/animals" className="text-moss underline">
            Explore the catalogue
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {favourites.map((item) => (
            <li key={item.id}>
              <Link
                href={`/animals/${item.species.slug}`}
                className="text-lg hover:underline"
              >
                {item.species.commonName}
              </Link>
              <span className="ml-2 italic text-ink/50">
                {item.species.scientificName}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
