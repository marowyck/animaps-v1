"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocationPopup } from "./LocationPopup";
import { AnimalMarker, OrganizationMarker, ReportMarker } from "./MapMarker";
import type { MapPoint } from "./types";

const BRAZIL: [number, number] = [-14.235, -51.9253];

function FitPoints({ points }: { points: [number, number][] }) {
  const map = useMap();
  const key = points.map((point) => point.join(",")).join("|");

  useEffect(() => {
    const parsed: [number, number][] = key
      ? key.split("|").map((pair) => {
          const [lat, lng] = pair.split(",").map(Number);
          return [lat!, lng!];
        })
      : [];

    if (parsed.length === 0) {
      map.setView(BRAZIL, 4);
      return;
    }
    if (parsed.length === 1) {
      map.setView(parsed[0]!, 8);
      return;
    }
    map.fitBounds(parsed, { padding: [36, 36], maxZoom: 8 });
  }, [map, key]);

  return null;
}

export function CityMap({
  points,
  detailFor,
}: {
  points: MapPoint[];
  detailFor: (point: MapPoint) => string;
}) {
  const positions = points.map(
    (point) => [point.lat, point.lng] as [number, number],
  );

  return (
    <div className="animaps-map h-[28rem] overflow-hidden rounded-3xl border border-border-soft">
      <MapContainer
        center={BRAZIL}
        zoom={4}
        scrollWheelZoom={false}
        className="h-full w-full"
        aria-label="OpenStreetMap"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitPoints points={positions} />
        {points.map((point) => {
          const Marker =
            point.kind === "animal"
              ? AnimalMarker
              : point.kind === "organization"
                ? OrganizationMarker
                : ReportMarker;
          return (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              intensity={point.intensity}
            >
              <LocationPopup title={point.label} detail={detailFor(point)} />
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
