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
        <p className="text-body-sm font-semibold text-text">{title}</p>
        <p className="text-caption font-semibold text-text-muted">{detail}</p>
      </div>
    </Popup>
  );
}
