import type { CaseRecord } from "./types";

export const CASES_STORAGE_KEY = "animaps-cases-v1";

function normalizeRouting(
  raw: CaseRecord["routings"][number] & { reason?: string },
): CaseRecord["routings"][number] {
  const allowed = new Set([
    "initial",
    "no_competence",
    "out_of_region",
    "out_of_type",
    "partnership",
    "specialization",
    "other",
  ]);
  const reason = allowed.has(raw.reason) ? raw.reason : "initial";
  return {
    id: raw.id,
    fromInstitutionId: raw.fromInstitutionId ?? null,
    fromInstitutionLabel: raw.fromInstitutionLabel ?? null,
    toInstitutionId: raw.toInstitutionId ?? null,
    toInstitutionLabel: raw.toInstitutionLabel ?? null,
    reason: reason as CaseRecord["routings"][number]["reason"],
    note: raw.note ?? null,
    createdAt: raw.createdAt,
  };
}

function normalizeCase(raw: CaseRecord): CaseRecord {
  return {
    ...raw,
    assignedMemberId: raw.assignedMemberId ?? null,
    assignedMemberLabel: raw.assignedMemberLabel ?? null,
    assignedTeamId: raw.assignedTeamId ?? null,
    assignedTeamLabel: raw.assignedTeamLabel ?? null,
    assignments: Array.isArray(raw.assignments) ? raw.assignments : [],
    routings: Array.isArray(raw.routings)
      ? raw.routings.map(normalizeRouting)
      : [],
  };
}

export function readCases(): CaseRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CaseRecord[];
    return Array.isArray(parsed) ? parsed.map(normalizeCase) : [];
  } catch {
    return [];
  }
}

export function writeCases(cases: CaseRecord[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
}

export function clearCases(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CASES_STORAGE_KEY);
}
