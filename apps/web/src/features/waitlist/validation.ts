import type { ProfileType, WaitlistFormState, WaitlistLead } from "./types";

export const PROFILE_TYPES = new Set<string>([
  "guardian",
  "ngo",
  "clinic",
  "other",
]);

export const PROFILE_OPTIONS = [
  { value: "guardian", label: "Tutor / quero adotar" },
  { value: "ngo", label: "ONG" },
  { value: "clinic", label: "Clínica veterinária" },
  { value: "other", label: "Outro" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistBody = {
  name?: string;
  email?: string;
  profileType?: string;
  city?: string;
  state?: string;
  lgpdConsent?: boolean;
};

export type ParseWaitlistResult =
  | { ok: true; lead: WaitlistLead }
  | { ok: false; message: string; status: number };

/** Client-side form checks — same messages as before the refactor. */
export function validateWaitlistFormClient(
  form: WaitlistFormState,
): string | null {
  if (!form.name.trim() || !form.email.trim() || !form.profileType) {
    return "Preencha nome, e-mail e tipo de perfil.";
  }
  if (!form.lgpdConsent) {
    return "É necessário aceitar a política de privacidade.";
  }
  return null;
}

/** Server-side payload validation for the waitlist route handler. */
export function parseWaitlistBody(body: WaitlistBody): ParseWaitlistResult {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const profileType = body.profileType ?? "";

  if (!name || !email || !PROFILE_TYPES.has(profileType)) {
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
