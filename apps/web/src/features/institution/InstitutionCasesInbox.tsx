"use client";

import { useMemo, useState } from "react";
import { CaseList } from "@/features/cases";
import type { CasePriority, CaseRecord, CaseStatus } from "@/features/cases";
import { useT } from "@/i18n";
import { SoftGateBanner } from "./SoftGateBanner";
import { WorkspaceHeader } from "./WorkspaceHeader";

type InstitutionCasesInboxProps = {
  cases: CaseRecord[];
  verified: boolean;
};

type PriorityFilter = "all" | CasePriority;
type StatusFilter = "all" | CaseStatus;

export function InstitutionCasesInbox({
  cases,
  verified,
}: InstitutionCasesInboxProps) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      if (priority !== "all" && c.priority !== priority) return false;
      if (status !== "all" && c.status !== status) return false;
      if (!q) return true;
      return (
        c.referenceNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.city.toLowerCase().includes(q)
      );
    });
  }, [cases, query, priority, status]);

  const fieldClass =
    "w-full rounded-full border border-border bg-background px-4 py-2.5 text-body-sm text-text outline-none focus-visible:border-primary focus-visible:bg-surface";

  return (
    <div className="space-y-5">
      <WorkspaceHeader
        title={t.dashboard.nav.cases ?? t.institution.overview.openInbox}
        subtitle={verified ? undefined : t.institution.inbox.readOnlyHint}
      />

      {!verified ? <SoftGateBanner /> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="text-caption font-semibold text-text-secondary">
            {t.institution.inbox.search}
          </span>
          <input
            className={fieldClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.institution.inbox.searchPlaceholder}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-caption font-semibold text-text-secondary">
            {t.institution.inbox.priority}
          </span>
          <select
            className={fieldClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityFilter)}
          >
            <option value="all">{t.institution.inbox.all}</option>
            <option value="critical">{t.cases.priority.critical}</option>
            <option value="high">{t.cases.priority.high}</option>
            <option value="medium">{t.cases.priority.medium}</option>
            <option value="low">{t.cases.priority.low}</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-caption font-semibold text-text-secondary">
            {t.institution.inbox.status}
          </span>
          <select
            className={fieldClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="all">{t.institution.inbox.all}</option>
            <option value="new">{t.cases.internalStatus.new}</option>
            <option value="under_review">
              {t.cases.internalStatus.under_review}
            </option>
            <option value="in_progress">
              {t.cases.internalStatus.in_progress}
            </option>
            <option value="resolved">{t.cases.internalStatus.resolved}</option>
          </select>
        </label>
      </div>

      <p className="text-caption text-text-muted" aria-live="polite">
        {t.institution.inbox.resultCount.replace("{count}", String(filtered.length))}
      </p>

      <CaseList
        cases={filtered}
        mode="institution"
        showHeading={false}
        canCreate={verified && cases.length === 0}
        emptyTitle={
          cases.length > 0 && filtered.length === 0
            ? t.institution.inbox.filterEmpty
            : undefined
        }
        emptyDescription={
          cases.length > 0 && filtered.length === 0
            ? t.institution.inbox.searchPlaceholder
            : undefined
        }
      />
    </div>
  );
}
