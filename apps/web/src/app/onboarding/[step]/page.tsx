"use client";

import { use } from "react";
import { OnboardingFlow } from "@/features/onboarding/OnboardingFlow";

export default function OnboardingStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = use(params);
  return <OnboardingFlow step={step} />;
}
