"use client";

import { CaseList } from "./CaseList";
import { useCasesStore, useMyCases } from "./useCases";
import { useT } from "@/i18n";
import type { PublicUserType } from "@/features/user-types";

type CasesHomeProps = {
  userType: PublicUserType;
  email: string | null;
  institutionVerified: boolean;
};

export function CasesHome({
  userType,
  email,
  institutionVerified,
}: CasesHomeProps) {
  const t = useT();
  const { cases } = useCasesStore();
  const mine = useMyCases(email);

  if (userType === "INSTITUTION") {
    return (
      <div className="space-y-4">
        {!institutionVerified ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-ink">
            {t.cases.institution.softGate}
          </p>
        ) : null}
        <CaseList cases={cases} mode="institution" canCreate />
      </div>
    );
  }

  return <CaseList cases={mine} mode="citizen" canCreate />;
}
