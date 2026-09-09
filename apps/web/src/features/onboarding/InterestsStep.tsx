"use client";

import { useT } from "@/i18n";
import { InterestSelector } from "./components/InterestSelector";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export function InterestsStep() {
  const t = useT();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("interests");

  const saveLabel = t.onboarding.interests.save.replace(
    "{count}",
    String(draft.interestIds.length),
  );

  return (
    <OnboardingLayout
      step="interests"
      title={t.onboarding.interests.title}
      subtitle={t.onboarding.interests.subtitle}
      showSkip
      onSkip={() => nav.goSkip()}
      compact
      footerAlign="center"
      onContinue={() => nav.goNext()}
      continueLabel={saveLabel}
    >
      <InterestSelector
        selectedIds={draft.interestIds}
        onToggle={(id) => dispatch({ type: "toggleInterest", interestId: id })}
      />
    </OnboardingLayout>
  );
}
