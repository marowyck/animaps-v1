/** UI capability flags — not a security boundary until Nest guards exist. */

import type { PublicUserType } from "@/features/user-types";

export const PERMISSIONS = [
  "CREATE_PROFILE",
  "VIEW_ANIMALS",
  "ADOPT",
  "REPORT",
  "MESSAGE",
  "CREATE_ANIMAL",
  "MANAGE_ANIMALS",
  "VIEW_ADOPTION_REQUESTS",
  "MANAGE_VOLUNTEERS",
  "MANAGE_ORGANIZATION",
  "MANAGE_SERVICES",
  "MANAGE_LOCATION",
  "MANAGE_PROFILE",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSIONS_BY_USER_TYPE: Record<PublicUserType, Permission[]> = {
  PERSON: ["CREATE_PROFILE", "VIEW_ANIMALS", "ADOPT", "REPORT", "MESSAGE"],
  ONG: [
    "CREATE_ANIMAL",
    "MANAGE_ANIMALS",
    "VIEW_ADOPTION_REQUESTS",
    "MANAGE_VOLUNTEERS",
    "MANAGE_ORGANIZATION",
    "MESSAGE",
  ],
  VETERINARY_CLINIC: [
    "MANAGE_SERVICES",
    "MANAGE_LOCATION",
    "MANAGE_PROFILE",
    "MESSAGE",
    "VIEW_ANIMALS",
  ],
  OTHER: ["CREATE_PROFILE", "MESSAGE", "VIEW_ANIMALS"],
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
