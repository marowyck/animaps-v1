import type { RoutingCatalogState } from "./types";
import { createEmptyRoutingCatalog } from "./types";

export const ROUTING_CATALOG_KEY = "animaps-routing-catalog-v1";

export function readRoutingCatalog(): RoutingCatalogState {
  if (typeof window === "undefined") return createEmptyRoutingCatalog();
  try {
    const raw = window.localStorage.getItem(ROUTING_CATALOG_KEY);
    if (!raw) return createEmptyRoutingCatalog();
    const parsed = JSON.parse(raw) as RoutingCatalogState;
    return {
      institutions: Array.isArray(parsed.institutions) ? parsed.institutions : [],
    };
  } catch {
    return createEmptyRoutingCatalog();
  }
}

export function writeRoutingCatalog(state: RoutingCatalogState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROUTING_CATALOG_KEY, JSON.stringify(state));
}
