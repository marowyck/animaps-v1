"use client";

import type { ReactNode } from "react";
import { Popup } from "react-leaflet";

export function LocationPopup({
  title,
  detail,
}: {
  title: string;
  detail: ReactNode;
}) {
  return (
    <Popup>
      <div className="min-w-32">
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs font-semibold text-ink-muted">{detail}</p>
      </div>
    </Popup>
  );
}
