"use client";

import { use } from "react";
import { DashboardShell } from "@/features/dashboard";
import { CaseDetail, useCase } from "@/features/cases";
import { isInstitutionOperational } from "@/features/institution";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { LoadingState, ErrorState } from "@/components/StateBlocks";
import { Button } from "@/components/Button";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useT();
  const { ready, userType, draft } = useOnboarding();
  const record = useCase(id);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  if (!record) {
    return (
      <DashboardShell displayName={draft.displayName}>
        <ErrorState
          title={t.cases.errors.notFound}
          action={
            <Button href="/cases" variant="pink" size="sm">
              {t.cases.detail.back}
            </Button>
          }
        />
      </DashboardShell>
    );
  }

  const mode = userType === "INSTITUTION" ? "institution" : "citizen";
  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );

  return (
    <DashboardShell displayName={draft.displayName}>
      <CaseDetail
        record={record}
        mode={mode}
        verifiedInstitution={verified}
      />
    </DashboardShell>
  );
}
