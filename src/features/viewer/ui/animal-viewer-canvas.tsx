"use client";

import {
  Bounds,
  Center,
  Html,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, type ReactNode, Suspense, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useViewerStore } from "@/features/species/state";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { captureEvent } from "@/lib/capture-event";
import { reportError } from "@/lib/report-error";

interface ViewerProps {
  url: string;
  commonName: string;
  posterUrl?: string | null;
  attribution: string;
  notes?: string | null;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} />;
}

class ViewerErrorBoundary extends Component<
  { children: ReactNode; commonName: string },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: Error) {
    captureEvent(ANALYTICS_EVENTS.modelFailed, {
      name: this.props.commonName,
    });
    reportError("model_load_failed", error);
  }

  override render() {
    if (this.state.failed) {
      return (
        <Html center>
          <p className="rounded-full bg-paper px-4 py-2 text-sm">
            The 3D model could not be loaded. Use the photograph and
            measurements instead.
          </p>
        </Html>
      );
    }
    return this.props.children;
  }
}

function Loader({ commonName }: { commonName: string }) {
  const { progress, active } = useProgress();
  return (
    <Html center>
      <p className="rounded-full bg-paper px-4 py-2 text-sm">
        {active
          ? `Loading ${commonName}… ${Math.round(progress)}%`
          : `Loading ${commonName}…`}
      </p>
    </Html>
  );
}

function Scene({
  url,
  preset,
  showScale,
}: {
  url: string;
  preset: "front" | "side" | "rear";
  showScale: boolean;
}) {
  const target: [number, number, number] =
    preset === "side"
      ? [4, 1.2, 0]
      : preset === "rear"
        ? [0, 1.2, -4]
        : [0, 1.2, 4];

  return (
    <>
      <color attach="background" args={["#d5e6e3"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 8, 6]} intensity={1.4} />
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <Model url={url} />
        </Center>
      </Bounds>
      {showScale ? (
        <mesh position={[1.4, 0.85, 0]}>
          <boxGeometry args={[0.4, 1.7, 0.3]} />
          <meshStandardMaterial color="#6b5744" transparent opacity={0.45} />
        </mesh>
      ) : null}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1.5}
        maxDistance={12}
      />
      <PerspectiveHint target={target} />
    </>
  );
}

function PerspectiveHint({ target }: { target: [number, number, number] }) {
  // Camera is owned by Bounds; viewpoint buttons reset OrbitControls via store + key.
  return <group position={target} />;
}

export function AnimalViewerCanvas({
  url,
  commonName,
  attribution,
  notes,
}: ViewerProps) {
  const preset = useViewerStore((state) => state.preset);
  const showScale = useViewerStore((state) => state.showScale);
  const setPreset = useViewerStore((state) => state.setPreset);
  const toggleScale = useViewerStore((state) => state.toggleScale);

  useEffect(() => {
    captureEvent(ANALYTICS_EVENTS.modelLoaded, { name: commonName });
  }, [commonName]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-bark/10 bg-sand">
        <Canvas
          camera={{ position: [0, 1.4, 4], fov: 45 }}
          aria-label={`Interactive 3D model of ${commonName}`}
          onCreated={() => undefined}
        >
          <Suspense fallback={<Loader commonName={commonName} />}>
            <ViewerErrorBoundary commonName={commonName}>
              <Scene url={url} preset={preset} showScale={showScale} />
            </ViewerErrorBoundary>
          </Suspense>
        </Canvas>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["front", "side", "rear"] as const).map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={preset === item ? "default" : "outline"}
            onClick={() => setPreset(item)}
          >
            {item[0]?.toUpperCase()}
            {item.slice(1)}
          </Button>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={toggleScale}>
          {showScale ? "Hide human scale" : "Show human scale"}
        </Button>
      </div>
      <p className="text-xs text-ink/60">
        {attribution}
        {notes ? ` ${notes}` : ""}
      </p>
    </div>
  );
}
