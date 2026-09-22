"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { CODE_INPUT_LENGTH, CodeInput } from "@/components/CodeInput";
import { useToast } from "@/components/Toast";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";

const RESEND_COOLDOWN_SEC = 45;
/** Demo: accept any 6 digits except 000000. */
const INVALID_DEMO = "000000";

type VerifyPhase = "idle" | "validating" | "resending" | "success";

export function VerifyEmailForm() {
  const t = useT();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const { draft } = useOnboarding();

  const email = useMemo(() => {
    const fromQuery = params.get("email")?.trim();
    if (fromQuery) return fromQuery;
    return draft.email?.trim() || "";
  }, [params, draft.email]);

  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<VerifyPhase>("idle");
  const [error, setError] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const mockVerify = useCallback(async (value: string) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (value === INVALID_DEMO) return { ok: false as const, reason: "invalid" as const };
    if (value.length !== CODE_INPUT_LENGTH) {
      return { ok: false as const, reason: "incomplete" as const };
    }
    return { ok: true as const };
  }, []);

  const onContinue = async () => {
    if (phase === "validating" || phase === "success") return;
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

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void onContinue();
  };

  const onResend = async () => {
    if (cooldown > 0 || phase === "resending") return;
    setPhase("resending");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCooldown(RESEND_COOLDOWN_SEC);
    setPhase("idle");
    setCode("");
    setError(false);
    toast({ message: t.auth.verifyEmail.resent, tone: "info" });
  };

  if (!email) {
    return (
      <div className="flex w-full flex-col pb-2">
        <h1 className="font-display text-[1.35rem] leading-tight tracking-tight text-ink sm:text-2xl lg:text-[1.65rem]">
          {t.auth.verifyEmail.title}
        </h1>
        <p className="mt-2 text-body-sm text-ink-muted">
          {t.auth.verifyEmail.missingEmail}
        </p>
        <Button href="/login" variant="pink" size="sm" className="mt-6 !w-full !min-w-0">
          {t.auth.verifyEmail.missingCta}
        </Button>
      </div>
    );
  }

  const subtitle = t.auth.verifyEmail.subtitle.replace("{email}", email);

  return (
    <div className="flex w-full flex-col pb-2">
      <h1 className="font-display text-[1.35rem] leading-tight tracking-tight text-ink sm:text-2xl lg:text-[1.65rem]">
        {t.auth.verifyEmail.title}
      </h1>
      <p className="mt-1 text-xs leading-snug text-ink-muted">
        {subtitle.split(email).map((part, index, parts) =>
          index < parts.length - 1 ? (
            <span key={index}>
              {part}
              <strong className="font-bold text-ink">{email}</strong>
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </p>
      <p className="mt-2 text-caption text-ink-muted">{t.auth.verifyEmail.expires}</p>

      <form onSubmit={onSubmit} className="mt-5">
        <CodeInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setError(false);
          }}
          error={error}
          disabled={phase === "validating" || phase === "success"}
          label={t.auth.verifyEmail.codeLabel}
        />

        <div className="mt-6 w-full space-y-3">
          <Button
            type="submit"
            variant="pink"
            size="sm"
            magnetic={false}
            className="!w-full !min-w-0"
            disabled={code.length < CODE_INPUT_LENGTH || phase === "validating" || phase === "success"}
          >
            {phase === "validating" ? t.onboarding.loading : t.auth.verifyEmail.continue}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="!w-full"
            disabled={cooldown > 0 || phase === "resending"}
            onClick={() => void onResend()}
          >
            {phase === "resending"
              ? t.auth.verifyEmail.resending
              : cooldown > 0
                ? t.auth.verifyEmail.resendIn.replace("{seconds}", String(cooldown))
                : t.auth.verifyEmail.resend}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs font-semibold text-ink-muted">
        <a
          href="/login"
          className="font-bold text-brand-pink underline-offset-2 hover:underline"
        >
          {t.auth.verifyEmail.back}
        </a>
      </p>
    </div>
  );
}
