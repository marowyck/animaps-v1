export type MapPointKind = "report" | "animal" | "organization";

export type MapPoint = {
  id: string;
  label: string;
  count: number;
  /** 0–1, drives marker size. */
  intensity: number;
  lat: number;
  lng: number;
  kind: MapPointKind;
};
