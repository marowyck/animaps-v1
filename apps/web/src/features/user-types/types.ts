/** Shared user-type catalog (signup + onboarding + dashboard + permissions). */

export const PUBLIC_USER_TYPES = [
  "PERSON",
  "ONG",
  "VETERINARY_CLINIC",
  "OTHER",
] as const;

export type PublicUserType = (typeof PUBLIC_USER_TYPES)[number];

/** Includes admin-assigned types not selectable on public signup. */
export const USER_TYPES = [
  ...PUBLIC_USER_TYPES,
  "PUBLIC_AGENCY",
  "BIOLOGIST",
] as const;

export type UserType = (typeof USER_TYPES)[number];

/** DB / waitlist snake_case ↔ TypeScript SCREAMING_SNAKE */
export const USER_TYPE_TO_DB: Record<PublicUserType, string> = {
  PERSON: "person",
  ONG: "ong",
  VETERINARY_CLINIC: "veterinary_clinic",
  OTHER: "other",
};

export const DB_TO_USER_TYPE: Record<string, PublicUserType> = {
  person: "PERSON",
  ong: "ONG",
  veterinary_clinic: "VETERINARY_CLINIC",
  other: "OTHER",
  // legacy waitlist values
  guardian: "PERSON",
  ngo: "ONG",
  clinic: "VETERINARY_CLINIC",
};

export function isPublicUserType(value: unknown): value is PublicUserType {
  return (
    typeof value === "string" &&
    (PUBLIC_USER_TYPES as readonly string[]).includes(value)
  );
}

export function normalizeUserType(value: string | null | undefined): PublicUserType {
  if (!value) return "PERSON";
  if (isPublicUserType(value)) return value;
  return DB_TO_USER_TYPE[value] ?? "PERSON";
}
