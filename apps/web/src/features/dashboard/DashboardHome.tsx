"use client";

import { useOnboarding } from "@/features/onboarding";
import { DynamicDashboard } from "./DynamicDashboard";

type DashboardHomeProps = {
  displayName?: string | null;
};

export function DashboardHome({ displayName }: DashboardHomeProps) {
  const { userType, draft } = useOnboarding();
  return (
    <DynamicDashboard
      userType={userType}
      displayName={displayName ?? draft.displayName}
    />
  );
}
