/**
 * Institution routing mock (Fase 7) — jurisdictions, capabilities, report policy.
 * Aligned to institution_jurisdictions / institution_capabilities / case_routing.
 */

export const JURISDICTION_TYPES = [
  "national",
  "state",
  "municipal",
  "regional",
  "local",
] as const;

export type JurisdictionType = (typeof JURISDICTION_TYPES)[number];

/** Specificity for tie-break: LOCAL > MUNICIPAL > REGIONAL > STATE > NATIONAL */
export const JURISDICTION_SPECIFICITY: Record<JurisdictionType, number> = {
  local: 5,
  municipal: 4,
  regional: 3,
  state: 2,
  national: 1,
};

export type JurisdictionRecord = {
  id: string;
  jurisdictionType: JurisdictionType;
  /** City, UF, region label, or country code depending on type. */
  value: string;
  country: string;
  createdAt: string;
};

export type CapabilityRecord = {
  id: string;
  caseTypeId: string;
  accepts: boolean;
  createdAt: string;
};

/** Prefer specialized bodies over generic city hall on ties. */
export const INSTITUTION_TYPE_PRIORITY: Record<string, number> = {
  animal_welfare_department: 10,
  zoonoses_center: 9,
  environmental_department: 7,
  environmental_agency: 6,
  health_department: 5,
  public_inspection: 4,
  municipal_department: 3,
  city_hall: 2,
  public_partner: 1,
  other: 0,
};

export type MockRoutableInstitution = {
  id: string;
  label: string;
  /** Sync with soft-gate: only approved institutions are matchable. */
  verificationStatus: "approved" | "pending" | "suspended" | "rejected";
  institutionTypeKey: string;
  jurisdictions: JurisdictionRecord[];
  capabilities: CapabilityRecord[];
  anonymousReports: boolean;
};

export type RoutingCatalogState = {
  institutions: MockRoutableInstitution[];
};

export function createEmptyRoutingCatalog(): RoutingCatalogState {
  return { institutions: [] };
}

export type RoutingMatchCandidate = {
  institution: MockRoutableInstitution;
  matchedJurisdiction: JurisdictionRecord;
  specificity: number;
  typePriority: number;
};

export type RoutingMatchResult =
  | { status: "matched"; winner: RoutingMatchCandidate; candidates: RoutingMatchCandidate[] }
  | { status: "no_match"; candidates: RoutingMatchCandidate[] }
  | { status: "ambiguous"; candidates: RoutingMatchCandidate[] };
