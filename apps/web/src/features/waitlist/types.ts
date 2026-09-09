import {
  PUBLIC_USER_TYPES,
  USER_TYPE_TO_DB,
  type PublicUserType,
} from "@/features/user-types";

/** Public signup user types (DB snake_case stored on waitlist). */
export const PROFILE_TYPE_VALUES = [
  "person",
  "ong",
  "veterinary_clinic",
  "other",
] as const;

export type ProfileType = (typeof PROFILE_TYPE_VALUES)[number];

/** Loose JSON body before validation. */
export type WaitlistBody = {
  name?: string;
  email?: string;
  profileType?: string;
  city?: string;
  state?: string;
  lgpdConsent?: boolean;
};

/** Normalized lead after server-side validation (pre-persistence). */
export type WaitlistLead = {
  name: string;
  email: string;
  profileType: ProfileType;
  city: string | null;
  state: string | null;
  lgpdConsentAt: string;
};

/** Web form state — empty profileType before selection; UI uses PublicUserType. */
export type WaitlistFormState = {
  name: string;
  email: string;
  /** SCREAMING_SNAKE in UI; converted to snake_case on submit. */
  profileType: PublicUserType | "";
  city: string;
  state: string;
  lgpdConsent: boolean;
};

export function toDbProfileType(
  userType: PublicUserType,
): ProfileType {
  return USER_TYPE_TO_DB[userType] as ProfileType;
}

export { PUBLIC_USER_TYPES };
