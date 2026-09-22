"use client";

import { useMemo, useState } from "react";
import { CaseList } from "@/features/cases";
import type { CasePriority, CaseRecord, CaseStatus } from "@/features/cases";
import { useT } from "@/i18n";
import { SoftGateBanner } from "./SoftGateBanner";

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

  return (
    <div className="space-y-4">
      {!verified ? <SoftGateBanner /> : null}

      {!verified ? (
        <p className="text-sm text-ink-muted">
          {t.institution.inbox.readOnlyHint}
        </p>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="block space-y-1">
          <span className="text-xs font-bold text-ink">
            {t.institution.inbox.search}
          </span>
          <input
            className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.institution.inbox.searchPlaceholder}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-ink">
            {t.institution.inbox.priority}
          </span>
          <select
            className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
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
        <label className="block space-y-1">
          <span className="text-xs font-bold text-ink">
            {t.institution.inbox.status}
          </span>
          <select
            className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
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

      <CaseList
        cases={filtered}
        mode="institution"
        canCreate={verified}
      />
    </div>
  );
}
