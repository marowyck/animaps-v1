"use client";

import { useCallback, useSyncExternalStore } from "react";
import { ROUTING_CATALOG_KEY } from "./storage";
import {
  addJurisdiction,
  ensureInstitutionInCatalog,
  getRoutingCatalog,
  removeJurisdiction,
  setAnonymousReports,
  setCapability,
} from "./store";
import type {
  JurisdictionType,
  MockRoutableInstitution,
  RoutingCatalogState,
} from "./types";
import { createEmptyRoutingCatalog } from "./types";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === ROUTING_CATALOG_KEY || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("animaps-routing-changed", onStoreChange);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("animaps-routing-changed", onStoreChange);
  };
}

const EMPTY_CATALOG = createEmptyRoutingCatalog();
let snapshotRaw: string | null | undefined;
let snapshot: RoutingCatalogState = EMPTY_CATALOG;

function getSnapshot(): RoutingCatalogState {
  if (typeof window === "undefined") return EMPTY_CATALOG;
  const raw = window.localStorage.getItem(ROUTING_CATALOG_KEY);
  if (raw === snapshotRaw) return snapshot;
  snapshotRaw = raw;
  snapshot = getRoutingCatalog();
  return snapshot;
}

function getServerSnapshot(): RoutingCatalogState {
  return EMPTY_CATALOG;
}

export function useRoutingCatalog() {
  const catalog = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const ensureInstitution = useCallback(
    (input: {
      id?: string;
      label: string;
      verificationStatus: MockRoutableInstitution["verificationStatus"];
      institutionTypeKey: string | null | undefined;
    }) => ensureInstitutionInCatalog(input),
    [],
  );

  const createJurisdiction = useCallback(
    (
      institutionId: string,
      jurisdictionType: JurisdictionType,
      value: string,
    ) => addJurisdiction(institutionId, { jurisdictionType, value }),
    [],
  );

  const deleteJurisdiction = useCallback(
    (institutionId: string, jurisdictionId: string) => {
      removeJurisdiction(institutionId, jurisdictionId);
    },
    [],
  );

  const toggleCapability = useCallback(
    (institutionId: string, caseTypeId: string, accepts: boolean) =>
      setCapability(institutionId, caseTypeId, accepts),
    [],
  );

  const patchAnonymous = useCallback(
    (institutionId: string, anonymousReports: boolean) => {
      setAnonymousReports(institutionId, anonymousReports);
    },
    [],
  );

  return {
    catalog,
    ensureInstitution,
    createJurisdiction,
    deleteJurisdiction,
    toggleCapability,
    patchAnonymous,
  };
}
