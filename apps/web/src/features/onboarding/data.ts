import type {
  AdditionalInfoKey,
  AnimalSizePreference,
  AnimalTypePreference,
  OtherRole,
  UserIntention,
} from "./types";

export type CatalogItem<T extends string> = {
  id: T;
  /** Lucide icon name key resolved in UI */
  icon: string;
};

export const INTENTION_IDS: UserIntention[] = [
  "adopt",
  "pet_owner",
  "help_animals",
  "report",
  "lost_animal",
  "found_animal",
  "community",
  "explore",
];

export const OTHER_ROLE_IDS: OtherRole[] = [
  "independent_protector",
  "foster_home",
  "volunteer",
  "animal_professional",
  "animal_business",
  "community_member",
  "other",
];

export const ANIMAL_TYPE_IDS: AnimalTypePreference[] = [
  "dog",
  "cat",
  "rabbit",
  "bird",
  "small_pets",
  "reptiles",
  "horses",
  "other",
  "any",
];

export const ANIMAL_SIZE_IDS: AnimalSizePreference[] = [
  "small",
  "medium",
  "large",
  "giant",
  "any",
];

export const CLINIC_SERVICE_IDS = [
  "vaccination",
  "neutering",
  "emergency_care",
  "grooming",
  "consultation",
  "surgery",
  "imaging",
  "hospitalization",
] as const;

export type InterestCatalogItem = {
  id: string;
  icon: string;
};

/** Animal-universe interest catalog — labels via i18n `onboarding.interests.items`. */
export const INTEREST_CATALOG: InterestCatalogItem[] = [
  { id: "dogs", icon: "Dog" },
  { id: "cats", icon: "Cat" },
  { id: "adoption", icon: "HeartHandshake" },
  { id: "rescue", icon: "LifeBuoy" },
  { id: "foster", icon: "Home" },
  { id: "volunteering", icon: "HandHeart" },
  { id: "pet_training", icon: "GraduationCap" },
  { id: "pet_health", icon: "Stethoscope" },
  { id: "nutrition", icon: "Bone" },
  { id: "walks", icon: "Footprints" },
  { id: "nature", icon: "Trees" },
  { id: "wildlife", icon: "Bird" },
  { id: "animal_photo", icon: "Camera" },
  { id: "pet_events", icon: "CalendarHeart" },
  { id: "ngo_support", icon: "Building2" },
  { id: "lost_found", icon: "Search" },
  { id: "responsible_ownership", icon: "ShieldCheck" },
  { id: "special_needs", icon: "HeartPulse" },
  { id: "senior_pets", icon: "PawPrint" },
  { id: "community", icon: "Users" },
];

export const ADDITIONAL_INFO_KEYS: AdditionalInfoKey[] = [
  "animal_experience",
  "housing_type",
  "has_yard",
  "other_pets",
  "children_at_home",
  "available_time",
  "adoption_readiness",
  "foster_availability",
  "volunteer_interest",
  "city_region",
];

export const FILTER_OPTION_IDS = {
  ages: ["puppy", "young", "adult", "senior"],
  sex: ["male", "female", "any"],
  vaccination: ["vaccinated", "any"],
  neutered: ["yes", "any"],
  specialNeeds: ["yes", "any"],
  compatibility: ["children", "cats", "dogs", "other_animals"],
  energyLevel: ["low", "medium", "high"],
  environment: ["apartment", "house", "farm", "any"],
} as const;
