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
      <h2 className="text-h4 mb-3 text-text">{t.cases.detail.attachments}</h2>
      <ul className="space-y-2">
        {attachments.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3">
            <span className="h-8 w-1.5 shrink-0 rounded-full bg-honey-600" aria-hidden />
            <span className="min-w-0 flex-1 text-body-sm font-semibold text-text">{a.name}</span>
            <span className="text-caption text-text-muted">
              {t.cases.attachmentKinds[a.kind]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
