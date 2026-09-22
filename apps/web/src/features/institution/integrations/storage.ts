import type { IntegrationsState } from "./types";
import { createEmptyIntegrationsState } from "./types";

export const INTEGRATIONS_STORAGE_KEY = "animaps-integrations-v1";

export function readIntegrationsState(): IntegrationsState {
  if (typeof window === "undefined") return createEmptyIntegrationsState();
  try {
    const raw = window.localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
    if (!raw) return createEmptyIntegrationsState();
    const parsed = JSON.parse(raw) as IntegrationsState;
    return {
      connections: Array.isArray(parsed.connections) ? parsed.connections : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
      exports: Array.isArray(parsed.exports) ? parsed.exports : [],
    };
  } catch {
    return createEmptyIntegrationsState();
  }
}

export function writeIntegrationsState(state: IntegrationsState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(state));
}
