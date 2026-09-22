"use client";

import { useCallback, useSyncExternalStore } from "react";
import { INSTITUTION_ORG_KEY } from "./storage";
import {
  addDepartment,
  addTeam,
  ensureAdminMember,
  getOrgState,
  inviteMember,
  removeDepartment,
  removeTeam,
  setMemberStatus,
  updateMember,
} from "./store";
import type {
  InstitutionMemberRole,
  InstitutionOrgState,
  MembershipStatus,
} from "./types";
import { createEmptyOrgState } from "./types";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === INSTITUTION_ORG_KEY || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("animaps-org-changed", onStoreChange);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("animaps-org-changed", onStoreChange);
  };
}

const EMPTY_ORG = createEmptyOrgState();
let snapshotRaw: string | null | undefined;
let snapshot: InstitutionOrgState = EMPTY_ORG;

function getSnapshot(): InstitutionOrgState {
  if (typeof window === "undefined") return EMPTY_ORG;
  const raw = window.localStorage.getItem(INSTITUTION_ORG_KEY);
  if (raw === snapshotRaw) return snapshot;
  snapshotRaw = raw;
  snapshot = getOrgState();
  return snapshot;
}

function getServerSnapshot(): InstitutionOrgState {
  return EMPTY_ORG;
}

export function useInstitutionOrg() {
  const org = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const ensureAdmin = useCallback(
    (email: string | null | undefined, displayName: string | null | undefined) =>
      ensureAdminMember({ email, displayName }),
    [],
  );

  const createDepartment = useCallback(
    (name: string, description?: string, parentDepartmentId?: string | null) =>
      addDepartment({ name, description, parentDepartmentId }),
    [],
  );

  const deleteDepartment = useCallback((id: string) => {
    removeDepartment(id);
  }, []);

  const createTeam = useCallback(
    (name: string, description?: string, departmentId?: string | null) =>
      addTeam({ name, description, departmentId }),
    [],
  );

  const deleteTeam = useCallback((id: string) => {
    removeTeam(id);
  }, []);

  const invite = useCallback(
    (input: {
      email: string;
      displayName?: string;
      role: InstitutionMemberRole;
      departmentId?: string | null;
      teamId?: string | null;
    }) => inviteMember(input),
    [],
  );

  const patchMember = useCallback(
    (
      id: string,
      patch: Partial<{
        role: InstitutionMemberRole;
        departmentId: string | null;
        teamId: string | null;
        status: MembershipStatus;
        displayName: string;
      }>,
    ) => updateMember(id, patch),
    [],
  );

  const changeStatus = useCallback(
    (id: string, status: MembershipStatus) => setMemberStatus(id, status),
    [],
  );

  return {
    org,
    ensureAdmin,
    createDepartment,
    deleteDepartment,
    createTeam,
    deleteTeam,
    invite,
    patchMember,
    changeStatus,
  };
}
