"use client";

import { useT } from "@/i18n";
import { ProfileForm } from "./components/ProfileForm";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";
import type { OnboardingStepId } from "./types";

export function AdditionalInfoStep({
  stepId = "additional-info",
}: {
  stepId?: OnboardingStepId;
}) {
  const t = useT();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation(stepId);

  return (
    <OnboardingLayout
      step={stepId}
      title={t.onboarding.profile.title}
      subtitle={t.onboarding.profile.subtitle}
      onContinue={() => nav.goNext({ complete: !nav.nextHref })}
      showSkip
      onSkip={() => nav.goSkip()}
    >
      <ProfileForm
        values={draft.additionalInfo}
        onSave={(key, entry) =>
          dispatch({ type: "setAdditionalInfo", key, entry })
        }
      />
    </OnboardingLayout>
  );
}
