"use client";

import { DashboardShell } from "@/features/dashboard";
import { CaseClaimForm } from "@/features/cases";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { LoadingState } from "@/components/StateBlocks";

export default function ClaimCasePage() {
  const t = useT();
  const { ready, draft } = useOnboarding();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  return (
    <DashboardShell displayName={draft.displayName}>
      <CaseClaimForm defaultEmail={draft.email} />
    </DashboardShell>
  );
}
