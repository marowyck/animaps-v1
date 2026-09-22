import type {
  CaseCitizenStatus,
  CaseRecord,
  CaseRoutingDraft,
  CaseStatus,
} from "./types";

/**
 * Map internal status → coarse citizen status when no routing overrides apply.
 * Never returns `routed` without a routing row (caller must pass routings).
 */
export function citizenStatusFromInternal(
  status: CaseStatus,
  routings: CaseRoutingDraft[],
): CaseCitizenStatus {
  const hasRoute = routings.some((r) => Boolean(r.toInstitutionLabel));

  if (status === "resolved" || status === "closed") return "resolved";
  if (status === "assigned" || status === "in_progress" || status === "waiting_information") {
    return "in_progress";
  }
  if (status === "triage" || status === "under_review") return "under_analysis";
  if (hasRoute) {
    if (status === "new") return "routed";
    return "received";
  }
  if (status === "new") return "awaiting_routing";
  return "registered_on_platform";
}

/** Guard: citizen `routed` only when a routing destination exists. */
export function assertCitizenStatus(
  status: CaseCitizenStatus,
  routings: CaseRoutingDraft[],
): CaseCitizenStatus {
  if (
    (status === "routed" || status === "received") &&
    !routings.some((r) => Boolean(r.toInstitutionLabel))
  ) {
    return "awaiting_routing";
  }
  return status;
}

export function publicComments(record: CaseRecord) {
  return record.comments
    .filter((c) => c.visibility === "public")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function internalComments(record: CaseRecord) {
  return record.comments
    .filter((c) => c.visibility === "internal")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
