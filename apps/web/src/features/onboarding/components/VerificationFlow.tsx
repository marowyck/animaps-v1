"use client";

import { FileCheck2 } from "lucide-react";
import {
  VerificationStatusBadge,
  type VerificationStatus,
} from "@/components/VerificationStatusBadge";
import { useT } from "@/i18n";
import { OnboardingLayout } from "../OnboardingLayout";
import { useOnboarding } from "../OnboardingProvider";
import { useOnboardingNavigation } from "../useOnboardingNavigation";
import { SelfieVerification } from "./SelfieVerification";

type VerificationFlowProps = {
  mode?: "selfie" | "institutional";
};

export function VerificationFlow({ mode }: VerificationFlowProps) {
  const { userType } = useOnboarding();
  const resolvedMode =
    mode === "institutional" ||
    userType === "ONG" ||
    userType === "VETERINARY_CLINIC" ||
    userType === "INSTITUTION"
      ? "institutional"
      : "selfie";

  if (resolvedMode === "institutional") {
    return <InstitutionalVerification />;
  }

  return <SelfieVerification />;
}

function InstitutionalVerification() {
  const t = useT();
  const { draft, dispatch } = useOnboarding();
  const nav = useOnboardingNavigation("verification");
  const status = draft.institutionalVerificationStatus;
  const copy = t.onboarding.verification.institutional;

  const submit = () => {
    dispatch({
      type: "setInstitutionalVerification",
      status: "processing",
    });
    window.setTimeout(() => {
      dispatch({
        type: "setInstitutionalVerification",
        status: "pending",
      });
      nav.goNext({ complete: true });
    }, 800);
  };

  return (
    <OnboardingLayout
      step="verification"
      title={copy.title}
      subtitle={copy.subtitle}
      onContinue={submit}
      continueLabel={copy.submitLabel}
      showSkip
      onSkip={() => nav.goNext({ complete: true })}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-4 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-success-soft text-(--mint-700)">
          <FileCheck2 className="size-7" aria-hidden />
        </span>
        <VerificationStatusBadge
          status={status as VerificationStatus}
          label={t.onboarding.verification.status[status as VerificationStatus]}
        />
        <p className="text-body-sm text-text-secondary">{copy.pendingBody}</p>
      </div>
    </OnboardingLayout>
  );
}
