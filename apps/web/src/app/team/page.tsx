"use client";

import {
  InstitutionGatedPage,
  InstitutionTeamShell,
} from "@/features/institution";

export default function TeamPage() {
  return (
    <InstitutionGatedPage>
      <InstitutionTeamShell />
    </InstitutionGatedPage>
  );
}
