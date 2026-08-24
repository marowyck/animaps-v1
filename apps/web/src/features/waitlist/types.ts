export const PROFILE_TYPE_VALUES = [
  "guardian",
  "ngo",
  "clinic",
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

/** Web form state — empty profileType before selection. */
export type WaitlistFormState = {
  name: string;
  email: string;
  profileType: ProfileType | "";
  city: string;
  state: string;
  lgpdConsent: boolean;
};
