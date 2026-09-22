"use client";

import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import type { OrganizationType } from "@/features/account-types";
import { OrganizationTypeSelector } from "./components/OrganizationTypeSelector";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export function OrganizationTypeStep() {
  const t = useT();
  const { toast } = useToast();
  const { draft, patch } = useOnboarding();
  const nav = useOnboardingNavigation("organization-type");

  const continueNext = () => {
    if (!draft.organizationType) {
      toast({
        message: t.onboarding.organizationType.needOne,
        tone: "warning",
      });
      return;
    }
    // Align Wave 2 userType with clinic vs NGO flows
    if (
      draft.organizationType === "VETERINARY_CLINIC" ||
      draft.organizationType === "VETERINARY_HOSPITAL"
    ) {
      patch({ userType: "VETERINARY_CLINIC" });
    } else {
      patch({ userType: "ONG" });
    }
    nav.goNext();
  };

  return (
    <OnboardingLayout
      step="organization-type"
      title={t.onboarding.organizationType.title}
      subtitle={t.onboarding.organizationType.subtitle}
      onContinue={continueNext}
      continueDisabled={!draft.organizationType}
      compact
    >
      <OrganizationTypeSelector
        compact
        value={draft.organizationType}
        onChange={(organizationType: OrganizationType) => {
          patch({
            organizationType,
            accountType: "ORGANIZATION",
            userType:
              organizationType === "VETERINARY_CLINIC" ||
              organizationType === "VETERINARY_HOSPITAL"
                ? "VETERINARY_CLINIC"
                : "ONG",
          });
        }}
      />
    </OnboardingLayout>
  );
}
