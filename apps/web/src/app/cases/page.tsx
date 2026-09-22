"use client";

import { DashboardShell } from "@/features/dashboard";
import { CasesHome } from "@/features/cases";
import { InstitutionCasesInbox, isInstitutionOperational } from "@/features/institution";
import { useCasesStore } from "@/features/cases";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { LoadingState } from "@/components/StateBlocks";

export default function CasesPage() {
  const t = useT();
  const { ready, userType, draft } = useOnboarding();
  const { cases } = useCasesStore();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <LoadingState title={t.common.loading} />
      </div>
    );
  }

  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );

  return (
    <DashboardShell displayName={draft.displayName}>
      {userType === "INSTITUTION" ? (
        <InstitutionCasesInbox cases={cases} verified={verified} />
      ) : (
        <CasesHome
          userType={userType}
          email={draft.email}
          institutionVerified={verified}
        />
      )}
    </DashboardShell>
  );
}
