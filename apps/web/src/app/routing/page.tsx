"use client";

import {
  InstitutionGatedPage,
  InstitutionRoutingShell,
} from "@/features/institution";

export default function RoutingPage() {
  return (
    <InstitutionGatedPage>
      <InstitutionRoutingShell />
    </InstitutionGatedPage>
  );
}
