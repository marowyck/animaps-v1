"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getAdjacentSteps,
  getStepProgress,
  homeHrefForFlow,
  hrefForStep,
  resolveFlowKey,
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
  const { draft, dispatch, flowKey } = useOnboarding();
  const userType = resolveFlowKey(draft) || flowKey;

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
        router.push(homeHrefForFlow(userType));
        return;
      }
      router.push(hrefForStep(next));
    },
    [dispatch, next, router, userType],
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
