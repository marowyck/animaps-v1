/**
 * Privacy-respecting case analytics (Fase 5).
 * Never emit lat/lng, reporter email, or identity in aggregates/exports.
 */

import type {
  CaseCitizenStatus,
  CasePriority,
  CaseRecord,
  CaseStatus,
  CaseTypeId,
} from "@/features/cases";

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "all";

export type NamedCount = { key: string; count: number };

export type TimeBucket = { key: string; label: string; count: number };

export type CityAggregate = {
  city: string;
  state: string;
  label: string;
  count: number;
  /** 0–1 intensity for heatmap cells */
  intensity: number;
};

export type AnalyticsSnapshot = {
  period: AnalyticsPeriod;
  filteredTotal: number;
  byType: NamedCount[];
  byStatus: NamedCount[];
  byCitizenStatus: NamedCount[];
  byPriority: NamedCount[];
  byCity: CityAggregate[];
  timeline: TimeBucket[];
  /** Average days to close when closedAt exists; null if none closed in window. */
  avgResolutionDays: number | null;
  closedInPeriod: number;
  createdInPeriod: number;
};

function periodStart(period: AnalyticsPeriod, now: Date): Date | null {
  if (period === "all") return null;
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function filterCasesByPeriod(
  cases: CaseRecord[],
  period: AnalyticsPeriod,
  now = new Date(),
): CaseRecord[] {
  const start = periodStart(period, now);
  if (!start) return cases;
  return cases.filter((c) => new Date(c.createdAt) >= start);
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toNamedCounts(map: Map<string, number>): NamedCount[] {
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function weekKey(iso: string): string {
  const d = new Date(iso);
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * Aggregate cases for dashboards/maps.
 * City keys ignore exact/hidden precision for pin purposes — only city/state labels.
 */
export function buildAnalyticsSnapshot(
  cases: CaseRecord[],
  period: AnalyticsPeriod,
  now = new Date(),
): AnalyticsSnapshot {
  const filtered = filterCasesByPeriod(cases, period, now);
  const byType = new Map<string, number>();
  const byStatus = new Map<string, number>();
  const byCitizen = new Map<string, number>();
  const byPriority = new Map<string, number>();
  const byCity = new Map<string, { city: string; state: string; count: number }>();
  const byWeek = new Map<string, number>();

  let resolutionSum = 0;
  let resolutionN = 0;
  let closedInPeriod = 0;

  const start = periodStart(period, now);

  for (const c of filtered) {
    bump(byType, c.caseTypeId);
    bump(byStatus, c.status);
    bump(byCitizen, c.citizenStatus);
    bump(byPriority, c.priority);
    bump(byWeek, weekKey(c.createdAt));

    const city = c.location.city.trim();
    const state = c.location.state.trim();
    // Never include lat/lng. Hidden precision still contributes city label when present.
    if (city || state) {
      const key = `${city}|${state}`;
      const prev = byCity.get(key);
      if (prev) prev.count += 1;
      else byCity.set(key, { city, state, count: 1 });
    }

    if (c.closedAt) {
      const closed = new Date(c.closedAt);
      if (!start || closed >= start) {
        closedInPeriod += 1;
        const days =
          (closed.getTime() - new Date(c.createdAt).getTime()) / 86400000;
        if (days >= 0) {
          resolutionSum += days;
          resolutionN += 1;
        }
      }
    }
  }

  const cityCounts = [...byCity.values()];
  const maxCity = cityCounts.reduce((m, r) => Math.max(m, r.count), 0) || 1;

  const cities: CityAggregate[] = cityCounts
    .map((r) => ({
      city: r.city,
      state: r.state,
      label: [r.city, r.state].filter(Boolean).join("/") || "—",
      count: r.count,
      intensity: r.count / maxCity,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const timeline = [...byWeek.entries()]
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => a.key.localeCompare(b.key));

  return {
    period,
    filteredTotal: filtered.length,
    byType: toNamedCounts(byType),
    byStatus: toNamedCounts(byStatus),
    byCitizenStatus: toNamedCounts(byCitizen),
    byPriority: toNamedCounts(byPriority),
    byCity: cities,
    timeline,
    avgResolutionDays:
      resolutionN > 0 ? Math.round((resolutionSum / resolutionN) * 10) / 10 : null,
    closedInPeriod,
    createdInPeriod: filtered.length,
  };
}

/** CSV of aggregates only — no PII, no coordinates. */
export function aggregatesToCsv(snapshot: AnalyticsSnapshot): string {
  const lines: string[] = [
    "dimension,key,count",
    ...snapshot.byType.map((r) => `type,${escapeCsv(r.key)},${r.count}`),
    ...snapshot.byStatus.map((r) => `status,${escapeCsv(r.key)},${r.count}`),
    ...snapshot.byPriority.map((r) => `priority,${escapeCsv(r.key)},${r.count}`),
    ...snapshot.byCity.map(
      (r) => `city,${escapeCsv(r.label)},${r.count}`,
    ),
    ...snapshot.timeline.map((r) => `week,${escapeCsv(r.key)},${r.count}`),
  ];
  return lines.join("\n");
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export type {
  CaseCitizenStatus,
  CasePriority,
  CaseStatus,
  CaseTypeId,
};
