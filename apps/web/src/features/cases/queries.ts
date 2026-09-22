import { readCases } from "./storage";
import type { CaseRecord } from "./types";

export function listCases(): CaseRecord[] {
  return readCases().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getCaseById(id: string): CaseRecord | null {
  return readCases().find((c) => c.id === id) ?? null;
}

export function getCaseByReference(ref: string): CaseRecord | null {
  const normalized = ref.trim().toUpperCase();
  return (
    readCases().find(
      (c) => c.referenceNumber.toUpperCase() === normalized,
    ) ?? null
  );
}

export function listCasesForReporter(
  email: string | null | undefined,
): CaseRecord[] {
  if (!email) return [];
  const key = email.trim().toLowerCase();
  return listCases().filter(
    (c) => c.reporterEmail?.toLowerCase() === key || c.reporterId === key,
  );
}
