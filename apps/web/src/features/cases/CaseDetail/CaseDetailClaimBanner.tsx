"use client";

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
    <div className="rounded-[1.6rem] bg-primary-soft px-5 py-4">
      <p className="text-body-sm font-semibold text-(--pink-700)">{t.cases.claim.saveToken}</p>
      <p className="mt-1 font-display text-2xl tracking-wide text-text">
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
    </div>
  );
}
