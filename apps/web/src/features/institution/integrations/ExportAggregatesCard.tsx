"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/Button";
import { Input, nativeSelectClass } from "@/components/Input";
import { formatDateTime, useLocale, useT } from "@/i18n";
import { WorkspaceSection } from "../WorkspaceSection";
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
    <WorkspaceSection
      title={t.institution.integrations.exportTitle}
      hint={t.institution.integrations.exportHint}
      icon={<Download className="size-5" aria-hidden />}
      tone="success"
    >

      {canExport ? (
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="block space-y-1.5">
            <span className="text-body-sm font-semibold text-text">
              {t.institution.integrations.exportPeriod}
            </span>
            <select
              className={nativeSelectClass}
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
            <Button type="button" size="sm" variant="primary" onClick={onExport}>
              {t.institution.integrations.exportCsv}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-body-sm text-text-muted">
          {t.institution.integrations.exportLocked}
        </p>
      )}

      {exports.length === 0 ? (
        <p className="text-body-sm text-text-muted">
          {t.institution.integrations.noExports}
        </p>
      ) : (
        <ul className="divide-y divide-border-subtle text-body-sm">
          {exports.map((ex) => (
            <li key={ex.id} className="py-2">
              <p className="font-semibold text-text">
                {ex.format.toUpperCase()} · {ex.period} · {ex.rowCount}{" "}
                {t.institution.integrations.rows}
              </p>
              <p className="text-caption text-text-muted">
                {ex.purpose} · {ex.requestedByLabel} ·{" "}
                {formatDateTime(ex.createdAt, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </WorkspaceSection>
  );
}
