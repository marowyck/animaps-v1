"use client";

import { DashboardShell } from "@/features/dashboard";
import { InstitutionProfile } from "@/features/institution";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { LoadingState } from "@/components/StateBlocks";
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
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          <header>
            <h1 className="text-h1 text-text">
              {t.institution.settings.genericTitle}
            </h1>
            <p className="mt-2 max-w-md text-body-sm text-text-secondary">
              {t.institution.settings.genericBody}
            </p>
          </header>
          <p className="text-body text-text">
            {draft.email ?? t.profilePage.emptyIntentions}
          </p>
          <Button href="/profile" variant="primary" size="sm">
            {t.dashboard.nav.profile}
          </Button>
        </div>
      )}
    </DashboardShell>
  );
}
