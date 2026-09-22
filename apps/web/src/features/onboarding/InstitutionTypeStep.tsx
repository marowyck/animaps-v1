"use client";

import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import type { InstitutionTypeId } from "@/features/account-types";
import { InstitutionTypeSelector } from "./components/InstitutionTypeSelector";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export function InstitutionTypeStep() {
  const t = useT();
  const { toast } = useToast();
  const { draft, patch } = useOnboarding();
  const nav = useOnboardingNavigation("institution-type");

  const continueNext = () => {
    if (!draft.institutionTypeId) {
      toast({
        message: t.onboarding.institutionType.needOne,
        tone: "warning",
      });
      return;
    }
    nav.goNext();
  };

  return (
    <OnboardingLayout
      step="institution-type"
      title={t.onboarding.institutionType.title}
      subtitle={t.onboarding.institutionType.subtitle}
      onContinue={continueNext}
      continueDisabled={!draft.institutionTypeId}
      compact
    >
      <InstitutionTypeSelector
        compact
        value={draft.institutionTypeId}
        onChange={(institutionTypeId: InstitutionTypeId) => {
          patch({
            institutionTypeId,
            accountType: "INSTITUTION",
            userType: "INSTITUTION",
          });
        }}
      />
    </OnboardingLayout>
  );
}
