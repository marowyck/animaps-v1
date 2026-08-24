import { NextResponse } from "next/server";
import { parseWaitlistBody, type WaitlistBody } from "@/features/waitlist";

export async function POST(request: Request) {
  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return NextResponse.json({ message: "JSON inválido." }, { status: 400 });
  }

  const result = parseWaitlistBody(body);
  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  // TODO: persist via apps/api marketing module — Wave 2
  console.info("[waitlist] lead received", result.lead);

  return NextResponse.json({ ok: true }, { status: 201 });
}
