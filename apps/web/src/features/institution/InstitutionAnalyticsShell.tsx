"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useCasesStore } from "@/features/cases";
import { hasPermission } from "@/features/permissions";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import {
  aggregatesToCsv,
  buildAnalyticsSnapshot,
  type AnalyticsPeriod,
} from "./analytics";
import { BarList } from "./BarList";
import { MetricTile } from "./MetricTile";
import { PeriodFilter } from "./PeriodFilter";
import { SoftGateBanner } from "./SoftGateBanner";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { computeCaseMetrics, isInstitutionOperational } from "./metrics";

/**
 * Institution analytics — aggregates only (no identity + precise geo).
 */
export function InstitutionAnalyticsShell() {
  const t = useT();
  const { toast } = useToast();
  const { draft, userType } = useOnboarding();
  const { cases } = useCasesStore();
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const canExport = hasPermission(userType, "VIEW_STATISTICS");

  const snapshot = useMemo(
    () => buildAnalyticsSnapshot(cases, period),
    [cases, period],
  );
  const overview = computeCaseMetrics(
    cases.filter((c) => {
      if (period === "all") return true;
      const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
      const start = Date.now() - days * 86400000;
      return new Date(c.createdAt).getTime() >= start;
    }),
  );

  const periodLabels: Record<AnalyticsPeriod, string> = {
    "7d": t.institution.analytics.periods["7d"],
    "30d": t.institution.analytics.periods["30d"],
    "90d": t.institution.analytics.periods["90d"],
    all: t.institution.analytics.periods.all,
  };

  function exportCsv() {
    const csv = aggregatesToCsv(snapshot);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `animaps-aggregates-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ message: t.institution.analytics.exportDone, tone: "success" });
  }

  return (
    <div className="space-y-5">
      <WorkspaceHeader
        title={t.institution.analytics.title}
        subtitle={t.institution.analytics.subtitle}
        actions={
          <PeriodFilter
            value={period}
            onChange={setPeriod}
            labels={periodLabels}
            ariaLabel={t.institution.analytics.periodLabel}
          />
        }
      />

      {!verified ? <SoftGateBanner /> : null}

      <p className="max-w-2xl text-body-sm text-text-secondary">
        {t.institution.analytics.privacyNote}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label={t.institution.analytics.created} value={snapshot.createdInPeriod} tone={0} />
        <MetricTile label={t.institution.analytics.closed} value={snapshot.closedInPeriod} tone={3} />
        <MetricTile label={t.institution.overview.metrics.priority} value={overview.priority} tone={2} />
        <MetricTile
          label={t.institution.analytics.avgResolution}
          tone={1}
          value={
            snapshot.avgResolutionDays == null
              ? "—"
              : `${snapshot.avgResolutionDays}d`
          }
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-h4 text-text">
            {t.institution.analytics.byType}
          </h2>
          <BarList
            empty={t.institution.analytics.empty}
            items={snapshot.byType.map((r) => ({
              key: r.key,
              label:
                t.cases.types[r.key as keyof typeof t.cases.types]?.title ??
                r.key,
              count: r.count,
            }))}
          />
        </section>
        <section className="space-y-3">
          <h2 className="text-h4 text-text">
            {t.institution.analytics.byPriority}
          </h2>
          <BarList
            empty={t.institution.analytics.empty}
            items={snapshot.byPriority.map((r) => ({
              key: r.key,
              label:
                t.cases.priority[r.key as keyof typeof t.cases.priority] ??
                r.key,
              count: r.count,
            }))}
          />
        </section>
        <section className="space-y-3">
          <h2 className="text-h4 text-text">
            {t.institution.analytics.byStatus}
          </h2>
          <BarList
            empty={t.institution.analytics.empty}
            items={snapshot.byStatus.map((r) => ({
              key: r.key,
              label:
                t.cases.internalStatus[
                  r.key as keyof typeof t.cases.internalStatus
                ] ?? r.key,
              count: r.count,
            }))}
          />
        </section>
        <section className="space-y-3">
          <h2 className="text-h4 text-text">
            {t.institution.analytics.byCitizen}
          </h2>
          <BarList
            empty={t.institution.analytics.empty}
            items={snapshot.byCitizenStatus.map((r) => ({
              key: r.key,
              label:
                t.cases.citizenStatus[
                  r.key as keyof typeof t.cases.citizenStatus
                ] ?? r.key,
              count: r.count,
            }))}
          />
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-h4 text-text">
          {t.institution.analytics.timeline}
        </h2>
        <BarList
          empty={t.institution.analytics.empty}
          items={snapshot.timeline.map((r) => ({
            key: r.key,
            label: r.label,
            count: r.count,
          }))}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 text-text">
          {t.institution.analytics.byCity}
        </h2>
        <BarList
          empty={t.institution.analytics.empty}
          items={snapshot.byCity.map((r) => ({
            key: r.label,
            label: r.label,
            count: r.count,
          }))}
        />
      </section>

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <Button
            type="button"
            variant="pink"
            size="sm"
            onClick={exportCsv}
            disabled={snapshot.filteredTotal === 0}
          >
            <Download className="size-4" aria-hidden />
            {t.institution.analytics.exportCsv}
          </Button>
        ) : null}
        <Button href="/map" variant="ghost" size="sm">
          {t.institution.analytics.openMap}
        </Button>
        <Button href="/cases" variant="ghost" size="sm">
          {t.institution.overview.openInbox}
        </Button>
      </div>
    </div>
  );
}
