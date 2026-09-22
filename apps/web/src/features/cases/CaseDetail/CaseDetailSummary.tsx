"use client";

import { Card } from "@/components/Card";
import { useT } from "@/i18n";
import type { CaseRecord } from "../types";
import { StatusPill } from "./CaseDetailTimeline";

type CaseDetailSummaryProps = {
  record: CaseRecord;
  mode: "citizen" | "institution";
};

export function CaseDetailSummary({ record, mode }: CaseDetailSummaryProps) {
  const t = useT();
  return (
    <Card className="space-y-3 p-4">
      <div className="flex flex-wrap gap-2">
        <StatusPill label={t.cases.detail.citizenStatus}>
          {t.cases.citizenStatus[record.citizenStatus]}
        </StatusPill>
        {mode === "institution" ? (
          <StatusPill label={t.cases.detail.internalStatus}>
            {t.cases.internalStatus[record.status]}
          </StatusPill>
        ) : null}
        <StatusPill label={t.cases.detail.priority}>
          {t.cases.priority[record.priority]}
        </StatusPill>
      </div>
      <p className="text-sm leading-relaxed text-ink">{record.description}</p>
      <p className="text-xs font-semibold text-ink-muted">
        {[record.location.neighborhood, record.location.city, record.location.state]
          .filter(Boolean)
          .join(" · ") || t.cases.detail.noLocation}
        {" · "}
        {t.cases.precision[record.location.precision]}
      </p>
      <p className="text-xs text-ink-muted">{t.cases.detail.honesty}</p>
    </Card>
  );
}
