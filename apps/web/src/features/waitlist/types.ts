export type ProfileType = "guardian" | "ngo" | "clinic" | "other";

export type WaitlistFormState = {
  name: string;
  email: string;
  profileType: ProfileType | "";
  city: string;
  state: string;
  lgpdConsent: boolean;
};

export type WaitlistLead = {
  name: string;
  email: string;
  profileType: ProfileType;
  city: string | null;
  state: string | null;
  lgpdConsentAt: string;
};
