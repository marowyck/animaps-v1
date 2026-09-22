import { readOrgState, writeOrgState } from "./storage";
import type {
  InstitutionDepartmentRecord,
  InstitutionMemberRecord,
  InstitutionMemberRole,
  InstitutionOrgState,
  InstitutionTeamRecord,
  MembershipStatus,
} from "./types";
import { createEmptyOrgState } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `org-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("animaps-org-changed"));
}

export function getOrgState(): InstitutionOrgState {
  return readOrgState();
}

/** Ensure current user exists as INSTITUTION_ADMIN (individual login). */
export function ensureAdminMember(input: {
  email: string | null | undefined;
  displayName: string | null | undefined;
}): InstitutionMemberRecord {
  const state = readOrgState();
  const email = (input.email ?? "").trim().toLowerCase() || "admin@local.mock";
  const existing = state.members.find(
    (m) => m.email.toLowerCase() === email && m.status !== "left",
  );
  if (existing) return existing;

  const admin: InstitutionMemberRecord = {
    id: uid(),
    email,
    displayName: input.displayName?.trim() || email.split("@")[0] || "Admin",
    role: "INSTITUTION_ADMIN",
    departmentId: null,
    teamId: null,
    status: "active",
    invitedAt: nowIso(),
    joinedAt: nowIso(),
  };
  writeOrgState({ ...state, members: [admin, ...state.members] });
  emitChange();
  return admin;
}

export function addDepartment(input: {
  name: string;
  description?: string;
  parentDepartmentId?: string | null;
}): InstitutionDepartmentRecord {
  const state = readOrgState();
  const dept: InstitutionDepartmentRecord = {
    id: uid(),
    name: input.name.trim(),
    description: input.description?.trim() ?? "",
    parentDepartmentId: input.parentDepartmentId ?? null,
    createdAt: nowIso(),
  };
  writeOrgState({ ...state, departments: [...state.departments, dept] });
  emitChange();
  return dept;
}

export function removeDepartment(id: string): void {
  const state = readOrgState();
  writeOrgState({
    ...state,
    departments: state.departments.filter((d) => d.id !== id),
    teams: state.teams.map((t) =>
      t.departmentId === id ? { ...t, departmentId: null } : t,
    ),
    members: state.members.map((m) =>
      m.departmentId === id ? { ...m, departmentId: null } : m,
    ),
  });
  emitChange();
}

export function addTeam(input: {
  name: string;
  description?: string;
  departmentId?: string | null;
}): InstitutionTeamRecord {
  const state = readOrgState();
  const team: InstitutionTeamRecord = {
    id: uid(),
    name: input.name.trim(),
    description: input.description?.trim() ?? "",
    departmentId: input.departmentId ?? null,
    createdAt: nowIso(),
  };
  writeOrgState({ ...state, teams: [...state.teams, team] });
  emitChange();
  return team;
}

export function removeTeam(id: string): void {
  const state = readOrgState();
  writeOrgState({
    ...state,
    teams: state.teams.filter((t) => t.id !== id),
    members: state.members.map((m) =>
      m.teamId === id ? { ...m, teamId: null } : m,
    ),
  });
  emitChange();
}

export function inviteMember(input: {
  email: string;
  displayName?: string;
  role: InstitutionMemberRole;
  departmentId?: string | null;
  teamId?: string | null;
}): InstitutionMemberRecord | { error: "duplicate" | "invalid_email" } {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return { error: "invalid_email" };
  const state = readOrgState();
  if (
    state.members.some(
      (m) => m.email.toLowerCase() === email && m.status !== "left",
    )
  ) {
    return { error: "duplicate" };
  }
  const member: InstitutionMemberRecord = {
    id: uid(),
    email,
    displayName: input.displayName?.trim() || email.split("@")[0] || email,
    role: input.role,
    departmentId: input.departmentId ?? null,
    teamId: input.teamId ?? null,
    status: "invited",
    invitedAt: nowIso(),
    joinedAt: null,
  };
  writeOrgState({ ...state, members: [...state.members, member] });
  emitChange();
  return member;
}

export function updateMember(
  id: string,
  patch: Partial<
    Pick<
      InstitutionMemberRecord,
      "role" | "departmentId" | "teamId" | "status" | "displayName"
    >
  >,
): InstitutionMemberRecord | null {
  const state = readOrgState();
  const idx = state.members.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  const current = state.members[idx]!;
  const next: InstitutionMemberRecord = {
    ...current,
    ...patch,
    joinedAt:
      patch.status === "active" && !current.joinedAt
        ? nowIso()
        : current.joinedAt,
  };
  const members = [...state.members];
  members[idx] = next;
  writeOrgState({ ...state, members });
  emitChange();
  return next;
}

export function setMemberStatus(
  id: string,
  status: MembershipStatus,
): InstitutionMemberRecord | null {
  return updateMember(id, { status });
}

export function resetOrgState(): void {
  writeOrgState(createEmptyOrgState());
  emitChange();
}

export { createEmptyOrgState };
