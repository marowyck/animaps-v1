"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/features/dashboard";
import { CaseCreateForm } from "@/features/cases";
import {
  SoftGateBanner,
  isInstitutionOperational,
} from "@/features/institution";
import { useOnboarding } from "@/features/onboarding";
import { hasPermission } from "@/features/permissions";
import { useT } from "@/i18n";
import { LoadingState, ErrorState } from "@/components/StateBlocks";
import { Button } from "@/components/Button";

export default function NewCasePage() {
  const t = useT();
  const router = useRouter();
  const { ready, userType, draft } = useOnboarding();
  const allowed = hasPermission(userType, "REPORT");
  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const institutionBlocked = userType === "INSTITUTION" && !verified;

  useEffect(() => {
    if (ready && !allowed) {
      router.replace("/cases");
    }
  }, [ready, allowed, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <ErrorState
          title={t.cases.errors.forbidden}
          action={
            <Button href="/cases" variant="pink" size="sm">
              {t.cases.detail.back}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <DashboardShell displayName={draft.displayName}>
      {institutionBlocked ? (
        <div className="mx-auto max-w-lg space-y-4">
          <SoftGateBanner variant="panel" />
          <Button href="/cases" variant="ghost" size="sm">
            {t.cases.detail.back}
          </Button>
        </div>
      ) : (
        <CaseCreateForm userType={userType} reporterEmail={draft.email} />
      )}
    </DashboardShell>
  );
}
