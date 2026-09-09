import type { WaitlistFormState } from "./types";
import { toDbProfileType } from "./types";
import type { PublicUserType } from "@/features/user-types";

export async function submitWaitlist(form: WaitlistFormState): Promise<void> {
  const profileType =
    form.profileType && form.profileType.length > 0
      ? toDbProfileType(form.profileType as PublicUserType)
      : form.profileType;

  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      profileType,
    }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(data.message || "Não foi possível enviar. Tente de novo.");
  }
}
