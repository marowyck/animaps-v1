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
    <div className="flex min-h-dvh bg-gray-soft">
      <RoleBasedNavigation userType={userType} displayName={name} />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-visible">
        <main className="flex min-h-0 flex-1 flex-col overflow-x-visible px-4 py-4 pb-24 sm:px-6 lg:px-8 lg:pb-6 animate-fade-in-up">
          {children}
        </main>
        <MobileNav userType={userType} />
      </div>
    </div>
  );
}
