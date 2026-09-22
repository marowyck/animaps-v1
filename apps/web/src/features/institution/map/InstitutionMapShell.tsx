"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { EmptyState, LoadingState } from "@/components/StateBlocks";
import { useCasesStore } from "@/features/cases";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import {
  buildAnalyticsSnapshot,
  type AnalyticsPeriod,
  type CityAggregate,
} from "../analytics";
import { PeriodFilter } from "../PeriodFilter";
import { SoftGateBanner } from "../SoftGateBanner";
import { WorkspaceHeader } from "../WorkspaceHeader";
import { isInstitutionOperational } from "../metrics";
import { locateCity } from "./cityCentroids";
import type { MapPoint } from "./types";

const CityMap = dynamic(
  () => import("./CityMap").then((mod) => mod.CityMap),
  {
    ssr: false,
    loading: () => <MapLoading />,
  },
);

function MapLoading() {
  const t = useT();
  return (
    <div className="flex h-[28rem] items-center justify-center rounded-3xl border border-border-soft bg-surface">
      <LoadingState title={t.common.loading} />
    </div>
  );
}

/**
 * Privacy-aware institutional map.
 * City centroids only — never exact reporter coordinates.
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

  const located = useMemo(
    () => splitByCoordinates(snapshot.byCity),
    [snapshot.byCity],
  );

  return (
    <div className="space-y-5">
      <WorkspaceHeader
        title={t.institution.map.title}
        subtitle={t.institution.map.subtitle}
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
        {t.institution.map.privacy}
      </p>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-h4 text-text">{t.institution.map.heatmapTitle}</h2>
            <p className="text-caption mt-1 text-text-muted">
              {t.institution.map.canvasHint}
            </p>
          </div>
          <Legend
            low={t.institution.map.legendLow}
            high={t.institution.map.legendHigh}
          />
        </div>

        {snapshot.byCity.length === 0 ? (
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
          <CityMap
            points={located.placed}
            detailFor={(point) =>
              t.institution.map.caseCount.replace("{count}", String(point.count))
            }
          />
        )}

        {located.unplaced.length > 0 ? (
          <p className="text-caption text-text-muted">{t.institution.map.unplaced}</p>
        ) : null}
      </section>

      {snapshot.byCity.length > 0 ? (
        <section>
          <h2 className="text-h4 mb-2 text-text">
            {t.institution.map.aggregatesTitle}
          </h2>
          <ul className="flex flex-col gap-1">
            {snapshot.byCity.map((cell) => (
              <li
                key={`row-${cell.label}`}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-3 text-body-sm font-semibold text-text">
                  <span className="h-6 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
                  {cell.label}
                </span>
                <span className="font-display text-xl text-text tabular-nums">
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

function splitByCoordinates(cells: CityAggregate[]): {
  placed: MapPoint[];
  unplaced: CityAggregate[];
} {
  const placed: MapPoint[] = [];
  const unplaced: CityAggregate[] = [];

  for (const cell of cells) {
    const point = locateCity(cell.city, cell.state);
    if (!point) {
      unplaced.push(cell);
      continue;
    }
    placed.push({
      id: cell.label,
      label: cell.label,
      count: cell.count,
      intensity: cell.intensity,
      lat: point.lat,
      lng: point.lng,
      kind: "report",
    });
  }

  return { placed, unplaced };
}

function Legend({ low, high }: { low: string; high: string }) {
  return (
    <div className="text-caption flex items-center gap-2 text-text-muted">
      <span>{low}</span>
      <span
        className="h-2 w-24 rounded-pill"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--secondary) 25%, transparent), var(--secondary))",
        }}
        aria-hidden
      />
      <span>{high}</span>
    </div>
  );
}
