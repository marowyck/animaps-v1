/**
 * Institution integrations mock (Fase 8).
 * Generic connectors only — no named government / SIS / prefeitura APIs.
 */

export const INTEGRATION_KINDS = [
  "api",
  "webhook",
  "import",
  "export",
  "partner",
] as const;

export type IntegrationKind = (typeof INTEGRATION_KINDS)[number];

export const INTEGRATION_SYNC_STATUSES = [
  "pending",
  "syncing",
  "success",
  "failed",
  "retrying",
  "disabled",
] as const;

export type IntegrationSyncStatus = (typeof INTEGRATION_SYNC_STATUSES)[number];

export const INTEGRATION_LOG_DIRECTIONS = ["inbound", "outbound"] as const;

export type IntegrationLogDirection = (typeof INTEGRATION_LOG_DIRECTIONS)[number];

/** Stable generic slugs — never vendor-specific gov names in this mock. */
export const INTEGRATION_PROVIDERS = [
  "generic_rest",
  "generic_webhook",
  "generic_csv_import",
  "generic_csv_export",
  "generic_partner_feed",
] as const;

export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export type IntegrationLogRecord = {
  id: string;
  connectionId: string;
  direction: IntegrationLogDirection;
  status: IntegrationSyncStatus;
  httpStatus: number | null;
  /** Short operational message — no PII payloads. */
  message: string;
  externalId: string | null;
  caseId: string | null;
  createdAt: string;
};

export type IntegrationConnectionRecord = {
  id: string;
  name: string;
  kind: IntegrationKind;
  provider: IntegrationProvider;
  status: IntegrationSyncStatus;
  /** Non-secret config only (URLs, field maps). Never store API keys. */
  config: {
    endpointUrl: string;
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type DataExportRecord = {
  id: string;
  format: "csv";
  purpose: string;
  period: string;
  rowCount: number;
  requestedByLabel: string;
  createdAt: string;
};

export type IntegrationsState = {
  connections: IntegrationConnectionRecord[];
  logs: IntegrationLogRecord[];
  exports: DataExportRecord[];
};

export function createEmptyIntegrationsState(): IntegrationsState {
  return { connections: [], logs: [], exports: [] };
}
