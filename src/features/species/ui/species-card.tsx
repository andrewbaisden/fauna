import Image from "next/image";
import Link from "next/link";
import { ConservationBadge } from "@/components/conservation-badge";
import { Card } from "@/components/ui/card";
import { CONSERVATION_LABELS } from "@/domain/conservation";
import { DIET_LABELS, GROUP_SINGULAR } from "@/domain/labels";
import type { SpeciesCardData } from "@/server/species";

export function SpeciesCard({ species }: { species: SpeciesCardData }) {
  return (
    <Link href={`/animals/${species.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-transform group-hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] bg-sand">
          {species.image ? (
            <Image
              src={species.image.url}
              alt={species.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/50">
              No image licensed yet
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl leading-tight">
                {species.commonName}
              </h2>
              <p className="text-sm italic text-ink/60">
                {species.scientificName}
              </p>
            </div>
            {species.conservationStatus ? (
              <ConservationBadge
                status={species.conservationStatus}
                label={CONSERVATION_LABELS[species.conservationStatus]}
              />
            ) : null}
          </div>
          <p className="text-sm text-ink/70">
            {GROUP_SINGULAR[species.animalGroup]} · {DIET_LABELS[species.diet]}
            {species.habitats[0] ? ` · ${species.habitats[0]}` : ""}
          </p>
        </div>
      </Card>
    </Link>
  );
}
