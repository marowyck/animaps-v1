"use client";

import { useT } from "@/i18n";
import { VeterinaryForm } from "./components/VeterinaryForm";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";
import type { OnboardingStepId } from "./types";

const MODE_BY_STEP = {
  "clinic-info": "info",
  location: "location",
  services: "services",
  "animals-served": "animals-served",
} as const;

type ClinicStepId = keyof typeof MODE_BY_STEP;

export function VeterinaryStep({ step }: { step: ClinicStepId }) {
  const t = useT();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation(step as OnboardingStepId);
  const titles = t.onboarding.clinic.titles;

  const titleMap = {
    "clinic-info": titles.infoTitle,
    location: titles.locationTitle,
    services: titles.servicesTitle,
    "animals-served": titles.animalsTitle,
  } as const;

  const subtitleMap = {
    "clinic-info": titles.infoSubtitle,
    location: titles.locationSubtitle,
    services: titles.servicesSubtitle,
    "animals-served": titles.animalsSubtitle,
  } as const;

  const required = step === "clinic-info";
  const canContinue =
    !required || draft.veterinary.tradeName.trim().length > 0;

  return (
    <OnboardingLayout
      step={step}
      title={titleMap[step]}
      subtitle={subtitleMap[step]}
      onContinue={() => nav.goNext()}
      continueDisabled={!canContinue}
      showSkip={!required}
      onSkip={!required ? () => nav.goSkip() : undefined}
    >
      <VeterinaryForm
        mode={MODE_BY_STEP[step]}
        value={draft.veterinary}
        onChange={(patch) => dispatch({ type: "patchVeterinary", patch })}
      />
    </OnboardingLayout>
  );
}
