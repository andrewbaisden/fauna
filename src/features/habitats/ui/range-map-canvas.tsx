"use client";

import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { RangePolygon } from "./range-map";

export function RangeMapCanvas({
  geojson,
}: {
  geojson: RangePolygon;
  regions: string[];
  notes: string;
}) {
  return (
    <MapContainer
      center={[10, 20]}
      zoom={2}
      scrollWheelZoom={false}
      className="h-80 w-full rounded-3xl"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={geojson}
        style={{ color: "#2f5d3a", weight: 2, fillOpacity: 0.25 }}
      />
    </MapContainer>
  );
}
