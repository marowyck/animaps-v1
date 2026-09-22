"use client";

import { useCallback, useSyncExternalStore } from "react";
import { INTEGRATIONS_STORAGE_KEY } from "./storage";
import {
  addConnection,
  getIntegrationsState,
  recordDataExport,
  removeConnection,
  runMockSync,
  updateConnectionStatus,
} from "./store";
import type {
  IntegrationKind,
  IntegrationProvider,
  IntegrationSyncStatus,
  IntegrationsState,
} from "./types";
import { createEmptyIntegrationsState } from "./types";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === INTEGRATIONS_STORAGE_KEY || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("animaps-integrations-changed", onStoreChange);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("animaps-integrations-changed", onStoreChange);
  };
}

const EMPTY_INTEGRATIONS = createEmptyIntegrationsState();
let snapshotRaw: string | null | undefined;
let snapshot: IntegrationsState = EMPTY_INTEGRATIONS;

function getSnapshot(): IntegrationsState {
  if (typeof window === "undefined") return EMPTY_INTEGRATIONS;
  const raw = window.localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
  if (raw === snapshotRaw) return snapshot;
  snapshotRaw = raw;
  snapshot = getIntegrationsState();
  return snapshot;
}

function getServerSnapshot(): IntegrationsState {
  return EMPTY_INTEGRATIONS;
}

export function useIntegrations() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const create = useCallback(
    (input: {
      name: string;
      kind: IntegrationKind;
      provider: IntegrationProvider;
      endpointUrl?: string;
      notes?: string;
    }) => addConnection(input),
    [],
  );

  const setStatus = useCallback(
    (id: string, status: IntegrationSyncStatus) =>
      updateConnectionStatus(id, status),
    [],
  );

  const remove = useCallback((id: string) => {
    removeConnection(id);
  }, []);

  const sync = useCallback((id: string) => runMockSync(id), []);

  const logExport = useCallback(
    (input: {
      purpose: string;
      period: string;
      rowCount: number;
      requestedByLabel: string;
    }) => recordDataExport(input),
    [],
  );

  return { state, create, setStatus, remove, sync, logExport };
}
