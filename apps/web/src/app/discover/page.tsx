"use client";

import { DashboardShell } from "@/features/dashboard";
import { DiscoverStack } from "@/features/discover";
import { useOnboarding } from "@/features/onboarding";

export default function DiscoverPage() {
  const { draft } = useOnboarding();
  const name = draft.displayName || draft.email?.split("@")[0] || null;

  return (
    <DashboardShell displayName={name}>
      <DiscoverStack />
    </DashboardShell>
  );
}
