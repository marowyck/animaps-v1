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
  /** Preview catalog: liking this card also creates a match. */
  reciprocates?: boolean;
};

export type DiscoverAction =
  | "like"
  | "favorite"
  | "skip"
  | "view"
  | "report"
  | "share";
