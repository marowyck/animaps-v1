"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/StateBlocks";
import { useCasesStore } from "@/features/cases";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import {
  buildAnalyticsSnapshot,
  type AnalyticsPeriod,
} from "./analytics";
import { PeriodFilter } from "./PeriodFilter";
import { SoftGateBanner } from "./SoftGateBanner";
import { isInstitutionOperational } from "./metrics";

/**
 * Privacy-aware institutional map (Fase 5).
 * City/region intensity grid only — never exact reporter pins.
 */
export function InstitutionMapShell() {
  const t = useT();
  const { draft } = useOnboarding();
  const { cases } = useCasesStore();
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );

  const snapshot = useMemo(
    () => buildAnalyticsSnapshot(cases, period),
    [cases, period],
  );

  const periodLabels: Record<AnalyticsPeriod, string> = {
    "7d": t.institution.analytics.periods["7d"],
    "30d": t.institution.analytics.periods["30d"],
    "90d": t.institution.analytics.periods["90d"],
    all: t.institution.analytics.periods.all,
  };

  const cells = snapshot.byCity;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">
            {t.institution.map.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {t.institution.map.subtitle}
          </p>
        </div>
        <PeriodFilter
          value={period}
          onChange={setPeriod}
          labels={periodLabels}
          ariaLabel={t.institution.analytics.periodLabel}
        />
      </header>

      {!verified ? <SoftGateBanner /> : null}

      <p className="rounded-2xl border border-border-soft bg-white px-3 py-2 text-xs font-semibold text-ink-muted">
        {t.institution.map.privacy}
      </p>

      <Card className="overflow-hidden p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-ink">
            {t.institution.map.heatmapTitle}
          </h2>
          <Legend
            low={t.institution.map.legendLow}
            high={t.institution.map.legendHigh}
          />
        </div>

        {cells.length === 0 ? (
          <EmptyState
            title={t.institution.map.emptyTitle}
            description={t.institution.map.emptyBody}
            action={
              <Button href="/cases" variant="pink" size="sm">
                {t.institution.overview.openInbox}
              </Button>
            }
          />
        ) : (
          <div
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="list"
            aria-label={t.institution.map.heatmapTitle}
          >
            {cells.map((cell) => (
              <div
                key={cell.label}
                role="listitem"
                className="flex min-h-24 flex-col justify-between rounded-2xl border border-border-soft p-3 transition-transform hover:scale-[1.01]"
                style={{
                  backgroundColor: heatColor(cell.intensity),
                }}
              >
                <span className="text-sm font-bold text-ink">{cell.label}</span>
                <span className="text-xs font-semibold text-ink-muted">
                  {t.institution.map.caseCount.replace(
                    "{count}",
                    String(cell.count),
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {cells.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-bold text-ink">
            {t.institution.map.aggregatesTitle}
          </h2>
          <ul className="overflow-hidden rounded-3xl border-2 border-border-soft bg-white">
            {cells.map((cell) => (
              <li
                key={`row-${cell.label}`}
                className="flex items-center justify-between border-b border-border-soft px-4 py-3 last:border-0"
              >
                <span className="font-semibold text-ink">{cell.label}</span>
                <span className="text-sm font-bold tabular-nums text-ink-muted">
                  {cell.count}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button href="/analytics" variant="ghost" size="sm">
          {t.institution.map.openAnalytics}
        </Button>
        <Button href="/cases" variant="ghost" size="sm">
          {t.institution.overview.openInbox}
        </Button>
      </div>
    </div>
  );
}

function Legend({ low, high }: { low: string; high: string }) {
  return (
    <div className="flex items-center gap-2 text-[0.65rem] font-bold text-ink-muted">
      <span>{low}</span>
      <span
        className="h-2 w-24 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(46,125,50,0.12), rgba(46,125,50,0.85))",
        }}
        aria-hidden
      />
      <span>{high}</span>
    </div>
  );
}

/** Green intensity scale — no pin markers. */
function heatColor(intensity: number): string {
  const t = Math.min(Math.max(intensity, 0.08), 1);
  const alpha = 0.12 + t * 0.72;
  return `rgba(46, 125, 50, ${alpha.toFixed(3)})`;
}
