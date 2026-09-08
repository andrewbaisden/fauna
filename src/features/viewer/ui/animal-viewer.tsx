"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { captureEvent } from "@/lib/capture-event";

const AnimalViewerCanvas = dynamic(
  () => import("./animal-viewer-canvas").then((mod) => mod.AnimalViewerCanvas),
  {
    ssr: false,
    loading: () => <div className="aspect-[16/10] rounded-3xl bg-sand" />,
  },
);

interface Asset {
  url: string;
  attribution: string;
  notes?: string | null;
  posterImageUrl?: string | null;
  fallbackImageUrl?: string | null;
}

export function AnimalViewer({
  commonName,
  asset,
  poster,
}: {
  commonName: string;
  asset: Asset | null;
  poster: { url: string; alt: string } | null;
}) {
  const [mode, setMode] = useState<"idle" | "3d" | "unavailable">("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    setWebgl(Boolean(gl));
  }, []);

  if (!asset) {
    return (
      <Fallback
        title={`No 3D model for ${commonName}`}
        body="The rest of this profile is complete without a model. Licensed 3D assets are added only when redistribution is allowed."
        poster={poster}
      />
    );
  }

  if (reducedMotion || !webgl || mode === "unavailable") {
    return (
      <Fallback
        title={
          reducedMotion
            ? "3D paused for reduced motion"
            : "3D viewer unavailable"
        }
        body="Use the photograph and the structured measurements below. They are the accessible equivalent of the model."
        poster={poster}
      />
    );
  }

  if (mode === "idle") {
    return (
      <div className="space-y-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-sand">
          {poster ? (
            <Image
              src={poster.url}
              alt={poster.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : null}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/50 to-transparent p-6">
            <Button
              type="button"
              onClick={() => {
                captureEvent(ANALYTICS_EVENTS.viewerOpened, {
                  name: commonName,
                });
                setMode("3d");
              }}
            >
              Load 3D model
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimalViewerCanvas
      url={asset.url}
      commonName={commonName}
      attribution={asset.attribution}
      notes={asset.notes}
      posterUrl={asset.posterImageUrl}
    />
  );
}

function Fallback({
  title,
  body,
  poster,
}: {
  title: string;
  body: string;
  poster: { url: string; alt: string } | null;
}) {
  return (
    <figure className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-sand">
        {poster ? (
          <Image
            src={poster.url}
            alt={poster.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : null}
      </div>
      <figcaption>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-ink/70">{body}</p>
      </figcaption>
    </figure>
  );
}
