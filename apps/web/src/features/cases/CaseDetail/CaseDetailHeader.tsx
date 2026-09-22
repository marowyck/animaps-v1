"use client";

import { Button } from "@/components/Button";
import { useT } from "@/i18n";
import type { CaseRecord } from "../types";

type CaseDetailHeaderProps = {
  record: CaseRecord;
};

export function CaseDetailHeader({ record }: CaseDetailHeaderProps) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
          {record.referenceNumber}
        </p>
        <h1 className="font-display text-3xl text-ink">
          {record.title && record.title !== record.caseTypeId
            ? record.title
            : t.cases.types[record.caseTypeId].title}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {t.cases.types[record.caseTypeId].title}
        </p>
      </div>
      <Button href="/cases" variant="ghost" size="sm">
        {t.cases.detail.back}
      </Button>
    </div>
  );
}
