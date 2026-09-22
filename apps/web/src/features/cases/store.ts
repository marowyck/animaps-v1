import { metaForCaseType } from "./catalog";
import { assertCitizenStatus } from "./status";
import { readCases, writeCases } from "./storage";
import { tryAutoRoute } from "./routingStore";
import {
  createClaimToken,
  emptyLocation,
  hashClaimToken,
  nextReferenceNumber,
  nowIso,
  uid,
} from "./helpers";
import type {
  AttachmentKind,
  CaseCommentDraft,
  CaseCommentVisibility,
  CaseRecord,
  CreateCaseInput,
  ReporterVisibility,
} from "./types";
import { encodeSystemMessage } from "./systemMessages";

export {
  createClaimToken,
  hashClaimToken,
} from "./helpers";
export {
  getCaseById,
  getCaseByReference,
  listCases,
  listCasesForReporter,
} from "./queries";
export { assignCase, unassignCase } from "./assignmentStore";
export { forwardCase, routeCase, tryAutoRoute } from "./routingStore";

/**
 * Create a case. Auto-runs the jurisdiction+capability matcher (Fase 7).
 * Citizen `routed` only when a routing row is appended.
 */
export function createCase(input: CreateCaseInput): {
  record: CaseRecord;
  claimToken: string | null;
} {
  const existing = readCases();
  const createdAt = nowIso();
  const meta = metaForCaseType(input.caseTypeId);
  const anonymous =
    Boolean(input.anonymous) || input.reporterVisibility === "anonymous";
  const claimToken = anonymous ? createClaimToken() : null;
  const claimTokenHash = claimToken ? hashClaimToken(claimToken) : null;

  const attachments = (input.attachmentNames ?? []).map((name) => {
    const lower = name.toLowerCase();
    let kind: AttachmentKind = "document";
    if (/\.(png|jpe?g|gif|webp)$/.test(lower)) kind = "photo";
    else if (/\.(mp4|mov|webm)$/.test(lower)) kind = "video";
    return {
      id: uid(),
      name,
      kind,
      mimeType: null,
      url: `mock://${encodeURIComponent(name)}`,
      createdAt,
    };
  });

  const record: CaseRecord = {
    id: uid(),
    referenceNumber: nextReferenceNumber(existing),
    caseTypeId: input.caseTypeId,
    status: "new",
    citizenStatus: "awaiting_routing",
    priority: input.priority ?? meta.defaultPriority,
    source: input.source,
    title: input.title.trim(),
    description: input.description.trim(),
    location: emptyLocation(input.location),
    reporterId: anonymous
      ? null
      : (input.reporterId ?? input.reporterEmail ?? null),
    reporterEmail: anonymous ? null : (input.reporterEmail ?? null),
    reporterVisibility: anonymous
      ? "anonymous"
      : (input.reporterVisibility as ReporterVisibility),
    occurrenceId: null,
    claimToken: null,
    claimTokenHash,
    claimedAt: null,
    assignedMemberId: null,
    assignedMemberLabel: null,
    assignedTeamId: null,
    assignedTeamLabel: null,
    history: [
      {
        id: uid(),
        fromStatus: null,
        toStatus: "new",
        fromCitizen: null,
        toCitizen: "registered_on_platform",
        note: encodeSystemMessage({ code: "registered" }),
        createdAt,
      },
      {
        id: uid(),
        fromStatus: "new",
        toStatus: "new",
        fromCitizen: "registered_on_platform",
        toCitizen: "awaiting_routing",
        note: encodeSystemMessage({ code: "evaluating_match" }),
        createdAt,
      },
    ],
    comments: [
      {
        id: uid(),
        body: encodeSystemMessage({ code: "comment_registered" }),
        visibility: "public",
        authorLabel: "ANIMAPS",
        createdAt,
      },
    ],
    attachments,
    participants: anonymous
      ? []
      : [
          {
            id: uid(),
            role: "reporter",
            userLabel: input.reporterEmail ?? input.reporterId ?? "reporter",
            createdAt,
          },
        ],
    routings: [],
    assignments: [],
    createdAt,
    updatedAt: createdAt,
    closedAt: null,
  };

  record.citizenStatus = assertCitizenStatus(record.citizenStatus, record.routings);
  writeCases([record, ...existing]);

  const routed = tryAutoRoute(record.id, { recordMiss: false });
  return { record: routed ?? record, claimToken };
}

export function claimCase(token: string, email: string): CaseRecord | null {
  const hash = hashClaimToken(token.trim().toUpperCase());
  const all = readCases();
  const idx = all.findIndex((c) => c.claimTokenHash === hash);
  if (idx < 0) return null;
  const current = all[idx]!;
  if (current.claimedAt) return current;

  const updated: CaseRecord = {
    ...current,
    reporterEmail: email.trim().toLowerCase(),
    reporterId: email.trim().toLowerCase(),
    claimedAt: nowIso(),
    updatedAt: nowIso(),
    participants: [
      ...current.participants,
      {
        id: uid(),
        role: "reporter",
        userLabel: email.trim().toLowerCase(),
        createdAt: nowIso(),
      },
    ],
    history: [
      ...current.history,
      {
        id: uid(),
        fromStatus: current.status,
        toStatus: current.status,
        fromCitizen: current.citizenStatus,
        toCitizen: current.citizenStatus,
        note: encodeSystemMessage({ code: "claimed" }),
        createdAt: nowIso(),
      },
    ],
  };
  all[idx] = updated;
  writeCases(all);
  return updated;
}

export function addCaseComment(
  caseId: string,
  body: string,
  visibility: CaseCommentVisibility,
  authorLabel: string,
): CaseRecord | null {
  const all = readCases();
  const idx = all.findIndex((c) => c.id === caseId);
  if (idx < 0) return null;
  const current = all[idx]!;
  const comment: CaseCommentDraft = {
    id: uid(),
    body: body.trim(),
    visibility,
    authorLabel,
    createdAt: nowIso(),
  };
  const updated: CaseRecord = {
    ...current,
    comments: [...current.comments, comment],
    updatedAt: nowIso(),
  };
  all[idx] = updated;
  writeCases(all);
  return updated;
}

/** Soft demo: institution may mark under_analysis without claiming official routing. */
export function advanceInstitutionReview(caseId: string): CaseRecord | null {
  const all = readCases();
  const idx = all.findIndex((c) => c.id === caseId);
  if (idx < 0) return null;
  const current = all[idx]!;
  if (current.status !== "new" && current.status !== "triage") return current;

  const updated: CaseRecord = {
    ...current,
    status: "under_review",
    citizenStatus: assertCitizenStatus("under_analysis", current.routings),
    updatedAt: nowIso(),
    history: [
      ...current.history,
      {
        id: uid(),
        fromStatus: current.status,
        toStatus: "under_review",
        fromCitizen: current.citizenStatus,
        toCitizen: "under_analysis",
        note: encodeSystemMessage({ code: "marked_review" }),
        createdAt: nowIso(),
      },
    ],
  };
  all[idx] = updated;
  writeCases(all);
  return updated;
}
