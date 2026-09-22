import type { CreateCaseInput, CaseRecord } from "./types";

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Demo claim token — not a cryptographic secret store. */
export function createClaimToken(): string {
  const part = () => Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CLM-${part()}-${part()}`;
}

/** Deterministic non-crypto fingerprint for mock hash lookup. */
export function hashClaimToken(token: string): string {
  let h = 0;
  for (let i = 0; i < token.length; i += 1) {
    h = (h * 31 + token.charCodeAt(i)) >>> 0;
  }
  return `h${h.toString(16)}`;
}

export function nextReferenceNumber(existing: CaseRecord[]): string {
  const year = new Date().getFullYear();
  const prefix = `AM-${year}-`;
  let max = 0;
  for (const c of existing) {
    if (!c.referenceNumber.startsWith(prefix)) continue;
    const n = Number(c.referenceNumber.slice(prefix.length));
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return `${prefix}${String(max + 1).padStart(6, "0")}`;
}

export function emptyLocation(
  partial: CreateCaseInput["location"],
): CaseRecord["location"] {
  return {
    city: partial.city?.trim() ?? "",
    state: partial.state?.trim() ?? "",
    neighborhood: partial.neighborhood?.trim() ?? "",
    formattedAddress: partial.formattedAddress?.trim() ?? "",
    latitude: partial.latitude ?? null,
    longitude: partial.longitude ?? null,
    precision: partial.precision ?? "city",
  };
}
