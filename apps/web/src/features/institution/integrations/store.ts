import { readIntegrationsState, writeIntegrationsState } from "./storage";
import type {
  DataExportRecord,
  IntegrationConnectionRecord,
  IntegrationKind,
  IntegrationLogRecord,
  IntegrationProvider,
  IntegrationSyncStatus,
  IntegrationsState,
} from "./types";
import { createEmptyIntegrationsState } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `int-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("animaps-integrations-changed"));
}

export function getIntegrationsState(): IntegrationsState {
  return readIntegrationsState();
}

export function addConnection(input: {
  name: string;
  kind: IntegrationKind;
  provider: IntegrationProvider;
  endpointUrl?: string;
  notes?: string;
}): IntegrationConnectionRecord {
  const state = readIntegrationsState();
  const createdAt = nowIso();
  const connection: IntegrationConnectionRecord = {
    id: uid(),
    name: input.name.trim() || "Connection",
    kind: input.kind,
    provider: input.provider,
    status: "pending",
    config: {
      endpointUrl: (input.endpointUrl ?? "").trim(),
      notes: (input.notes ?? "").trim(),
    },
    createdAt,
    updatedAt: createdAt,
  };
  writeIntegrationsState({
    ...state,
    connections: [...state.connections, connection],
  });
  emitChange();
  return connection;
}

export function updateConnectionStatus(
  id: string,
  status: IntegrationSyncStatus,
): IntegrationConnectionRecord | null {
  const state = readIntegrationsState();
  const idx = state.connections.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const current = state.connections[idx]!;
  const updated: IntegrationConnectionRecord = {
    ...current,
    status,
    updatedAt: nowIso(),
  };
  const connections = [...state.connections];
  connections[idx] = updated;
  writeIntegrationsState({ ...state, connections });
  emitChange();
  return updated;
}

export function removeConnection(id: string): void {
  const state = readIntegrationsState();
  writeIntegrationsState({
    connections: state.connections.filter((c) => c.id !== id),
    logs: state.logs.filter((l) => l.connectionId !== id),
    exports: state.exports,
  });
  emitChange();
}

function appendLog(
  state: IntegrationsState,
  log: Omit<IntegrationLogRecord, "id" | "createdAt">,
): IntegrationsState {
  const entry: IntegrationLogRecord = {
    ...log,
    id: uid(),
    createdAt: nowIso(),
  };
  return {
    ...state,
    logs: [entry, ...state.logs].slice(0, 200),
  };
}

/**
 * Mock sync run. Never touches case citizenStatus.
 * Failed sync ≠ “delivered to the agency”.
 */
export function runMockSync(connectionId: string): {
  connection: IntegrationConnectionRecord | null;
  ok: boolean;
} {
  const state = readIntegrationsState();
  const idx = state.connections.findIndex((c) => c.id === connectionId);
  if (idx < 0) return { connection: null, ok: false };
  const current = state.connections[idx]!;
  if (current.status === "disabled") {
    return { connection: current, ok: false };
  }

  const hasEndpoint = Boolean(current.config.endpointUrl);
  const ok = hasEndpoint && Math.random() > 0.25;
  const nextStatus: IntegrationSyncStatus = ok ? "success" : "failed";
  const updated: IntegrationConnectionRecord = {
    ...current,
    status: nextStatus,
    updatedAt: nowIso(),
  };
  const connections = [...state.connections];
  connections[idx] = updated;

  let next = appendLog(
    { ...state, connections },
    {
      connectionId,
      direction: current.kind === "import" || current.kind === "partner" ? "inbound" : "outbound",
      status: nextStatus,
      httpStatus: ok ? 200 : 502,
      message: ok
        ? "syncOk"
        : hasEndpoint
          ? "syncFail"
          : "syncMissingEndpoint",
      externalId: ok ? `ext-${uid().slice(0, 8)}` : null,
      caseId: null,
    },
  );
  writeIntegrationsState(next);
  emitChange();
  return { connection: updated, ok };
}

export function recordDataExport(input: {
  purpose: string;
  period: string;
  rowCount: number;
  requestedByLabel: string;
}): DataExportRecord {
  const state = readIntegrationsState();
  const record: DataExportRecord = {
    id: uid(),
    format: "csv",
    purpose: input.purpose.trim() || "aggregates",
    period: input.period,
    rowCount: input.rowCount,
    requestedByLabel: input.requestedByLabel,
    createdAt: nowIso(),
  };
  writeIntegrationsState({
    ...state,
    exports: [record, ...state.exports].slice(0, 100),
  });
  emitChange();
  return record;
}

export function resetIntegrationsState(): void {
  writeIntegrationsState(createEmptyIntegrationsState());
  emitChange();
}

export { createEmptyIntegrationsState };
