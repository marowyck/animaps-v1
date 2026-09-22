"use client";

import type { ReactNode } from "react";
import { CircleMarker } from "react-leaflet";
import type { MapPointKind } from "./types";

const FILL: Record<MapPointKind, string> = {
  report: "var(--secondary)",
  animal: "var(--primary)",
  organization: "var(--info)",
};

type MarkerProps = {
  position: [number, number];
  intensity: number;
  children?: ReactNode;
};

function markerRadius(intensity: number): number {
  const clamped = Math.min(Math.max(intensity, 0), 1);
  return 10 + clamped * 18;
}

export function MapMarker({
  position,
  intensity,
  kind,
  children,
}: MarkerProps & { kind: MapPointKind }) {
  const color = FILL[kind];
  return (
    <CircleMarker
      center={position}
      radius={markerRadius(intensity)}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.45,
        weight: 2,
      }}
    >
      {children}
    </CircleMarker>
  );
}

export function ReportMarker(props: MarkerProps) {
  return <MapMarker kind="report" {...props} />;
}

export function AnimalMarker(props: MarkerProps) {
  return <MapMarker kind="animal" {...props} />;
}

export function OrganizationMarker(props: MarkerProps) {
  return <MapMarker kind="organization" {...props} />;
}
