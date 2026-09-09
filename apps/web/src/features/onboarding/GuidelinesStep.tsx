"use client";

import { Check } from "lucide-react";
import { Card } from "@/components/Card";
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
      <Card className="mx-auto w-full max-w-xl space-y-3">
        <ul className="space-y-3">
          {RULE_KEYS.map((key) => (
            <li key={key} className="flex items-start gap-3 text-sm text-ink">
              <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pastel-green text-brand-green">
                <Check className="size-3.5" aria-hidden />
              </span>
              <span className="font-semibold leading-snug">
                {t.onboarding.guidelines.rules[key]}
              </span>
            </li>
          ))}
        </ul>
        <p className="pt-2 text-xs leading-relaxed text-ink-muted">
          {t.onboarding.guidelines.legalBefore}{" "}
          <a href="#" className="font-bold text-brand-pink underline-offset-2 hover:underline">
            {t.onboarding.guidelines.terms}
          </a>
          ,{" "}
          <a href="#" className="font-bold text-brand-pink underline-offset-2 hover:underline">
            {t.onboarding.guidelines.privacy}
          </a>{" "}
          {t.onboarding.guidelines.legalAnd}{" "}
          <a href="#" className="font-bold text-brand-pink underline-offset-2 hover:underline">
            {t.onboarding.guidelines.community}
          </a>
          .
        </p>
      </Card>
    </OnboardingLayout>
  );
}
