export type DiscoverEntityKind =
  | "animal"
  | "person"
  | "organization"
  | "protector";

export type DiscoverItem = {
  id: string;
  kind: DiscoverEntityKind;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  tags?: string[];
  distanceKm?: number;
};

export type DiscoverAction =
  | "like"
  | "favorite"
  | "skip"
  | "view"
  | "report"
  | "share";
