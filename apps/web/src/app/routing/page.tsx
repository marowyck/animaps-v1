"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/features/dashboard";
import { InstitutionRoutingShell } from "@/features/institution";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { LoadingState, ErrorState } from "@/components/StateBlocks";
import { Button } from "@/components/Button";

export default function RoutingPage() {
  const t = useT();
  const router = useRouter();
  const { ready, userType, draft } = useOnboarding();

  useEffect(() => {
    if (ready && userType !== "INSTITUTION") {
      router.replace("/dashboard");
    }
  }, [ready, userType, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  if (userType !== "INSTITUTION") {
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
    <DashboardShell displayName={draft.displayName}>
      <InstitutionRoutingShell />
    </DashboardShell>
  );
}
