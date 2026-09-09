"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { CODE_INPUT_LENGTH, CodeInput } from "@/components/CodeInput";
import { IconButton } from "@/components/IconButton";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { useOnboarding } from "@/features/onboarding/OnboardingProvider";

const RESEND_COOLDOWN_SEC = 45;
/** Demo: accept any 6 digits except 000000; 123456 always works. */
const INVALID_DEMO = "000000";

type VerifyPhase =
  | "idle"
  | "validating"
  | "resending"
  | "success";

export function VerifyEmailForm() {
  const t = useT();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const { draft, patch } = useOnboarding();

  const email = useMemo(() => {
    const fromQuery = params.get("email")?.trim();
    if (fromQuery) return fromQuery;
    if (draft.email) return draft.email;
    return "usuario@email.com";
  }, [params, draft.email]);

  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<VerifyPhase>("idle");
  const [error, setError] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  useEffect(() => {
    patch({ email });
  }, [email, patch]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const mockVerify = useCallback(async (value: string) => {
    await new Promise((r) => setTimeout(r, 700));
    if (value === INVALID_DEMO) return { ok: false as const, reason: "invalid" as const };
    if (value.length !== CODE_INPUT_LENGTH) {
      return { ok: false as const, reason: "incomplete" as const };
    }
    return { ok: true as const };
  }, []);

  const onContinue = async () => {
    if (code.length < CODE_INPUT_LENGTH) {
      setError(true);
      toast({ message: t.auth.verifyEmail.incomplete, tone: "error" });
      return;
    }
    setPhase("validating");
    setError(false);
    const result = await mockVerify(code);
    if (!result.ok) {
      setPhase("idle");
      setError(true);
      toast({
        message:
          result.reason === "incomplete"
            ? t.auth.verifyEmail.incomplete
            : t.auth.verifyEmail.invalid,
        tone: "error",
      });
      return;
    }
    setPhase("success");
    toast({ message: t.auth.verifyEmail.success, tone: "success" });
    router.push("/onboarding/guidelines");
  };

  const onResend = async () => {
    if (cooldown > 0 || phase === "resending") return;
    setPhase("resending");
    await new Promise((r) => setTimeout(r, 600));
    setCooldown(RESEND_COOLDOWN_SEC);
    setPhase("idle");
    setCode("");
    setError(false);
    toast({ message: t.auth.verifyEmail.resent, tone: "info" });
  };

  const subtitle = t.auth.verifyEmail.subtitle.replace("{email}", email);

  return (
    <div className="relative flex min-h-dvh w-full flex-col px-4 animate-fade-in-up">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-6">
        <IconButton label={t.auth.verifyEmail.back} onClick={() => router.push("/login")}>
          <ArrowLeft className="size-5" aria-hidden />
        </IconButton>
        <span className="font-display text-lg text-ink">ANIMAPS</span>
        <IconButton label={t.auth.verifyEmail.close} onClick={() => router.push("/")}>
          <X className="size-5" aria-hidden />
        </IconButton>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center py-20">
        <div className="mb-8 w-full space-y-2 text-center">
          <h1 className="font-display text-3xl text-ink">{t.auth.verifyEmail.title}</h1>
          <p className="text-base text-ink-muted">
            {subtitle.split(email).map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <strong className="font-bold text-ink">{email}</strong>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
          <p className="text-sm text-ink-muted">{t.auth.verifyEmail.expires}</p>
        </div>

        <CodeInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(false);
          }}
          error={error}
          disabled={phase === "validating" || phase === "success"}
          label={t.auth.verifyEmail.codeLabel}
        />

        <div className="mt-8 w-full space-y-3">
          <Button
            variant="pink"
            size="md"
            className="w-full"
            disabled={code.length < CODE_INPUT_LENGTH || phase === "validating"}
            onClick={onContinue}
          >
            {phase === "validating"
              ? t.onboarding.loading
              : t.auth.verifyEmail.continue}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            disabled={cooldown > 0 || phase === "resending"}
            onClick={onResend}
          >
            {phase === "resending"
              ? t.auth.verifyEmail.resending
              : cooldown > 0
                ? t.auth.verifyEmail.resendIn.replace("{seconds}", String(cooldown))
                : t.auth.verifyEmail.resend}
          </Button>
        </div>
      </div>
    </div>
  );
}
