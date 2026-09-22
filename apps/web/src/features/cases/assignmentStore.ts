import { assertCitizenStatus } from "./status";
import { readCases, writeCases } from "./storage";
import { nowIso, uid } from "./helpers";
import type { CaseRecord } from "./types";
import { encodeSystemMessage } from "./systemMessages";

/** Assign case to a member and/or team (Fase 6). Individual logins only. */
export function assignCase(
  caseId: string,
  input: {
    memberId?: string | null;
    memberLabel?: string | null;
    teamId?: string | null;
    teamLabel?: string | null;
    assignedByLabel?: string | null;
    note?: string | null;
  },
): CaseRecord | null {
  const all = readCases();
  const idx = all.findIndex((c) => c.id === caseId);
  if (idx < 0) return null;
  const current = all[idx]!;
  const createdAt = nowIso();

  const endedAssignments = (current.assignments ?? []).map((a) =>
    a.endedAt ? a : { ...a, endedAt: createdAt },
  );

  const assignment = {
    id: uid(),
    memberId: input.memberId ?? null,
    memberLabel: input.memberLabel ?? null,
    teamId: input.teamId ?? null,
    teamLabel: input.teamLabel ?? null,
    assignedByLabel: input.assignedByLabel ?? null,
    note: input.note ?? null,
    createdAt,
    endedAt: null,
  };

  const nextStatus =
    current.status === "new" ||
    current.status === "triage" ||
    current.status === "under_review"
      ? ("assigned" as const)
      : current.status;

  const updated: CaseRecord = {
    ...current,
    status: nextStatus,
    citizenStatus: assertCitizenStatus(
      nextStatus === "assigned" ? "in_progress" : current.citizenStatus,
      current.routings,
    ),
    assignedMemberId: input.memberId ?? null,
    assignedMemberLabel: input.memberLabel ?? null,
    assignedTeamId: input.teamId ?? null,
    assignedTeamLabel: input.teamLabel ?? null,
    assignments: [...endedAssignments, assignment],
    participants: [
      ...current.participants.filter((p) => p.role !== "assignee"),
      ...(input.memberLabel
        ? [
            {
              id: uid(),
              role: "assignee" as const,
              userLabel: input.memberLabel,
              createdAt,
            },
          ]
        : []),
    ],
    history: [
      ...current.history,
      {
        id: uid(),
        fromStatus: current.status,
        toStatus: nextStatus,
        fromCitizen: current.citizenStatus,
        toCitizen:
          nextStatus === "assigned" ? "in_progress" : current.citizenStatus,
        note: encodeSystemMessage({
          code: "assigned",
          member: input.memberLabel ?? undefined,
          team: input.teamLabel ?? undefined,
        }),
        createdAt,
      },
    ],
    updatedAt: createdAt,
  };
  all[idx] = updated;
  writeCases(all);
  return updated;
}

export function unassignCase(caseId: string): CaseRecord | null {
  const all = readCases();
  const idx = all.findIndex((c) => c.id === caseId);
  if (idx < 0) return null;
  const current = all[idx]!;
  const createdAt = nowIso();
  const updated: CaseRecord = {
    ...current,
    assignedMemberId: null,
    assignedMemberLabel: null,
    assignedTeamId: null,
    assignedTeamLabel: null,
    assignments: (current.assignments ?? []).map((a) =>
      a.endedAt ? a : { ...a, endedAt: createdAt },
    ),
    participants: current.participants.filter((p) => p.role !== "assignee"),
    history: [
      ...current.history,
      {
        id: uid(),
        fromStatus: current.status,
        toStatus: current.status,
        fromCitizen: current.citizenStatus,
        toCitizen: current.citizenStatus,
        note: encodeSystemMessage({ code: "assignment_cleared" }),
        createdAt,
      },
    ],
    updatedAt: createdAt,
  };
  all[idx] = updated;
  writeCases(all);
  return updated;
}
