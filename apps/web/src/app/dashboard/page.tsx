"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/StateBlocks";
import { useT } from "@/i18n";
import { useOnboarding } from "@/features/onboarding";
import { DashboardShell, DynamicDashboard } from "@/features/dashboard";

/**
 * PERSON home is Discover; ONG / clinic / other land on type-specific dashboard.
 */
export default function DashboardPage() {
  const router = useRouter();
  const t = useT();
  const { ready, userType, draft } = useOnboarding();

  useEffect(() => {
    if (!ready) return;
    if (userType === "PERSON") {
      router.replace("/discover");
    }
  }, [ready, userType, router]);

  if (!ready || userType === "PERSON") {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  return (
    <DashboardShell displayName={draft.displayName}>
      <DynamicDashboard userType={userType} displayName={draft.displayName} />
    </DashboardShell>
  );
}
