"use client";

import {
  InstitutionGatedPage,
  InstitutionMapShell,
} from "@/features/institution";

export default function MapPage() {
  return (
    <InstitutionGatedPage>
      <InstitutionMapShell />
    </InstitutionGatedPage>
  );
}
