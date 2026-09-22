"use client";

import {
  InstitutionGatedPage,
  InstitutionIntegrationsShell,
} from "@/features/institution";

export default function IntegrationsPage() {
  return (
    <InstitutionGatedPage>
      <InstitutionIntegrationsShell />
    </InstitutionGatedPage>
  );
}
