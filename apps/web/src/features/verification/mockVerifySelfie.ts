import type { SelfieVerificationStatus } from "@/features/onboarding/types";

/** Simulated selfie pipeline — replace with provider upload + webhook later. */
export async function mockVerifySelfie(
  _file: File | null,
): Promise<SelfieVerificationStatus> {
  await new Promise((r) => setTimeout(r, 1800));
  // Deterministic-ish demo: prefer approved; use filename hint for QA.
  const name = _file?.name?.toLowerCase() ?? "";
  if (name.includes("reject")) return "rejected";
  if (name.includes("retry")) return "retry_required";
  return "approved";
}
