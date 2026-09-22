"use client";

import { LoadingState } from "@/components/StateBlocks";
import { DashboardShell } from "@/features/dashboard";
import { useOnboarding } from "@/features/onboarding";
import { AccountProfile } from "@/features/profile";
import { useT } from "@/i18n";

export default function ProfilePage() {
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
      <AccountProfile />
    </DashboardShell>
  );
}
