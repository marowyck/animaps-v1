"use client";

import type { ReactNode } from "react";
import { useOnboarding } from "@/features/onboarding";
import { RoleBasedNavigation } from "./RoleBasedNavigation";
import { MobileNav } from "./MobileNav";

type DashboardShellProps = {
  children: ReactNode;
  displayName?: string | null;
};

export function DashboardShell({ children, displayName }: DashboardShellProps) {
  const { userType, draft } = useOnboarding();
  const name = displayName ?? draft.displayName;

  return (
    <div
      data-lenis-prevent
      className="flex h-dvh max-h-dvh overflow-hidden bg-gray-soft"
    >
      <RoleBasedNavigation userType={userType} displayName={name} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4 pb-24 sm:px-6 lg:px-8 lg:pb-6">
          <div className="animate-fade-in-up">{children}</div>
        </main>
        <MobileNav userType={userType} />
      </div>
    </div>
  );
}
