"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { normalizeUserType } from "@/features/user-types";
import {
  getAdjacentSteps,
  getStepProgress,
  hrefForStep,
  STEP_DEFINITIONS,
  type StepDefinition,
} from "./config";
import { useOnboarding } from "./OnboardingProvider";
import type { OnboardingStepId } from "./types";

export type OnboardingNavigation = {
  step: OnboardingStepId;
  definition: StepDefinition | undefined;
  current: number;
  total: number;
  previousHref: string | null;
  nextHref: string | null;
  goNext: (opts?: { complete?: boolean }) => void;
  goBack: () => void;
  goSkip: () => void;
};

export function useOnboardingNavigation(
  step: OnboardingStepId,
): OnboardingNavigation {
  const router = useRouter();
  const { draft, dispatch } = useOnboarding();
  const userType = normalizeUserType(draft.userType);

  const { previous, next } = useMemo(
    () => getAdjacentSteps(userType, draft, step),
    [userType, draft, step],
  );

  const progress = useMemo(
    () => getStepProgress(userType, draft, step),
    [userType, draft, step],
  );

  const goNext = useCallback(
    (opts?: { complete?: boolean }) => {
      if (opts?.complete || !next) {
        dispatch({ type: "complete" });
        router.push("/discover");
        return;
      }
      router.push(hrefForStep(next));
    },
    [dispatch, next, router],
  );

  const goBack = useCallback(() => {
    if (previous) {
      router.push(hrefForStep(previous));
      return;
    }
    router.push("/verify-email");
  }, [previous, router]);

  const goSkip = useCallback(() => {
    goNext();
  }, [goNext]);

  return {
    step,
    definition: STEP_DEFINITIONS[step],
    current: progress.current,
    total: progress.total,
    previousHref: previous ? hrefForStep(previous) : "/verify-email",
    nextHref: next ? hrefForStep(next) : null,
    goNext,
    goBack,
    goSkip,
  };
}
