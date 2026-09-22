/**
 * Institution team mock (Fase 6) — aligned to institution_departments / teams / members.
 * Individual logins only — no shared institutional accounts.
 */

export const INSTITUTION_MEMBER_ROLES = [
  "INSTITUTION_ADMIN",
  "INSTITUTION_MANAGER",
  "ANALYST",
  "OPERATOR",
  "INSPECTOR",
  "MODERATOR",
  "READ_ONLY",
] as const;

export type InstitutionMemberRole = (typeof INSTITUTION_MEMBER_ROLES)[number];

export const MEMBERSHIP_STATUSES = [
  "invited",
  "active",
  "suspended",
  "left",
] as const;

export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

export type InstitutionDepartmentRecord = {
  id: string;
  name: string;
  description: string;
  parentDepartmentId: string | null;
  createdAt: string;
};

export type InstitutionTeamRecord = {
  id: string;
  name: string;
  description: string;
  departmentId: string | null;
  createdAt: string;
};

export type InstitutionMemberRecord = {
  id: string;
  /** Mock identity key — email doubles as user id until Nest auth. */
  email: string;
  displayName: string;
  role: InstitutionMemberRole;
  departmentId: string | null;
  teamId: string | null;
  status: MembershipStatus;
  invitedAt: string;
  joinedAt: string | null;
};

export type InstitutionOrgState = {
  departments: InstitutionDepartmentRecord[];
  teams: InstitutionTeamRecord[];
  members: InstitutionMemberRecord[];
};

export function createEmptyOrgState(): InstitutionOrgState {
  return { departments: [], teams: [], members: [] };
}
