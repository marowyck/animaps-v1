"use client";

import { useCallback, useSyncExternalStore } from "react";
import { assignCase, unassignCase } from "./assignmentStore";
import { routeCase, tryAutoRoute, forwardCase } from "./routingStore";
import { getCaseById, listCases } from "./queries";
import {
  addCaseComment,
  advanceInstitutionReview,
  claimCase,
  createCase,
} from "./store";
import { CASES_STORAGE_KEY } from "./storage";
import type {
  CaseCommentVisibility,
  CaseRecord,
  CaseRoutingReason,
  CreateCaseInput,
} from "./types";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === CASES_STORAGE_KEY || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("animaps-cases-changed", onStoreChange);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("animaps-cases-changed", onStoreChange);
  };
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("animaps-cases-changed"));
}

const EMPTY_CASES: CaseRecord[] = [];
let snapshotRaw: string | null | undefined;
let snapshot: CaseRecord[] = EMPTY_CASES;

function getSnapshot(): CaseRecord[] {
  if (typeof window === "undefined") return EMPTY_CASES;
  const raw = window.localStorage.getItem(CASES_STORAGE_KEY);
  if (raw === snapshotRaw) return snapshot;
  snapshotRaw = raw;
  snapshot = listCases();
  return snapshot;
}

function getServerSnapshot(): CaseRecord[] {
  return EMPTY_CASES;
}

export function useCasesStore() {
  const cases = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const create = useCallback((input: CreateCaseInput) => {
    const result = createCase(input);
    emitChange();
    return result;
  }, []);

  const claim = useCallback((token: string, email: string) => {
    const result = claimCase(token, email);
    emitChange();
    return result;
  }, []);

  const comment = useCallback(
    (
      caseId: string,
      body: string,
      visibility: CaseCommentVisibility,
      authorLabel: string,
    ) => {
      const result = addCaseComment(caseId, body, visibility, authorLabel);
      emitChange();
      return result;
    },
    [],
  );

  const markReview = useCallback((caseId: string) => {
    const result = advanceInstitutionReview(caseId);
    emitChange();
    return result;
  }, []);

  const assign = useCallback(
    (
      caseId: string,
      input: {
        memberId?: string | null;
        memberLabel?: string | null;
        teamId?: string | null;
        teamLabel?: string | null;
        assignedByLabel?: string | null;
        note?: string | null;
      },
    ) => {
      const result = assignCase(caseId, input);
      emitChange();
      return result;
    },
    [],
  );

  const unassign = useCallback((caseId: string) => {
    const result = unassignCase(caseId);
    emitChange();
    return result;
  }, []);

  const runRouting = useCallback((caseId: string) => {
    const result = tryAutoRoute(caseId, { recordMiss: true });
    emitChange();
    return result;
  }, []);

  const route = useCallback(
    (
      caseId: string,
      input: {
        toInstitutionId: string | null;
        toInstitutionLabel: string;
        fromInstitutionId?: string | null;
        fromInstitutionLabel?: string | null;
        reason?: CaseRoutingReason;
        note?: string | null;
      },
    ) => {
      const result = routeCase(caseId, input);
      emitChange();
      return result;
    },
    [],
  );

  const forward = useCallback(
    (
      caseId: string,
      input: {
        toInstitutionId: string | null;
        toInstitutionLabel: string;
        fromInstitutionId?: string | null;
        fromInstitutionLabel?: string | null;
        reason: CaseRoutingReason;
        note?: string | null;
      },
    ) => {
      const result = forwardCase(caseId, input);
      emitChange();
      return result;
    },
    [],
  );

  return {
    cases,
    create,
    claim,
    comment,
    markReview,
    assign,
    unassign,
    runRouting,
    route,
    forward,
  };
}

export function useCase(id: string | undefined) {
  const { cases } = useCasesStore();
  if (!id) return null;
  return getCaseById(id) ?? cases.find((c) => c.id === id) ?? null;
}

export function useMyCases(email: string | null | undefined) {
  const { cases } = useCasesStore();
  if (!email) return [];
  const key = email.trim().toLowerCase();
  return cases.filter(
    (c) =>
      c.reporterEmail?.toLowerCase() === key || c.reporterId === key,
  );
}
