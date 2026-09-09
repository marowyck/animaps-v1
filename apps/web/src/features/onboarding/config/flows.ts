import type { PublicUserType } from "@/features/user-types";
import type { OnboardingDraft, OnboardingStepId } from "../types";

/**
 * Per-type step sequences (guidelines is auto-prepended for every type).
 * Step ids must match the dynamic route `/onboarding/[step]`.
 */
export const ONBOARDING_FLOWS: Record<PublicUserType, OnboardingStepId[]> = {
  PERSON: [
    "intentions",
    "animal-preferences",
    "interests",
    "additional-info",
    "verification",
  ],
  ONG: [
    "organization-info",
    "location",
    "animal-types",
    "services",
    "verification",
  ],
  VETERINARY_CLINIC: [
    "clinic-info",
    "location",
    "services",
    "animals-served",
    "verification",
  ],
  OTHER: ["role-selection", "profile", "additional-info"],
};

/** Universal first step for all user types. */
export const UNIVERSAL_FIRST_STEP: OnboardingStepId = "guidelines";

export type StepCondition = (draft: OnboardingDraft) => boolean;

export type StepDefinition = {
  id: OnboardingStepId;
  required: boolean;
  skippable: boolean;
  /** When false, step is omitted from active flow / progress. */
  conditions?: StepCondition;
};

export const STEP_DEFINITIONS: Record<string, StepDefinition> = {
  guidelines: {
    id: "guidelines",
    required: true,
    skippable: false,
  },
  intentions: {
    id: "intentions",
    required: true,
    skippable: false,
  },
  intention: {
    id: "intention",
    required: true,
    skippable: false,
  },
  "animal-preferences": {
    id: "animal-preferences",
    required: false,
    skippable: true,
    conditions: (draft) => draft.intentions.includes("adopt"),
  },
  "animal-type": {
    id: "animal-type",
    required: false,
    skippable: true,
    conditions: (draft) => draft.intentions.includes("adopt"),
  },
  "animal-size": {
    id: "animal-size",
    required: false,
    skippable: true,
    conditions: (draft) => draft.intentions.includes("adopt"),
  },
  preferences: {
    id: "preferences",
    required: false,
    skippable: true,
    conditions: (draft) => draft.intentions.includes("adopt"),
  },
  interests: {
    id: "interests",
    required: false,
    skippable: true,
  },
  "additional-info": {
    id: "additional-info",
    required: false,
    skippable: true,
  },
  profile: {
    id: "profile",
    required: false,
    skippable: true,
  },
  verification: {
    id: "verification",
    required: false,
    skippable: true,
  },
  "organization-info": {
    id: "organization-info",
    required: true,
    skippable: false,
  },
  location: {
    id: "location",
    required: false,
    skippable: true,
  },
  "animal-types": {
    id: "animal-types",
    required: false,
    skippable: true,
  },
  services: {
    id: "services",
    required: false,
    skippable: true,
  },
  "clinic-info": {
    id: "clinic-info",
    required: true,
    skippable: false,
  },
  "animals-served": {
    id: "animals-served",
    required: false,
    skippable: true,
  },
  "role-selection": {
    id: "role-selection",
    required: true,
    skippable: false,
  },
};

/** Map legacy URLs to canonical step ids used in ONBOARDING_FLOWS. */
export const STEP_ALIASES: Record<string, OnboardingStepId> = {
  intention: "intentions",
};

export function canonicalStepId(raw: string): OnboardingStepId {
  return (STEP_ALIASES[raw] ?? raw) as OnboardingStepId;
}

export function buildFlowSteps(userType: PublicUserType): OnboardingStepId[] {
  return [UNIVERSAL_FIRST_STEP, ...ONBOARDING_FLOWS[userType]];
}

export function getActiveSteps(
  userType: PublicUserType,
  draft: OnboardingDraft,
): OnboardingStepId[] {
  return buildFlowSteps(userType).filter((id) => {
    const def = STEP_DEFINITIONS[id];
    if (!def) return true;
    return def.conditions ? def.conditions(draft) : true;
  });
}

export function getStepProgress(
  userType: PublicUserType,
  draft: OnboardingDraft,
  currentStep: OnboardingStepId,
): { current: number; total: number; index: number } {
  const active = getActiveSteps(userType, draft);
  const canonical = canonicalStepId(currentStep);
  let index = active.indexOf(canonical);
  if (index < 0) {
    // raw id still in active list (e.g. guidelines)
    index = active.indexOf(currentStep);
  }
  if (index < 0) index = 0;
  return {
    current: index + 1,
    total: Math.max(active.length, 1),
    index,
  };
}

export function getAdjacentSteps(
  userType: PublicUserType,
  draft: OnboardingDraft,
  currentStep: OnboardingStepId,
): { previous: OnboardingStepId | null; next: OnboardingStepId | null } {
  const active = getActiveSteps(userType, draft);
  const canonical = canonicalStepId(currentStep);
  let index = active.indexOf(canonical);
  if (index < 0) index = active.indexOf(currentStep);
  if (index < 0) {
    return { previous: null, next: active[0] ?? null };
  }
  return {
    previous: index > 0 ? active[index - 1]! : null,
    next: index < active.length - 1 ? active[index + 1]! : null,
  };
}

export function hrefForStep(step: OnboardingStepId): string {
  return `/onboarding/${step}`;
}
