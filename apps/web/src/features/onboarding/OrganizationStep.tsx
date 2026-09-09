"use client";

import { useT } from "@/i18n";
import { OrganizationForm } from "./components/OrganizationForm";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";
import type { OnboardingStepId } from "./types";

const MODE_BY_STEP = {
  "organization-info": "info",
  location: "location",
  "animal-types": "animal-types",
  services: "services",
} as const;

type OrgStepId = keyof typeof MODE_BY_STEP;

export function OrganizationStep({ step }: { step: OrgStepId }) {
  const t = useT();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation(step as OnboardingStepId);
  const titles = t.onboarding.organization.titles;

  const titleMap = {
    "organization-info": titles.infoTitle,
    location: titles.locationTitle,
    "animal-types": titles.animalTypesTitle,
    services: titles.servicesTitle,
  } as const;

  const subtitleMap = {
    "organization-info": titles.infoSubtitle,
    location: titles.locationSubtitle,
    "animal-types": titles.animalTypesSubtitle,
    services: titles.servicesSubtitle,
  } as const;

  const required = step === "organization-info";
  const canContinue =
    !required || draft.organization.tradeName.trim().length > 0;

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
      <OrganizationForm
        mode={MODE_BY_STEP[step]}
        value={draft.organization}
        onChange={(patch) => dispatch({ type: "patchOrganization", patch })}
      />
    </OnboardingLayout>
  );
}
