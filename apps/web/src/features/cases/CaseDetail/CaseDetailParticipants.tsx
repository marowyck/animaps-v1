"use client";

import { useT } from "@/i18n";
import type { CaseRecord } from "../types";

type CaseDetailParticipantsProps = {
  participants: CaseRecord["participants"];
};

export function CaseDetailParticipants({
  participants,
}: CaseDetailParticipantsProps) {
  const t = useT();
  if (participants.length === 0) return null;
  return (
    <section>
      <h2 className="text-h4 mb-3 text-text">{t.cases.detail.participants}</h2>
      <ul className="space-y-2">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3">
            <span className="h-8 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
            <span className="min-w-0 flex-1 text-body-sm text-text">{p.userLabel ?? "—"}</span>
            <span className="text-caption font-semibold text-(--lilac-700)">
              {t.cases.roles[p.role]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
