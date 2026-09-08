"use client";

import { type ComponentType, useEffect, useState } from "react";

export interface RangePolygon {
  type: "Polygon";
  coordinates: number[][][];
}

interface RangeMapProps {
  geojson: RangePolygon;
  regions: string[];
  notes: string;
}

export function RangeMap({ geojson, regions, notes }: RangeMapProps) {
  const [MapView, setMapView] = useState<ComponentType<RangeMapProps> | null>(
    null,
  );

  useEffect(() => {
    void import("./range-map-canvas").then((mod) =>
      setMapView(() => mod.RangeMapCanvas),
    );
  }, []);

  return (
    <div className="space-y-3">
      {MapView ? (
        <MapView geojson={geojson} regions={regions} notes={notes} />
      ) : (
        <div className="h-80 rounded-3xl bg-sand" />
      )}
      <div>
        <h3 className="font-medium">Regions</h3>
        <ul className="list-disc pl-5 text-sm text-ink/80">
          {regions.map((region) => (
            <li key={region}>{region}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink/60">{notes}</p>
      </div>
    </div>
  );
}
