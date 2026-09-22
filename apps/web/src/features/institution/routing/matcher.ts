import type { CaseLocationDraft, CaseTypeId } from "@/features/cases/types";
import {
  JURISDICTION_SPECIFICITY,
  INSTITUTION_TYPE_PRIORITY,
  type JurisdictionRecord,
  type MockRoutableInstitution,
  type RoutingMatchCandidate,
  type RoutingMatchResult,
} from "./types";

function norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function jurisdictionCovers(
  jur: JurisdictionRecord,
  location: Pick<CaseLocationDraft, "city" | "state">,
): boolean {
  const city = norm(location.city);
  const state = norm(location.state);
  const value = norm(jur.value);

  switch (jur.jurisdictionType) {
    case "national":
      return true;
    case "state":
      return Boolean(state) && (value === state || value.includes(state) || state.includes(value));
    case "regional":
      if (!city && !state) return false;
      return Boolean(
        (city && (value.includes(city) || city.includes(value))) ||
          (state && (value.includes(state) || state.includes(value))),
      );
    case "municipal":
    case "local":
      if (!city) return false;
      return value === city || value.includes(city) || city.includes(value);
    default:
      return false;
  }
}

function bestJurisdiction(
  institution: MockRoutableInstitution,
  location: Pick<CaseLocationDraft, "city" | "state">,
): JurisdictionRecord | null {
  let best: JurisdictionRecord | null = null;
  let bestScore = -1;
  for (const jur of institution.jurisdictions) {
    if (!jurisdictionCovers(jur, location)) continue;
    const score = JURISDICTION_SPECIFICITY[jur.jurisdictionType] ?? 0;
    if (score > bestScore) {
      best = jur;
      bestScore = score;
    }
  }
  return best;
}

function acceptsType(
  institution: MockRoutableInstitution,
  caseTypeId: CaseTypeId,
): boolean {
  const row = institution.capabilities.find((c) => c.caseTypeId === caseTypeId);
  if (!row) return false;
  return row.accepts;
}

/**
 * Platform default matcher (docs/case-routing.md).
 * Never invents a destination when ambiguous or empty.
 */
export function matchInstitutions(input: {
  location: Pick<CaseLocationDraft, "city" | "state">;
  caseTypeId: CaseTypeId;
  anonymous: boolean;
  institutions: MockRoutableInstitution[];
}): RoutingMatchResult {
  const candidates: RoutingMatchCandidate[] = [];

  for (const institution of input.institutions) {
    if (institution.verificationStatus !== "approved") continue;
    if (input.anonymous && !institution.anonymousReports) continue;
    if (!acceptsType(institution, input.caseTypeId)) continue;
    const matchedJurisdiction = bestJurisdiction(institution, input.location);
    if (!matchedJurisdiction) continue;

    candidates.push({
      institution,
      matchedJurisdiction,
      specificity:
        JURISDICTION_SPECIFICITY[matchedJurisdiction.jurisdictionType] ?? 0,
      typePriority:
        INSTITUTION_TYPE_PRIORITY[institution.institutionTypeKey] ?? 0,
    });
  }

  if (candidates.length === 0) {
    return { status: "no_match", candidates };
  }

  candidates.sort((a, b) => {
    if (b.specificity !== a.specificity) return b.specificity - a.specificity;
    return b.typePriority - a.typePriority;
  });

  const top = candidates[0]!;
  const tied = candidates.filter(
    (c) =>
      c.specificity === top.specificity && c.typePriority === top.typePriority,
  );

  if (tied.length > 1) {
    return { status: "ambiguous", candidates };
  }

  return { status: "matched", winner: top, candidates };
}
