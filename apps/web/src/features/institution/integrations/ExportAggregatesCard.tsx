"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { formatDateTime, useLocale, useT } from "@/i18n";
import type { AnalyticsPeriod } from "../analytics";
import type { DataExportRecord } from "./types";

type ExportAggregatesCardProps = {
  canExport: boolean;
  exportPeriod: AnalyticsPeriod;
  exportPurpose: string;
  exports: DataExportRecord[];
  onExportPeriodChange: (value: AnalyticsPeriod) => void;
  onExportPurposeChange: (value: string) => void;
  onExport: () => void;
};

export function ExportAggregatesCard({
  canExport,
  exportPeriod,
  exportPurpose,
  exports,
  onExportPeriodChange,
  onExportPurposeChange,
  onExport,
}: ExportAggregatesCardProps) {
  const t = useT();
  const { locale } = useLocale();

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Download className="size-4 text-brand-green" aria-hidden />
        <h2 className="text-sm font-bold text-ink">
          {t.institution.integrations.exportTitle}
        </h2>
      </div>
      <p className="text-xs text-ink-muted">
        {t.institution.integrations.exportHint}
      </p>

      {canExport ? (
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="block space-y-1">
            <span className="text-xs font-bold text-ink">
              {t.institution.integrations.exportPeriod}
            </span>
            <select
              className="w-full rounded-2xl border-2 border-border-soft bg-white px-3 py-2 text-sm outline-none focus-visible:border-brand-green"
              value={exportPeriod}
              onChange={(e) =>
                onExportPeriodChange(e.target.value as AnalyticsPeriod)
              }
            >
              <option value="7d">{t.institution.analytics.periods["7d"]}</option>
              <option value="30d">
                {t.institution.analytics.periods["30d"]}
              </option>
              <option value="90d">
                {t.institution.analytics.periods["90d"]}
              </option>
              <option value="all">{t.institution.analytics.periods.all}</option>
            </select>
          </label>
          <Input
            label={t.institution.integrations.exportPurpose}
            value={exportPurpose}
            onChange={(e) => onExportPurposeChange(e.target.value)}
            className="sm:col-span-1"
          />
          <div className="flex items-end">
            <Button type="button" size="sm" variant="pink" onClick={onExport}>
              {t.institution.integrations.exportCsv}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-ink-muted">
          {t.institution.integrations.exportLocked}
        </p>
      )}

      {exports.length === 0 ? (
        <p className="text-xs text-ink-muted">
          {t.institution.integrations.noExports}
        </p>
      ) : (
        <ul className="divide-y divide-border-soft text-sm">
          {exports.map((ex) => (
            <li key={ex.id} className="py-2">
              <p className="font-semibold text-ink">
                {ex.format.toUpperCase()} · {ex.period} · {ex.rowCount}{" "}
                {t.institution.integrations.rows}
              </p>
              <p className="text-xs text-ink-muted">
                {ex.purpose} · {ex.requestedByLabel} ·{" "}
                {formatDateTime(ex.createdAt, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
