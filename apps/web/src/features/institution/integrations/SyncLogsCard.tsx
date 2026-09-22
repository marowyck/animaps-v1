"use client";

import { formatDateTime, useLocale, useT } from "@/i18n";
import type { Messages } from "@/i18n";
import { WorkspaceSection } from "../WorkspaceSection";
import type { IntegrationConnectionRecord, IntegrationLogRecord } from "./types";

type SyncLogsCardProps = {
  logs: IntegrationLogRecord[];
  connections: IntegrationConnectionRecord[];
};

function translateLogMessage(raw: string, t: Messages): string {
  const copy = t.institution.integrations;
  if (raw === "syncOk" || raw === "syncFail" || raw === "syncMissingEndpoint") {
    return copy[raw];
  }
  if (raw.startsWith("Mock sync completed")) return copy.syncOk;
  if (raw.startsWith("Mock sync failed")) return copy.syncFail;
  if (raw.startsWith("Missing non-secret")) return copy.syncMissingEndpoint;
  return raw;
}

export function SyncLogsCard({ logs, connections }: SyncLogsCardProps) {
  const t = useT();
  const { locale } = useLocale();

  return (
    <WorkspaceSection
      title={t.institution.integrations.logsTitle}
      hint={t.institution.integrations.logsHint}
      tone="secondary"
    >
      {logs.length === 0 ? (
        <p className="text-xs text-ink-muted">
          {t.institution.integrations.noLogs}
        </p>
      ) : (
        <ul className="divide-y divide-border-soft text-sm">
          {logs.map((log) => {
            const conn = connections.find((c) => c.id === log.connectionId);
            return (
              <li key={log.id} className="py-2">
                <p className="font-semibold text-ink">
                  {conn?.name ?? log.connectionId.slice(0, 8)} ·{" "}
                  {t.institution.integrations.statuses[log.status]}
                </p>
                <p className="text-xs text-ink-muted">
                  {t.institution.integrations.directions[log.direction]}
                  {log.httpStatus ? ` · HTTP ${log.httpStatus}` : ""} ·{" "}
                  {formatDateTime(log.createdAt, locale)}
                </p>
                <p className="mt-1 text-xs text-ink">
                  {translateLogMessage(log.message, t)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </WorkspaceSection>
  );
}
