"use client";

import { RoleBasedNavigation } from "./RoleBasedNavigation";

/** @deprecated Prefer RoleBasedNavigation — kept for import compatibility. */
export function Sidebar({ displayName }: { displayName?: string | null }) {
  return <RoleBasedNavigation userType="PERSON" displayName={displayName} />;
}
