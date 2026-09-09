"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/StateBlocks";
import { useT } from "@/i18n";
import {
  buildFlowSteps,
  canonicalStepId,
  getActiveSteps,
  hrefForStep,
} from "./config";
import { AdditionalInfoStep } from "./AdditionalInfoStep";
import { AnimalPreferencesCompositeStep } from "./AnimalPreferencesCompositeStep";
import { GuidelinesStep } from "./GuidelinesStep";
import { IntentionStep } from "./IntentionStep";
import { InterestsStep } from "./InterestsStep";
import { LocationStep } from "./LocationStep";
import { OrganizationStep } from "./OrganizationStep";
import { RoleSelectionStep } from "./RoleSelectionStep";
import { ServicesStep } from "./ServicesStep";
import { VeterinaryStep } from "./VeterinaryStep";
import { VerificationFlow } from "./components/VerificationFlow";
import { useOnboarding } from "./OnboardingProvider";
import type { OnboardingStepId } from "./types";

type OnboardingFlowProps = {
  step: string;
};

/**
 * Resolves `/onboarding/[step]` against the active user-type flow.
 * Legacy aliases (e.g. `intention` → `intentions`) are supported.
 */
export function OnboardingFlow({ step: rawStep }: OnboardingFlowProps) {
  const t = useT();
  const router = useRouter();
  const { draft, ready, userType } = useOnboarding();

  const step = canonicalStepId(rawStep) as OnboardingStepId;
  const flow = buildFlowSteps(userType);
  const active = getActiveSteps(userType, draft);
  const inFlow = flow.includes(step) || flow.includes(rawStep as OnboardingStepId);

  useEffect(() => {
    if (!ready) return;
    if (!inFlow) {
      router.replace(hrefForStep(active[0] ?? "guidelines"));
      return;
    }
    // If step is in flow but filtered out by conditions, skip forward
    if (!active.includes(step) && !active.includes(rawStep as OnboardingStepId)) {
      const idx = flow.indexOf(step);
      const nextActive = active.find((s) => flow.indexOf(s) > idx) ?? active[active.length - 1];
      if (nextActive) router.replace(hrefForStep(nextActive));
    }
  }, [ready, inFlow, step, rawStep, active, flow, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  return <OnboardingStepRenderer step={step} rawStep={rawStep} />;
}

function OnboardingStepRenderer({
  step,
  rawStep,
}: {
  step: OnboardingStepId;
  rawStep: string;
}) {
  const { userType } = useOnboarding();

  switch (step) {
    case "guidelines":
      return <GuidelinesStep />;
    case "intentions":
    case "intention":
      return <IntentionStep />;
    case "animal-preferences":
    case "animal-type":
    case "animal-size":
    case "preferences":
      return <AnimalPreferencesCompositeStep />;
    case "interests":
      return <InterestsStep />;
    case "additional-info":
      return <AdditionalInfoStep stepId="additional-info" />;
    case "profile":
      // PERSON legacy URL used profile for additional-info; OTHER uses profile as its own step
      if (userType === "OTHER" || rawStep === "profile") {
        return <AdditionalInfoStep stepId="profile" />;
      }
      return <AdditionalInfoStep stepId="additional-info" />;
    case "verification":
      return <VerificationFlow />;
    case "organization-info":
      return <OrganizationStep step="organization-info" />;
    case "animal-types":
      return <OrganizationStep step="animal-types" />;
    case "location":
      return <LocationStep />;
    case "services":
      return <ServicesStep />;
    case "clinic-info":
      return <VeterinaryStep step="clinic-info" />;
    case "animals-served":
      return <VeterinaryStep step="animals-served" />;
    case "role-selection":
      return <RoleSelectionStep />;
    default:
      return <GuidelinesStep />;
  }
}

/** Thin progress wrapper exported for docs/catalog. */
export function OnboardingProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <span className="text-xs font-bold tabular-nums text-ink-muted">
      {current}/{total}
    </span>
  );
}

export function OnboardingStep({ children }: { children: React.ReactNode }) {
  return <div className="min-h-0 flex-1">{children}</div>;
}
