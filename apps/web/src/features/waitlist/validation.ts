import {
  DB_TO_USER_TYPE,
  normalizeUserType,
  type PublicUserType,
} from "@/features/user-types";
import {
  PROFILE_TYPE_VALUES,
  toDbProfileType,
  type ProfileType,
  type WaitlistBody,
  type WaitlistFormState,
  type WaitlistLead,
} from "./types";

export type WaitlistFormErrorKey = "requiredFields" | "lgpdRequired";

/** Client-side form checks — map keys via i18n in the form UI. */
export function validateWaitlistFormClient(
  form: WaitlistFormState,
): WaitlistFormErrorKey | null {
  if (!form.name.trim() || !form.email.trim() || !form.profileType) {
    return "requiredFields";
  }
  if (!form.lgpdConsent) {
    return "lgpdRequired";
  }
  return null;
}

const PROFILE_TYPES = new Set<string>([
  ...PROFILE_TYPE_VALUES,
  ...Object.keys(DB_TO_USER_TYPE),
  "PERSON",
  "ONG",
  "VETERINARY_CLINIC",
  "OTHER",
]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParseWaitlistResult =
  | { ok: true; lead: WaitlistLead }
  | { ok: false; message: string; status: number };

/**
 * Server-side waitlist payload validation.
 * Accepts SCREAMING_SNAKE (UI) or snake_case (DB) profileType values.
 */
export function parseWaitlistBody(body: WaitlistBody): ParseWaitlistResult {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const rawType = body.profileType ?? "";

  if (!name || !email || !PROFILE_TYPES.has(rawType)) {
    return {
      ok: false,
      message: "Campos obrigatórios inválidos.",
      status: 400,
    };
  }

  if (!EMAIL_RE.test(email)) {
    return {
      ok: false,
      message: "Informe um e-mail válido.",
      status: 400,
    };
  }

  if (!body.lgpdConsent) {
    return {
      ok: false,
      message: "Consentimento LGPD obrigatório.",
      status: 400,
    };
  }

  const userType = normalizeUserType(rawType) as PublicUserType;
  const profileType = toDbProfileType(userType);

  return {
    ok: true,
    lead: {
      name,
      email,
      profileType: profileType as ProfileType,
      city: body.city ?? null,
      state: body.state ?? null,
      lgpdConsentAt: new Date().toISOString(),
    },
  };
}
