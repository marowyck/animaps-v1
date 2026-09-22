"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { ErrorState, LoadingState } from "@/components/StateBlocks";
import { DashboardShell } from "@/features/dashboard";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";

/** Redirects non-institution sessions to `/dashboard` once onboarding is ready. */
export function useInstitutionGuard() {
  const t = useT();
  const router = useRouter();
  const { ready, userType, draft } = useOnboarding();
  const allowed = userType === "INSTITUTION";

  useEffect(() => {
    if (ready && !allowed) {
      router.replace("/dashboard");
    }
  }, [ready, allowed, router]);

  return { ready, allowed, draft, t };
}

/** Shared loading / forbidden / shell gate for institution-only routes. */
export function InstitutionGatedPage({ children }: { children: ReactNode }) {
  const { ready, allowed, draft, t } = useInstitutionGuard();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <ErrorState
          title={t.institution.errors.institutionOnly}
          action={
            <Button href="/dashboard" variant="pink" size="sm">
              {t.cases.detail.back}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <DashboardShell displayName={draft.displayName}>{children}</DashboardShell>
  );
}
