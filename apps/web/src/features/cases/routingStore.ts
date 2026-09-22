import { getRoutingCatalog } from "@/features/institution/routing/store";
import { matchInstitutions } from "@/features/institution/routing/matcher";
import { assertCitizenStatus, citizenStatusFromInternal } from "./status";
import { readCases, writeCases } from "./storage";
import { getCaseById } from "./queries";
import { nowIso, uid } from "./helpers";
import type { CaseRecord, CaseRoutingReason } from "./types";
import {
  encodeMatchVia,
  encodeRoutedEvent,
  encodeSystemMessage,
} from "./systemMessages";

/**
 * Append a routing hop. Citizen `routed`/`received` only when toInstitutionLabel is set.
 */
export function routeCase(
  caseId: string,
  input: {
    toInstitutionId: string | null;
    toInstitutionLabel: string;
    fromInstitutionId?: string | null;
    fromInstitutionLabel?: string | null;
    reason?: CaseRoutingReason;
    note?: string | null;
  },
): CaseRecord | null {
  const label = input.toInstitutionLabel.trim();
  if (!label) return null;

  const all = readCases();
  const idx = all.findIndex((c) => c.id === caseId);
  if (idx < 0) return null;
  const current = all[idx]!;
  const createdAt = nowIso();

  const routing = {
    id: uid(),
    fromInstitutionId: input.fromInstitutionId ?? null,
    fromInstitutionLabel: input.fromInstitutionLabel ?? null,
    toInstitutionId: input.toInstitutionId,
    toInstitutionLabel: label,
    reason: input.reason ?? ("initial" as CaseRoutingReason),
    note: input.note ?? null,
    createdAt,
  };

  const routings = [...current.routings, routing];
  const nextCitizen = assertCitizenStatus(
    citizenStatusFromInternal(current.status, routings),
    routings,
  );

  const updated: CaseRecord = {
    ...current,
    citizenStatus: nextCitizen,
    routings,
    participants: [
      ...current.participants.filter((p) => p.role !== "routed_institution"),
      {
        id: uid(),
        role: "routed_institution",
        userLabel: label,
        createdAt,
      },
    ],
    history: [
      ...current.history,
      {
        id: uid(),
        fromStatus: current.status,
        toStatus: current.status,
        fromCitizen: current.citizenStatus,
        toCitizen: nextCitizen,
        note: encodeRoutedEvent(label, routing.reason),
        createdAt,
      },
    ],
    comments: [
      ...current.comments,
      {
        id: uid(),
        body: encodeSystemMessage({ code: "comment_routed", label }),
        visibility: "public",
        authorLabel: "ANIMAPS",
        createdAt,
      },
    ],
    updatedAt: createdAt,
  };
  all[idx] = updated;
  writeCases(all);
  return updated;
}

/** Run jurisdiction + capability matcher; route only on a unique winner. */
export function tryAutoRoute(
  caseId: string,
  opts?: { recordMiss?: boolean },
): CaseRecord | null {
  const current = getCaseById(caseId);
  if (!current) return null;
  if (current.routings.some((r) => Boolean(r.toInstitutionLabel))) {
    return current;
  }

  const catalog = getRoutingCatalog();
  const result = matchInstitutions({
    location: current.location,
    caseTypeId: current.caseTypeId,
    anonymous: current.reporterVisibility === "anonymous",
    institutions: catalog.institutions,
  });

  if (result.status !== "matched") {
    if (!opts?.recordMiss) {
      return {
        ...current,
        citizenStatus: assertCitizenStatus("awaiting_routing", current.routings),
      };
    }
    const all = readCases();
    const idx = all.findIndex((c) => c.id === caseId);
    if (idx < 0) return current;
    const note =
      result.status === "ambiguous"
        ? encodeSystemMessage({ code: "ambiguous_match" })
        : encodeSystemMessage({ code: "no_match" });
    const updated: CaseRecord = {
      ...current,
      citizenStatus: assertCitizenStatus("awaiting_routing", current.routings),
      history: [
        ...current.history,
        {
          id: uid(),
          fromStatus: current.status,
          toStatus: current.status,
          fromCitizen: current.citizenStatus,
          toCitizen: "awaiting_routing",
          note,
          createdAt: nowIso(),
        },
      ],
      updatedAt: nowIso(),
    };
    all[idx] = updated;
    writeCases(all);
    return updated;
  }

  const { winner } = result;
  return routeCase(caseId, {
    toInstitutionId: winner.institution.id,
    toInstitutionLabel: winner.institution.label,
    reason: "initial",
    note: encodeMatchVia(
      winner.matchedJurisdiction.jurisdictionType,
      winner.matchedJurisdiction.value,
    ),
  });
}

/** Forward to another institution (append-only). Requires destination label. */
export function forwardCase(
  caseId: string,
  input: {
    toInstitutionId: string | null;
    toInstitutionLabel: string;
    fromInstitutionId?: string | null;
    fromInstitutionLabel?: string | null;
    reason: CaseRoutingReason;
    note?: string | null;
  },
): CaseRecord | null {
  if (input.reason === "initial") return null;
  return routeCase(caseId, {
    ...input,
    reason: input.reason,
  });
}
