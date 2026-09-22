"use client";

import {
  InstitutionGatedPage,
  InstitutionProfile,
} from "@/features/institution";

export default function InstitutionPage() {
  return (
    <InstitutionGatedPage>
      <InstitutionProfile mode="profile" />
    </InstitutionGatedPage>
  );
}
