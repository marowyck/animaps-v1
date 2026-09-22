"use client";

import { Check } from "lucide-react";
import { PawDoodle } from "@/components/illustrations/Doodles";
import { useT } from "@/i18n";
import { OnboardingLayout } from "./OnboardingLayout";
import { useOnboarding } from "./OnboardingProvider";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

const RULE_KEYS = [
  "truthful",
  "respectPeople",
  "respectAnimals",
  "noFalseInfo",
  "noIllegal",
  "reportBad",
  "responsibleAdoption",
] as const;

export function GuidelinesStep() {
  const t = useT();
  const { dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("guidelines");

  const accept = () => {
    dispatch({ type: "acceptGuidelines" });
    nav.goNext();
  };

  return (
    <OnboardingLayout
      step="guidelines"
      title={t.onboarding.guidelines.title}
      subtitle={t.onboarding.guidelines.intro}
      backHref="/verify-email"
      onContinue={accept}
      continueLabel={t.onboarding.guidelines.accept}
      footerAlign="center"
    >
      <div className="mx-auto w-full max-w-xl">
        <ul className="space-y-3">
          {RULE_KEYS.map((key) => (
            <li key={key} className="flex items-start gap-3 text-body-sm text-text">
              <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-(--mint-700)">
                <Check className="size-3.5" aria-hidden />
              </span>
              <span className="font-semibold leading-snug">
                {t.onboarding.guidelines.rules[key]}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-start gap-3 text-body-sm leading-relaxed text-text-secondary">
          <PawDoodle className="mt-0.5 size-6 shrink-0 text-primary" />
          <span>
            {t.onboarding.guidelines.legalBefore}{" "}
            <a href="#" className="font-semibold text-(--pink-700) underline-offset-2 hover:underline">
              {t.onboarding.guidelines.terms}
            </a>
            ,{" "}
            <a href="#" className="font-semibold text-(--pink-700) underline-offset-2 hover:underline">
              {t.onboarding.guidelines.privacy}
            </a>{" "}
            {t.onboarding.guidelines.legalAnd}{" "}
            <a href="#" className="font-semibold text-(--pink-700) underline-offset-2 hover:underline">
              {t.onboarding.guidelines.community}
            </a>
            .
          </span>
        </p>
      </div>
    </OnboardingLayout>
  );
}
