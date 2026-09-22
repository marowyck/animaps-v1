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
      <h2 className="mb-2 text-sm font-bold text-ink">
        {t.cases.detail.participants}
      </h2>
      <ul className="rounded-2xl border border-border-soft bg-white p-3 text-sm">
        {participants.map((p) => (
          <li key={p.id} className="flex justify-between gap-2 py-1">
            <span>{p.userLabel ?? "—"}</span>
            <span className="text-xs font-bold text-ink-muted">
              {t.cases.roles[p.role]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
