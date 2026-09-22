/**
 * Ecosystem account-type catalog (Fase 1 foundation).
 * Additive — does not replace `features/user-types` (still authoritative for UI).
 * See docs/account-types.md.
 */

import type { PublicUserType, UserType } from "@/features/user-types";

export const ACCOUNT_TYPES = ["PERSON", "ORGANIZATION", "INSTITUTION"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ORGANIZATION_TYPES = [
  "NGO",
  "ANIMAL_SHELTER",
  "VETERINARY_CLINIC",
  "VETERINARY_HOSPITAL",
  "ANIMAL_BUSINESS",
  "ANIMAL_SERVICE",
  "PRIVATE_INSTITUTION",
  "OTHER",
] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

/** Lookup-backed in DB — these are seed keys, not a frozen Postgres enum. */
export const INSTITUTION_TYPE_IDS = [
  "city_hall",
  "municipal_department",
  "animal_welfare_department",
  "environmental_department",
  "health_department",
  "zoonoses_center",
  "environmental_agency",
  "public_inspection",
  "public_partner",
  "other",
] as const;
export type InstitutionTypeId = (typeof INSTITUTION_TYPE_IDS)[number];

/**
 * PERSON multi-select intentions (ecosystem catalog).
 * Superset of onboarding `UserIntention` + former OTHER roles.
 */
export const PERSON_INTENTIONS = [
  "ADOPTER",
  "PET_OWNER",
  "VOLUNTEER",
  "FOSTER_HOME",
  "INDEPENDENT_PROTECTOR",
  "COMMUNITY_MEMBER",
  "REPORTER",
  "LOST_PET_OWNER",
  "FOUND_PET_REPORTER",
  "ANIMAL_PROFESSIONAL",
  "OTHER",
] as const;
export type PersonIntention = (typeof PERSON_INTENTIONS)[number];

/** Legacy onboarding draft intention → ecosystem PersonIntention */
export const LEGACY_INTENTION_TO_PERSON: Record<string, PersonIntention> = {
  adopt: "ADOPTER",
  pet_owner: "PET_OWNER",
  help_animals: "VOLUNTEER",
  report: "REPORTER",
  lost_animal: "LOST_PET_OWNER",
  found_animal: "FOUND_PET_REPORTER",
  community: "COMMUNITY_MEMBER",
  explore: "OTHER",
  volunteer: "VOLUNTEER",
  foster_home: "FOSTER_HOME",
  independent_protector: "INDEPENDENT_PROTECTOR",
  animal_professional: "ANIMAL_PROFESSIONAL",
  lost_pet_owner: "LOST_PET_OWNER",
  found_pet_reporter: "FOUND_PET_REPORTER",
  other: "OTHER",
};

/** Ecosystem intention → DB `user_intention_kind` snake_case */
export const PERSON_INTENTION_TO_DB: Record<PersonIntention, string> = {
  ADOPTER: "adopt",
  PET_OWNER: "pet_owner",
  VOLUNTEER: "volunteer",
  FOSTER_HOME: "foster_home",
  INDEPENDENT_PROTECTOR: "independent_protector",
  COMMUNITY_MEMBER: "community",
  REPORTER: "report",
  LOST_PET_OWNER: "lost_pet_owner",
  FOUND_PET_REPORTER: "found_pet_reporter",
  ANIMAL_PROFESSIONAL: "animal_professional",
  OTHER: "other",
};

/** Derive AccountType from legacy UserType (current UI discriminator). */
export function accountTypeFromUserType(
  userType: UserType | PublicUserType | null | undefined,
): AccountType {
  switch (userType) {
    case "ONG":
    case "VETERINARY_CLINIC":
      return "ORGANIZATION";
    case "INSTITUTION":
    case "PUBLIC_AGENCY":
      return "INSTITUTION";
    case "PERSON":
    case "OTHER":
    case "BIOLOGIST":
    default:
      return "PERSON";
  }
}

export function isAccountType(value: unknown): value is AccountType {
  return (
    typeof value === "string" &&
    (ACCOUNT_TYPES as readonly string[]).includes(value)
  );
}

export function isOrganizationType(value: unknown): value is OrganizationType {
  return (
    typeof value === "string" &&
    (ORGANIZATION_TYPES as readonly string[]).includes(value)
  );
}

export function organizationTypeFromUserType(
  userType: PublicUserType | UserType,
): OrganizationType | null {
  if (userType === "ONG") return "NGO";
  if (userType === "VETERINARY_CLINIC") return "VETERINARY_CLINIC";
  return null;
}

/** OTHER role → PERSON intentions (OTHER account folds into PERSON). */
export const OTHER_ROLE_TO_INTENTIONS: Record<string, PersonIntention[]> = {
  independent_protector: ["INDEPENDENT_PROTECTOR"],
  foster_home: ["FOSTER_HOME"],
  volunteer: ["VOLUNTEER"],
  animal_professional: ["ANIMAL_PROFESSIONAL"],
  animal_business: ["ANIMAL_PROFESSIONAL"],
  community_member: ["COMMUNITY_MEMBER"],
  other: ["OTHER"],
};
