"use client";

import { SoftGateBanner } from "@/features/institution/SoftGateBanner";
import { CaseList } from "./CaseList";
import { useCasesStore, useMyCases } from "./useCases";
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
  const { cases } = useCasesStore();
  const mine = useMyCases(email);

  if (userType === "INSTITUTION") {
    return (
      <div className="space-y-4">
        {!institutionVerified ? <SoftGateBanner /> : null}
        <CaseList cases={cases} mode="institution" canCreate />
      </div>
    );
  }

  return <CaseList cases={mine} mode="citizen" canCreate />;
}
