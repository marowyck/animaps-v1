"use client";

import { DashboardShell } from "@/features/dashboard";
import { InstitutionProfile } from "@/features/institution";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { LoadingState, EmptyState } from "@/components/StateBlocks";
import { Button } from "@/components/Button";

export default function SettingsPage() {
  const t = useT();
  const { ready, userType, draft } = useOnboarding();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  return (
    <DashboardShell displayName={draft.displayName}>
      {userType === "INSTITUTION" ? (
        <InstitutionProfile mode="settings" />
      ) : (
        <EmptyState
          title={t.institution.settings.genericTitle}
          description={t.institution.settings.genericBody}
          action={
            <Button href="/dashboard" variant="pink" size="sm">
              {t.cases.detail.back}
            </Button>
          }
        />
      )}
    </DashboardShell>
  );
}
