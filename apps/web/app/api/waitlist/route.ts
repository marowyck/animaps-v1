import { NextResponse } from "next/server";

type WaitlistBody = {
  name?: string;
  email?: string;
  profileType?: string;
  city?: string;
  state?: string;
  lgpdConsent?: boolean;
};

const PROFILE_TYPES = new Set(["guardian", "ngo", "clinic", "other"]);

export async function POST(request: Request) {
  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return NextResponse.json({ message: "JSON inválido." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const profileType = body.profileType ?? "";

  if (!name || !email || !PROFILE_TYPES.has(profileType)) {
    return NextResponse.json(
      { message: "Campos obrigatórios inválidos." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: "Informe um e-mail válido." },
      { status: 400 },
    );
  }

  if (!body.lgpdConsent) {
    return NextResponse.json(
      { message: "Consentimento LGPD obrigatório." },
      { status: 400 },
    );
  }

  // TODO: persist to waitlist_entries (Postgres) — Phase 1 follow-up
  console.info("[waitlist] lead received", {
    name,
    email,
    profileType,
    city: body.city ?? null,
    state: body.state ?? null,
    lgpdConsentAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
