/** UI capability flags — not a security boundary until Nest guards exist. */

import type { PublicUserType } from "@/features/user-types";

export const PERMISSIONS = [
  "CREATE_PROFILE",
  "VIEW_ANIMALS",
  "ADOPT",
  "REPORT",
  "VIEW_REPORT_STATUS",
  "MESSAGE",
  "CREATE_ANIMAL",
  "MANAGE_ANIMALS",
  "VIEW_ADOPTION_REQUESTS",
  "MANAGE_VOLUNTEERS",
  "MANAGE_ORGANIZATION",
  "MANAGE_SERVICES",
  "MANAGE_LOCATION",
  "MANAGE_PROFILE",
  "VIEW_INCOMING_REPORTS",
  "ASSIGN_REPORT",
  "ROUTE_CASE",
  "FORWARD_CASE",
  "MANAGE_JURISDICTION",
  "VIEW_MAP",
  "VIEW_ANALYTICS",
  "VIEW_STATISTICS",
  "MANAGE_TEAM",
  "MANAGE_INSTITUTION",
  "EXPORT_DATA",
  "MANAGE_INTEGRATION",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** PERSON + CREATE_ANIMAL depends on `isRescuer` at session time — not in this static list. */
export const PERMISSIONS_BY_USER_TYPE: Record<PublicUserType, Permission[]> = {
  PERSON: [
    "CREATE_PROFILE",
    "VIEW_ANIMALS",
    "ADOPT",
    "REPORT",
    "VIEW_REPORT_STATUS",
    "MESSAGE",
  ],
  ONG: [
    "CREATE_ANIMAL",
    "MANAGE_ANIMALS",
    "VIEW_ADOPTION_REQUESTS",
    "MANAGE_VOLUNTEERS",
    "MANAGE_ORGANIZATION",
    "MESSAGE",
    "REPORT",
    "VIEW_REPORT_STATUS",
  ],
  VETERINARY_CLINIC: [
    "MANAGE_SERVICES",
    "MANAGE_LOCATION",
    "MANAGE_PROFILE",
    "MESSAGE",
    "VIEW_ANIMALS",
    "CREATE_ANIMAL",
  ],
  OTHER: ["CREATE_PROFILE", "MESSAGE", "VIEW_ANIMALS"],
  INSTITUTION: [
    "VIEW_INCOMING_REPORTS",
    "VIEW_REPORT_STATUS",
    "ASSIGN_REPORT",
    "ROUTE_CASE",
    "FORWARD_CASE",
    "MANAGE_JURISDICTION",
    "VIEW_MAP",
    "VIEW_ANALYTICS",
    "VIEW_STATISTICS",
    "MANAGE_TEAM",
    "MANAGE_INSTITUTION",
    "EXPORT_DATA",
    "MANAGE_INTEGRATION",
    "MESSAGE",
    "REPORT",
  ],
};

export function hasPermission(
  userType: PublicUserType | null | undefined,
  permission: Permission,
): boolean {
  if (!userType) return false;
  return PERMISSIONS_BY_USER_TYPE[userType]?.includes(permission) ?? false;
}

export function permissionsFor(
  userType: PublicUserType | null | undefined,
): Permission[] {
  if (!userType) return [];
  return PERMISSIONS_BY_USER_TYPE[userType] ?? [];
}
