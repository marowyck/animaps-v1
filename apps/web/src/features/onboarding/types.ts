/** Domain types for progressive onboarding (frontend draft → Wave 2 tables). */

import type {
  AccountType,
  InstitutionTypeId,
  OrganizationType,
} from "@/features/account-types";
import type { PublicUserType } from "@/features/user-types";

export type UserIntention =
  | "adopt"
  | "pet_owner"
  | "help_animals"
  | "volunteer"
  | "foster_home"
  | "independent_protector"
  | "animal_professional"
  | "report"
  | "lost_animal"
  | "found_animal"
  | "community"
  | "explore";

export type OtherRole =
  | "independent_protector"
  | "foster_home"
  | "volunteer"
  | "animal_professional"
  | "animal_business"
  | "community_member"
  | "other";

export type AnimalTypePreference =
  | "dog"
  | "cat"
  | "rabbit"
  | "bird"
  | "small_pets"
  | "reptiles"
  | "horses"
  | "other"
  | "any";

export type AnimalSizePreference =
  | "small"
  | "medium"
  | "large"
  | "giant"
  | "any";

export type AnimalFilterPreferences = {
  ages: string[];
  sex: string[];
  vaccination: string[];
  neutered: string[];
  specialNeeds: string[];
  compatibility: string[];
  energyLevel: string[];
  environment: string[];
};

export type LocationPermission = "granted" | "denied" | "not_requested";

export type SelfieVerificationStatus =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "retry_required";

export type PrivacyVisibility = "public" | "matches" | "private";

export type AdditionalInfoKey =
  | "animal_experience"
  | "housing_type"
  | "has_yard"
  | "other_pets"
  | "children_at_home"
  | "available_time"
  | "adoption_readiness"
  | "foster_availability"
  | "volunteer_interest"
  | "city_region";

export type AdditionalInfoEntry = {
  value: string | null;
  visibility: PrivacyVisibility;
};

export type OrganizationDraft = {
  tradeName: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    other: string;
  };
  city: string;
  state: string;
  areaOfOperation: string;
  animalTypesServed: AnimalTypePreference[];
  hasShelter: boolean;
  doesAdoptions: boolean;
  doesRescues: boolean;
  acceptsVolunteers: boolean;
  acceptsDonations: boolean;
};

export type VeterinaryDraft = {
  tradeName: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  businessHours: string;
  is24h: boolean;
  emergencyCare: boolean;
  homeService: boolean;
  animalsServed: AnimalTypePreference[];
  servicesOffered: string[];
};

/** Soft institution profile collected during INSTITUTION onboarding (mock until API). */
export type InstitutionDraft = {
  officialName: string;
  publicName: string;
  description: string;
  email: string;
  emailDomain: string;
  phone: string;
  website: string;
  responsibleDepartment: string;
  dataResponsibleArea: string;
};

export type OnboardingDraft = {
  email: string | null;
  displayName: string | null;
  /** Wave 2 discriminator — still drives many UI permissions. */
  userType: PublicUserType | null;
  /** Ecosystem account type (Fase 2) — preferred by `resolveFlowKey`. */
  accountType: AccountType | null;
  organizationType: OrganizationType | null;
  institutionTypeId: InstitutionTypeId | null;
  guidelinesAcceptedAt: string | null;
  intentions: UserIntention[];
  otherRole: OtherRole | null;
  animalTypes: AnimalTypePreference[];
  animalSizes: AnimalSizePreference[];
  animalFilters: AnimalFilterPreferences;
  interestIds: string[];
  additionalInfo: Partial<Record<AdditionalInfoKey, AdditionalInfoEntry>>;
  organization: OrganizationDraft;
  veterinary: VeterinaryDraft;
  institution: InstitutionDraft;
  selfieStatus: SelfieVerificationStatus;
  selfiePreviewUrl: string | null;
  institutionalVerificationStatus: SelfieVerificationStatus;
  locationPermission: LocationPermission;
  completedAt: string | null;
};

export const MAX_INTERESTS = 5;

export const EMPTY_ANIMAL_FILTERS: AnimalFilterPreferences = {
  ages: [],
  sex: [],
  vaccination: [],
  neutered: [],
  specialNeeds: [],
  compatibility: [],
  energyLevel: [],
  environment: [],
};

export function createEmptyOrganization(): OrganizationDraft {
  return {
    tradeName: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    socialLinks: { instagram: "", facebook: "", other: "" },
    city: "",
    state: "",
    areaOfOperation: "",
    animalTypesServed: [],
    hasShelter: false,
    doesAdoptions: false,
    doesRescues: false,
    acceptsVolunteers: false,
    acceptsDonations: false,
  };
}

export function createEmptyVeterinary(): VeterinaryDraft {
  return {
    tradeName: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    businessHours: "",
    is24h: false,
    emergencyCare: false,
    homeService: false,
    animalsServed: [],
    servicesOffered: [],
  };
}

export function createEmptyInstitution(): InstitutionDraft {
  return {
    officialName: "",
    publicName: "",
    description: "",
    email: "",
    emailDomain: "",
    phone: "",
    website: "",
    responsibleDepartment: "",
    dataResponsibleArea: "",
  };
}

export function createEmptyDraft(
  partial?: Partial<OnboardingDraft>,
): OnboardingDraft {
  const base: OnboardingDraft = {
    email: null,
    displayName: null,
    userType: null,
    accountType: null,
    organizationType: null,
    institutionTypeId: null,
    guidelinesAcceptedAt: null,
    intentions: [],
    otherRole: null,
    animalTypes: [],
    animalSizes: [],
    animalFilters: { ...EMPTY_ANIMAL_FILTERS },
    interestIds: [],
    additionalInfo: {},
    organization: createEmptyOrganization(),
    veterinary: createEmptyVeterinary(),
    institution: createEmptyInstitution(),
    selfieStatus: "pending",
    selfiePreviewUrl: null,
    institutionalVerificationStatus: "pending",
    locationPermission: "not_requested",
    completedAt: null,
  };

  if (!partial) return base;

  return {
    ...base,
    ...partial,
    organization: {
      ...createEmptyOrganization(),
      ...partial.organization,
      socialLinks: {
        ...createEmptyOrganization().socialLinks,
        ...partial.organization?.socialLinks,
      },
    },
    veterinary: {
      ...createEmptyVeterinary(),
      ...partial.veterinary,
    },
    institution: {
      ...createEmptyInstitution(),
      ...partial.institution,
    },
    animalFilters: {
      ...EMPTY_ANIMAL_FILTERS,
      ...partial.animalFilters,
    },
  };
}

/** All possible step ids across user-type flows. */
export const ALL_ONBOARDING_STEP_IDS = [
  "guidelines",
  "intentions",
  "intention", // legacy alias → intentions
  "animal-preferences",
  "animal-type",
  "animal-size",
  "preferences",
  "interests",
  "additional-info",
  "profile",
  "verification",
  "organization-type",
  "organization-info",
  "location",
  "animal-types",
  "services",
  "clinic-info",
  "animals-served",
  "role-selection",
  "institution-type",
  "institution-info",
] as const;

export type OnboardingStepId = (typeof ALL_ONBOARDING_STEP_IDS)[number];

/** @deprecated Use getActiveSteps from config — kept for ProgressIndicator fallbacks. */
export const ONBOARDING_STEPS = [
  "guidelines",
  "intention",
  "animal-type",
  "animal-size",
  "preferences",
  "interests",
  "profile",
  "verification",
] as const;

export function stepIndex(id: OnboardingStepId): number {
  const idx = (ONBOARDING_STEPS as readonly string[]).indexOf(id);
  return idx >= 0 ? idx + 1 : 1;
}

export const ONBOARDING_STEP_TOTAL = ONBOARDING_STEPS.length;
