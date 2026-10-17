"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { PawDoodle } from "@/components/illustrations/Doodles";
import { useOnboarding } from "@/features/onboarding";
import { usePageEnter } from "@/hooks/usePageEnter";
import { labelUserType, useT } from "@/i18n";
import { RoleBasedNavigation } from "./RoleBasedNavigation";
import { MobileNav } from "./MobileNav";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

type DashboardShellProps = {
  children: ReactNode;
  displayName?: string | null;
};

export function DashboardShell({ children, displayName }: DashboardShellProps) {
  const t = useT();
  const { userType, draft } = useOnboarding();
  const name = displayName ?? draft.displayName;
  const pathname = usePathname();
  const contentRef = usePageEnter(pathname);

  return (
    <div
      data-lenis-prevent
      className="flex h-dvh max-h-dvh overflow-hidden bg-background"
    >
      <RoleBasedNavigation userType={userType} displayName={name} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border-subtle bg-surface/85 px-4 py-2.5 backdrop-blur-md sm:px-6 lg:hidden">
          <Link
            href="/dashboard"
            className="inline-flex min-w-0 items-center gap-2 text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-surface-elevated">
              <PawDoodle className="size-5" />
            </span>
            <span className="font-display truncate text-lg tracking-tight">ANIMAPS</span>
            <span className="hidden rounded-full bg-primary-soft px-2.5 py-0.5 text-caption font-semibold text-primary-ink sm:inline-block">
              {labelUserType(t, userType)}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher tone="light" variant="menu" />
            <Link
              href="/"
              aria-label={t.dashboard.exit}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-danger-soft px-3 py-1.5 text-caption font-semibold text-danger-ink transition-colors hover:bg-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <LogOut className="size-3.5" aria-hidden />
              <span>{t.dashboard.exit}</span>
            </Link>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-6 pb-24 sm:px-8 lg:py-8">
          <div ref={contentRef}>{children}</div>
        </main>
        <MobileNav userType={userType} />
      </div>
    </div>
  );
}
