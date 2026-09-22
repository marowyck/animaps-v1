"use client";

import { DashboardShell } from "@/features/dashboard";
import { SavedList } from "@/features/discover/SavedList";
import { useOnboarding } from "@/features/onboarding";

export default function MatchesPage() {
  const { draft } = useOnboarding();
  return (
    <DashboardShell displayName={draft.displayName}>
      <SavedList kind="matches" />
    </DashboardShell>
  );
}
