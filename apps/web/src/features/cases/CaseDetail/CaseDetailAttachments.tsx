"use client";

import { useT } from "@/i18n";
import type { CaseRecord } from "../types";

type CaseDetailAttachmentsProps = {
  attachments: CaseRecord["attachments"];
};

export function CaseDetailAttachments({
  attachments,
}: CaseDetailAttachmentsProps) {
  const t = useT();
  if (attachments.length === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-sm font-bold text-ink">
        {t.cases.detail.attachments}
      </h2>
      <ul className="space-y-1 rounded-2xl border border-border-soft bg-white p-3 text-sm">
        {attachments.map((a) => (
          <li key={a.id} className="flex justify-between gap-2">
            <span className="font-semibold text-ink">{a.name}</span>
            <span className="text-xs text-ink-muted">
              {t.cases.attachmentKinds[a.kind]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
