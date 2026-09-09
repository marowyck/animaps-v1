"use client";

import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth";
import { CookieBanner } from "@/features/consent";
import { LoadingState } from "@/components/StateBlocks";
import { useT } from "@/i18n";

function VerifyEmailFallback() {
  const t = useT();
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <LoadingState title={t.common.loading} />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailForm />
      </Suspense>
      <CookieBanner />
    </>
  );
}
