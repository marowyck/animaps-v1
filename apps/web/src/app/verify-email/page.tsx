"use client";

import { Suspense } from "react";
import { AuthSplitLayout, VerifyEmailForm } from "@/features/auth";
import { CookieBanner } from "@/features/consent";
import { LoadingState } from "@/components/StateBlocks";
import { useT } from "@/i18n";

function VerifyEmailFallback() {
  const t = useT();
  return <LoadingState title={t.common.loading} />;
}

export default function VerifyEmailPage() {
  return (
    <>
      <AuthSplitLayout>
        <Suspense fallback={<VerifyEmailFallback />}>
          <VerifyEmailForm />
        </Suspense>
      </AuthSplitLayout>
      <CookieBanner />
    </>
  );
}
