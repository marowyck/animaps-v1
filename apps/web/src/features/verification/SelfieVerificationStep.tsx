"use client";

import { VerificationFlow } from "@/features/onboarding/components/VerificationFlow";

/** @deprecated Prefer VerificationFlow — kept for feature export compatibility. */
export function SelfieVerificationStep() {
  return <VerificationFlow mode="selfie" />;
}
