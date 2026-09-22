"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/components/Toast";
import { useCasesStore } from "@/features/cases";
import { hasPermission } from "@/features/permissions";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import {
  aggregatesToCsv,
  buildAnalyticsSnapshot,
  type AnalyticsPeriod,
} from "../analytics";
import { SoftGateBanner } from "../SoftGateBanner";
import { WorkspaceHeader } from "../WorkspaceHeader";
import { isInstitutionOperational } from "../metrics";
import { ConnectionsCard } from "./ConnectionsCard";
import { ExportAggregatesCard } from "./ExportAggregatesCard";
import { SyncLogsCard } from "./SyncLogsCard";
import { useIntegrations } from "./useIntegrations";
import {
  INTEGRATION_PROVIDERS,
  type IntegrationKind,
  type IntegrationProvider,
} from "./types";

const DEFAULT_PROVIDER: Record<IntegrationKind, IntegrationProvider> = {
  api: "generic_rest",
  webhook: "generic_webhook",
  import: "generic_csv_import",
  export: "generic_csv_export",
  partner: "generic_partner_feed",
};

/**
 * Generic integrations workspace (Fase 8).
 * No named government APIs; sync failure never changes citizen status.
 */
export function InstitutionIntegrationsShell() {
  const t = useT();
  const { toast } = useToast();
  const { draft, userType } = useOnboarding();
  const { cases } = useCasesStore();
  const { state, create, setStatus, remove, sync, logExport } = useIntegrations();

  const verified = isInstitutionOperational(
    draft.institutionalVerificationStatus,
  );
  const canManage =
    verified &&
    (hasPermission(userType, "MANAGE_INTEGRATION") ||
      hasPermission(userType, "MANAGE_INSTITUTION"));
  const canExport =
    verified &&
    (hasPermission(userType, "EXPORT_DATA") ||
      hasPermission(userType, "VIEW_STATISTICS"));

  const [name, setName] = useState("");
  const [kind, setKind] = useState<IntegrationKind>("api");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [exportPeriod, setExportPeriod] = useState<AnalyticsPeriod>("30d");
  const [exportPurpose, setExportPurpose] = useState("");

  const recentLogs = state.logs.slice(0, 20);

  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!canManage || !name.trim()) return;
    create({
      name: name.trim(),
      kind,
      provider: DEFAULT_PROVIDER[kind],
      endpointUrl,
      notes,
    });
    setName("");
    setEndpointUrl("");
    setNotes("");
    toast({
      message: t.institution.integrations.connectionAdded,
      tone: "success",
    });
  }

  function onExportAggregates() {
    if (!canExport) return;
    const snapshot = buildAnalyticsSnapshot(cases, exportPeriod);
    const csv = aggregatesToCsv(snapshot);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `animaps-aggregates-${exportPeriod}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    const actor =
      draft.displayName?.trim() || draft.email || t.cases.detail.institutionAuthor;
    logExport({
      purpose:
        exportPurpose.trim() || t.institution.integrations.defaultPurpose,
      period: exportPeriod,
      rowCount: snapshot.filteredTotal,
      requestedByLabel: actor,
    });
    toast({ message: t.institution.integrations.exportDone, tone: "success" });
  }

  return (
    <div className="space-y-5">
      <WorkspaceHeader
        title={t.institution.integrations.title}
        subtitle={t.institution.integrations.subtitle}
        note={t.institution.integrations.honesty}
      />

      {!verified ? <SoftGateBanner /> : null}
      {!verified ? (
        <p className="text-sm text-ink-muted">
          {t.institution.integrations.readOnlyHint}
        </p>
      ) : null}

      <ConnectionsCard
        canManage={canManage}
        connections={state.connections}
        name={name}
        kind={kind}
        endpointUrl={endpointUrl}
        notes={notes}
        onNameChange={setName}
        onKindChange={setKind}
        onEndpointUrlChange={setEndpointUrl}
        onNotesChange={setNotes}
        onCreate={onCreate}
        onSync={sync}
        onSetStatus={setStatus}
        onRemove={remove}
      />

      <SyncLogsCard logs={recentLogs} connections={state.connections} />

      <ExportAggregatesCard
        canExport={canExport}
        exportPeriod={exportPeriod}
        exportPurpose={exportPurpose}
        exports={state.exports}
        onExportPeriodChange={setExportPeriod}
        onExportPurposeChange={setExportPurpose}
        onExport={onExportAggregates}
      />

      <p className="text-xs text-ink-muted">
        {t.institution.integrations.providersNote}:{" "}
        {INTEGRATION_PROVIDERS.map((p) => p).join(", ")}
      </p>
    </div>
  );
}
