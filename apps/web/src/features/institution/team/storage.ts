import type { InstitutionOrgState } from "./types";
import { createEmptyOrgState } from "./types";

export const INSTITUTION_ORG_KEY = "animaps-institution-org-v1";

export function readOrgState(): InstitutionOrgState {
  if (typeof window === "undefined") return createEmptyOrgState();
  try {
    const raw = window.localStorage.getItem(INSTITUTION_ORG_KEY);
    if (!raw) return createEmptyOrgState();
    const parsed = JSON.parse(raw) as InstitutionOrgState;
    return {
      departments: Array.isArray(parsed.departments) ? parsed.departments : [],
      teams: Array.isArray(parsed.teams) ? parsed.teams : [],
      members: Array.isArray(parsed.members) ? parsed.members : [],
    };
  } catch {
    return createEmptyOrgState();
  }
}

export function writeOrgState(state: InstitutionOrgState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INSTITUTION_ORG_KEY, JSON.stringify(state));
}
