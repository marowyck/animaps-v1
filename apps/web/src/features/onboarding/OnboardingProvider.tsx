"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { PublicUserType } from "@/features/user-types";
import { normalizeUserType } from "@/features/user-types";
import { readOnboardingDraft, writeOnboardingDraft } from "./storage";
import {
  createEmptyDraft,
  createEmptyOrganization,
  createEmptyVeterinary,
  MAX_INTERESTS,
  type AdditionalInfoEntry,
  type AdditionalInfoKey,
  type AnimalFilterPreferences,
  type AnimalSizePreference,
  type AnimalTypePreference,
  type LocationPermission,
  type OnboardingDraft,
  type OrganizationDraft,
  type OtherRole,
  type SelfieVerificationStatus,
  type UserIntention,
  type VeterinaryDraft,
} from "./types";

type Action =
  | { type: "hydrate"; draft: OnboardingDraft }
  | { type: "patch"; patch: Partial<OnboardingDraft> }
  | { type: "setUserType"; userType: PublicUserType }
  | { type: "setIntentions"; intentions: UserIntention[] }
  | { type: "toggleIntention"; intention: UserIntention }
  | { type: "setOtherRole"; otherRole: OtherRole }
  | { type: "setAnimalTypes"; animalTypes: AnimalTypePreference[] }
  | { type: "toggleAnimalType"; animalType: AnimalTypePreference }
  | { type: "setAnimalSizes"; animalSizes: AnimalSizePreference[] }
  | { type: "toggleAnimalSize"; animalSize: AnimalSizePreference }
  | { type: "setAnimalFilters"; animalFilters: AnimalFilterPreferences }
  | { type: "setInterests"; interestIds: string[] }
  | { type: "toggleInterest"; interestId: string }
  | {
      type: "setAdditionalInfo";
      key: AdditionalInfoKey;
      entry: AdditionalInfoEntry;
    }
  | { type: "patchOrganization"; patch: Partial<OrganizationDraft> }
  | { type: "patchVeterinary"; patch: Partial<VeterinaryDraft> }
  | { type: "acceptGuidelines" }
  | {
      type: "setSelfie";
      status: SelfieVerificationStatus;
      previewUrl?: string | null;
    }
  | { type: "setInstitutionalVerification"; status: SelfieVerificationStatus }
  | { type: "setLocationPermission"; permission: LocationPermission }
  | { type: "complete" };

function toggleInList<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function reducer(state: OnboardingDraft, action: Action): OnboardingDraft {
  switch (action.type) {
    case "hydrate":
      return action.draft;
    case "patch":
      return { ...state, ...action.patch };
    case "setUserType":
      return { ...state, userType: action.userType };
    case "setIntentions":
      return { ...state, intentions: action.intentions };
    case "toggleIntention":
      return {
        ...state,
        intentions: toggleInList(state.intentions, action.intention),
      };
    case "setOtherRole":
      return { ...state, otherRole: action.otherRole };
    case "setAnimalTypes":
      return { ...state, animalTypes: action.animalTypes };
    case "toggleAnimalType": {
      const id = action.animalType;
      if (id === "any") {
        return {
          ...state,
          animalTypes: state.animalTypes.includes("any") ? [] : ["any"],
        };
      }
      const withoutAny = state.animalTypes.filter((t) => t !== "any");
      return {
        ...state,
        animalTypes: toggleInList(withoutAny, id),
      };
    }
    case "setAnimalSizes":
      return { ...state, animalSizes: action.animalSizes };
    case "toggleAnimalSize": {
      const id = action.animalSize;
      if (id === "any") {
        return {
          ...state,
          animalSizes: state.animalSizes.includes("any") ? [] : ["any"],
        };
      }
      const withoutAny = state.animalSizes.filter((t) => t !== "any");
      return {
        ...state,
        animalSizes: toggleInList(withoutAny, id),
      };
    }
    case "setAnimalFilters":
      return { ...state, animalFilters: action.animalFilters };
    case "setInterests":
      return {
        ...state,
        interestIds: action.interestIds.slice(0, MAX_INTERESTS),
      };
    case "toggleInterest": {
      const exists = state.interestIds.includes(action.interestId);
      if (exists) {
        return {
          ...state,
          interestIds: state.interestIds.filter((id) => id !== action.interestId),
        };
      }
      if (state.interestIds.length >= MAX_INTERESTS) return state;
      return {
        ...state,
        interestIds: [...state.interestIds, action.interestId],
      };
    }
    case "setAdditionalInfo":
      return {
        ...state,
        additionalInfo: {
          ...state.additionalInfo,
          [action.key]: action.entry,
        },
      };
    case "patchOrganization":
      return {
        ...state,
        organization: {
          ...createEmptyOrganization(),
          ...state.organization,
          ...action.patch,
          socialLinks: {
            ...createEmptyOrganization().socialLinks,
            ...state.organization.socialLinks,
            ...action.patch.socialLinks,
          },
        },
      };
    case "patchVeterinary":
      return {
        ...state,
        veterinary: {
          ...createEmptyVeterinary(),
          ...state.veterinary,
          ...action.patch,
        },
      };
    case "acceptGuidelines":
      return {
        ...state,
        guidelinesAcceptedAt: new Date().toISOString(),
      };
    case "setSelfie":
      return {
        ...state,
        selfieStatus: action.status,
        selfiePreviewUrl:
          action.previewUrl === undefined
            ? state.selfiePreviewUrl
            : action.previewUrl,
      };
    case "setInstitutionalVerification":
      return { ...state, institutionalVerificationStatus: action.status };
    case "setLocationPermission":
      return { ...state, locationPermission: action.permission };
    case "complete":
      return { ...state, completedAt: new Date().toISOString() };
    default:
      return state;
  }
}

type OnboardingContextValue = {
  draft: OnboardingDraft;
  ready: boolean;
  dispatch: React.Dispatch<Action>;
  patch: (patch: Partial<OnboardingDraft>) => void;
  userType: PublicUserType;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [draft, dispatch] = useReducer(reducer, undefined, () =>
    createEmptyDraft(),
  );
  const [ready, setReady] = useReducer(() => true, false);

  useEffect(() => {
    const stored = readOnboardingDraft();
    if (stored) {
      const migrated = createEmptyDraft({
        ...stored,
        userType: stored.userType
          ? normalizeUserType(stored.userType)
          : stored.userType,
      });
      dispatch({ type: "hydrate", draft: migrated });
    }
    setReady();
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeOnboardingDraft(draft);
  }, [draft, ready]);

  const patch = useCallback((p: Partial<OnboardingDraft>) => {
    dispatch({ type: "patch", patch: p });
  }, []);

  const userType = normalizeUserType(draft.userType);

  const value = useMemo(
    () => ({ draft, ready, dispatch, patch, userType }),
    [draft, ready, patch, userType],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
