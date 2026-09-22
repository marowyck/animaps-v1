"use client";

import {
  InstitutionAnalyticsShell,
  InstitutionGatedPage,
} from "@/features/institution";

export default function AnalyticsPage() {
  return (
    <InstitutionGatedPage>
      <InstitutionAnalyticsShell />
    </InstitutionGatedPage>
  );
}
