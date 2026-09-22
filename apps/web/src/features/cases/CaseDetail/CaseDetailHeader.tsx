"use client";

import { Button } from "@/components/Button";
import { PawDoodle } from "@/components/illustrations/Doodles";
import { useT } from "@/i18n";
import type { CaseRecord } from "../types";

type CaseDetailHeaderProps = {
  record: CaseRecord;
};

export function CaseDetailHeader({ record }: CaseDetailHeaderProps) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-end gap-3">
        <PawDoodle className="mb-1 hidden size-12 shrink-0 -rotate-12 text-primary sm:block" />
        <div>
          <p className="text-label inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-(--pink-700)">
            {record.referenceNumber}
          </p>
          <h1 className="text-h1 mt-2 text-text">
            {record.title && record.title !== record.caseTypeId
              ? record.title
              : t.cases.types[record.caseTypeId].title}
          </h1>
          <p className="mt-2 text-body-sm text-text-secondary">
            {t.cases.types[record.caseTypeId].title}
          </p>
        </div>
      </div>
      <Button href="/cases" variant="ghost" size="sm">
        {t.cases.detail.back}
      </Button>
    </div>
  );
}
