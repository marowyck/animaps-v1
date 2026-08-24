import type { WaitlistFormState } from "./types";

export async function submitWaitlist(form: WaitlistFormState): Promise<void> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(data.message || "Não foi possível enviar. Tente de novo.");
  }
}
