/**
 * RBAC catalog (Fase 1 foundation) — types + seed keys.
 * Not wired into UI guards yet; mirrors docs/roles-and-permissions.md.
 */

export const ROLE_SCOPES = ["PLATFORM", "ORGANIZATION", "INSTITUTION"] as const;
export type RoleScope = (typeof ROLE_SCOPES)[number];

export const PLATFORM_ROLES = ["SUPER_ADMIN", "PLATFORM_ADMIN"] as const;

export const ORGANIZATION_ROLES = [
  "ORGANIZATION_ADMIN",
  "ORGANIZATION_MEMBER",
  "READ_ONLY",
] as const;

export const INSTITUTION_ROLES = [
  "INSTITUTION_ADMIN",
  "INSTITUTION_MANAGER",
  "ANALYST",
  "OPERATOR",
  "INSPECTOR",
  "MODERATOR",
  "READ_ONLY",
] as const;

export const ROLE_KEYS = [
  ...PLATFORM_ROLES,
  ...ORGANIZATION_ROLES.filter((r) => r !== "READ_ONLY"),
  ...INSTITUTION_ROLES,
  "PERSON",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number] | "READ_ONLY";

export type RoleDefinition = {
  key: RoleKey;
  scope: RoleScope;
  description: string;
};

export const ROLE_CATALOG: RoleDefinition[] = [
  {
    key: "SUPER_ADMIN",
    scope: "PLATFORM",
    description: "Full platform control",
  },
  {
    key: "PLATFORM_ADMIN",
    scope: "PLATFORM",
    description: "Platform operations and verification",
  },
  {
    key: "ORGANIZATION_ADMIN",
    scope: "ORGANIZATION",
    description: "Manage organization members and settings",
  },
  {
    key: "ORGANIZATION_MEMBER",
    scope: "ORGANIZATION",
    description: "Day-to-day organization work",
  },
  {
    key: "INSTITUTION_ADMIN",
    scope: "INSTITUTION",
    description: "Manage institution, teams, and policies",
  },
  {
    key: "INSTITUTION_MANAGER",
    scope: "INSTITUTION",
    description: "Oversee triage queues and assignments",
  },
  {
    key: "ANALYST",
    scope: "INSTITUTION",
    description: "Analyze and update assigned cases",
  },
  {
    key: "OPERATOR",
    scope: "INSTITUTION",
    description: "Operational case handling",
  },
  {
    key: "INSPECTOR",
    scope: "INSTITUTION",
    description: "Field inspection and validation",
  },
  {
    key: "MODERATOR",
    scope: "INSTITUTION",
    description: "Moderate reports and duplicates",
  },
  {
    key: "READ_ONLY",
    scope: "INSTITUTION",
    description: "Read-only access within scope",
  },
  {
    key: "PERSON",
    scope: "PLATFORM",
    description: "Default individual account capabilities (UI catalog)",
  },
];

/** Permission keys for RBAC seed (domain-scoped). */
export const RBAC_PERMISSIONS = [
  // Person / citizen
  "VIEW_ANIMALS",
  "CREATE_REPORT",
  "VIEW_REPORT_STATUS",
  "CREATE_LOST_PET",
  "CREATE_FOUND_PET",
  "MESSAGE",
  "CREATE_PROFILE",
  "EDIT_PROFILE",
  "ADOPT",
  "FAVORITE",
  // Organization
  "CREATE_ANIMAL",
  "EDIT_ANIMAL",
  "MANAGE_ANIMALS",
  "VIEW_ADOPTION_REQUESTS",
  "MANAGE_VOLUNTEERS",
  "MANAGE_DONATIONS",
  "VIEW_REPORTS",
  "RESPOND_REPORTS",
  "MANAGE_ORGANIZATION",
  "MANAGE_SERVICES",
  "MANAGE_LOCATION",
  "MANAGE_PROFILE",
  "VIEW_PUBLIC_REPORTS",
  "RESPOND_CONTACTS",
  // Institution
  "VIEW_INCOMING_REPORTS",
  "VIEW_ASSIGNED_REPORTS",
  "ASSIGN_REPORT",
  "UPDATE_REPORT_STATUS",
  "REQUEST_INFORMATION",
  "VIEW_STATISTICS",
  "VIEW_MAP",
  "EXPORT_DATA",
  "MANAGE_TEAM",
  "MANAGE_INSTITUTION",
  "MANAGE_JURISDICTION",
  "VIEW_ANALYTICS",
  "CREATE_OFFICIAL_RESPONSE",
  "VALIDATE_CASE",
  "ROUTE_CASE",
  "FORWARD_CASE",
  "MANAGE_INTEGRATION",
] as const;

export type RbacPermission = (typeof RBAC_PERMISSIONS)[number];

export type PermissionDomain =
  | "person"
  | "organization"
  | "institution"
  | "platform";

export const PERMISSION_DOMAIN: Record<RbacPermission, PermissionDomain> = {
  VIEW_ANIMALS: "person",
  CREATE_REPORT: "person",
  VIEW_REPORT_STATUS: "person",
  CREATE_LOST_PET: "person",
  CREATE_FOUND_PET: "person",
  MESSAGE: "person",
  CREATE_PROFILE: "person",
  EDIT_PROFILE: "person",
  ADOPT: "person",
  FAVORITE: "person",
  CREATE_ANIMAL: "organization",
  EDIT_ANIMAL: "organization",
  MANAGE_ANIMALS: "organization",
  VIEW_ADOPTION_REQUESTS: "organization",
  MANAGE_VOLUNTEERS: "organization",
  MANAGE_DONATIONS: "organization",
  VIEW_REPORTS: "organization",
  RESPOND_REPORTS: "organization",
  MANAGE_ORGANIZATION: "organization",
  MANAGE_SERVICES: "organization",
  MANAGE_LOCATION: "organization",
  MANAGE_PROFILE: "organization",
  VIEW_PUBLIC_REPORTS: "organization",
  RESPOND_CONTACTS: "organization",
  VIEW_INCOMING_REPORTS: "institution",
  VIEW_ASSIGNED_REPORTS: "institution",
  ASSIGN_REPORT: "institution",
  UPDATE_REPORT_STATUS: "institution",
  REQUEST_INFORMATION: "institution",
  VIEW_STATISTICS: "institution",
  VIEW_MAP: "institution",
  EXPORT_DATA: "institution",
  MANAGE_TEAM: "institution",
  MANAGE_INSTITUTION: "institution",
  MANAGE_JURISDICTION: "institution",
  VIEW_ANALYTICS: "institution",
  CREATE_OFFICIAL_RESPONSE: "institution",
  VALIDATE_CASE: "institution",
  ROUTE_CASE: "institution",
  FORWARD_CASE: "institution",
  MANAGE_INTEGRATION: "institution",
};

/** Default permission sets per role (seed matrix). */
export const ROLE_PERMISSION_SEED: Partial<
  Record<RoleKey, readonly RbacPermission[]>
> = {
  ORGANIZATION_ADMIN: [
    "CREATE_ANIMAL",
    "EDIT_ANIMAL",
    "MANAGE_ANIMALS",
    "VIEW_ADOPTION_REQUESTS",
    "MANAGE_VOLUNTEERS",
    "MANAGE_DONATIONS",
    "VIEW_REPORTS",
    "RESPOND_REPORTS",
    "MANAGE_ORGANIZATION",
    "MANAGE_SERVICES",
    "MANAGE_LOCATION",
    "MANAGE_PROFILE",
    "MESSAGE",
  ],
  ORGANIZATION_MEMBER: [
    "CREATE_ANIMAL",
    "EDIT_ANIMAL",
    "MANAGE_ANIMALS",
    "VIEW_ADOPTION_REQUESTS",
    "VIEW_REPORTS",
    "RESPOND_REPORTS",
    "MESSAGE",
  ],
  INSTITUTION_ADMIN: [
    "VIEW_INCOMING_REPORTS",
    "VIEW_ASSIGNED_REPORTS",
    "ASSIGN_REPORT",
    "UPDATE_REPORT_STATUS",
    "REQUEST_INFORMATION",
    "VIEW_STATISTICS",
    "VIEW_MAP",
    "EXPORT_DATA",
    "MANAGE_TEAM",
    "MANAGE_INSTITUTION",
    "MANAGE_JURISDICTION",
    "VIEW_ANALYTICS",
    "CREATE_OFFICIAL_RESPONSE",
    "VALIDATE_CASE",
    "ROUTE_CASE",
    "FORWARD_CASE",
    "MANAGE_INTEGRATION",
  ],
  INSTITUTION_MANAGER: [
    "VIEW_INCOMING_REPORTS",
    "VIEW_ASSIGNED_REPORTS",
    "ASSIGN_REPORT",
    "UPDATE_REPORT_STATUS",
    "REQUEST_INFORMATION",
    "VIEW_STATISTICS",
    "VIEW_MAP",
    "VIEW_ANALYTICS",
    "VALIDATE_CASE",
    "ROUTE_CASE",
    "FORWARD_CASE",
    "CREATE_OFFICIAL_RESPONSE",
  ],
  ANALYST: [
    "VIEW_INCOMING_REPORTS",
    "VIEW_ASSIGNED_REPORTS",
    "UPDATE_REPORT_STATUS",
    "REQUEST_INFORMATION",
    "VIEW_MAP",
    "CREATE_OFFICIAL_RESPONSE",
  ],
  OPERATOR: [
    "VIEW_ASSIGNED_REPORTS",
    "UPDATE_REPORT_STATUS",
    "REQUEST_INFORMATION",
    "VIEW_MAP",
  ],
  INSPECTOR: [
    "VIEW_ASSIGNED_REPORTS",
    "UPDATE_REPORT_STATUS",
    "VALIDATE_CASE",
    "VIEW_MAP",
  ],
  MODERATOR: [
    "VIEW_INCOMING_REPORTS",
    "UPDATE_REPORT_STATUS",
    "VALIDATE_CASE",
  ],
  PERSON: [
    "VIEW_ANIMALS",
    "CREATE_REPORT",
    "VIEW_REPORT_STATUS",
    "CREATE_LOST_PET",
    "CREATE_FOUND_PET",
    "MESSAGE",
    "CREATE_PROFILE",
    "EDIT_PROFILE",
    "ADOPT",
    "FAVORITE",
  ],
  READ_ONLY: ["VIEW_INCOMING_REPORTS", "VIEW_ASSIGNED_REPORTS", "VIEW_MAP"],
};

export function permissionsForRole(role: RoleKey): RbacPermission[] {
  return [...(ROLE_PERMISSION_SEED[role] ?? [])];
}

export function roleScope(role: RoleKey): RoleScope | null {
  const found = ROLE_CATALOG.find((r) => r.key === role);
  return found?.scope ?? null;
}
