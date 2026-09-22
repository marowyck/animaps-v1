"use client";

import { Card } from "@/components/Card";
import { useT } from "@/i18n";

type CaseDetailClaimBannerProps = {
  caseId: string;
  token: string;
  onDismiss: () => void;
};

export function CaseDetailClaimBanner({
  caseId,
  token,
  onDismiss,
}: CaseDetailClaimBannerProps) {
  const t = useT();
  return (
    <Card className="border-brand-pink/40 bg-pastel-pink/30 p-4">
      <p className="text-sm font-bold text-ink">{t.cases.claim.saveToken}</p>
      <p className="mt-1 font-mono text-lg font-bold tracking-wide text-ink">
        {token}
      </p>
      <button
        type="button"
        className="mt-2 text-xs font-bold underline"
        onClick={() => {
          onDismiss();
          try {
            sessionStorage.removeItem(`animaps-claim-${caseId}`);
          } catch {
            /* ignore */
          }
        }}
      >
        {t.cases.claim.dismissToken}
      </button>
    </Card>
  );
}
