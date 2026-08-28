"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { WaitlistForm, type WaitlistFormState } from "@/features/waitlist";
import { submitWaitlist } from "@/features/waitlist/submitWaitlist";
import { useT } from "@/i18n";
import { GoogleAuthButton } from "./GoogleAuthButton";
import {
  checkPasswordRules,
  type PasswordRuleId,
  validatePasswordStep,
} from "./passwordValidation";

type RegisterStep = 1 | 2;

export function RegisterForm() {
  const t = useT();
  const { toast } = useToast();
  const [step, setStep] = useState<RegisterStep>(1);
  const [profile, setProfile] = useState<WaitlistFormState | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const rules = checkPasswordRules(password);
  const ruleLabel = (id: PasswordRuleId) => t.auth.register.passwordRules[id];

  async function onPasswordSubmit(e: FormEvent) {
    e.preventDefault();

    const errorKey = validatePasswordStep(password, confirmPassword);
    if (errorKey) {
      toast({
        message: t.auth.register.errors[errorKey],
        tone: "error",
      });
      return;
    }

    if (!profile) {
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      // Password is validated client-side for the UX flow; waitlist API
      // still stores the lead only until real auth ships.
      await submitWaitlist(profile);
      toast({ message: t.form.success, tone: "success" });
      setPassword("");
      setConfirmPassword("");
      setProfile(null);
      setStep(1);
    } catch (err) {
      toast({
        message:
          err instanceof Error ? err.message : t.form.unexpectedError,
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabel = t.auth.register.stepOf
    .replace("{current}", String(step))
    .replace("{total}", "2");

  return (
    <div className="flex w-full flex-col pb-2">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <h1 className="font-display min-w-0 flex-1 text-[1.35rem] leading-tight tracking-tight text-ink sm:text-2xl lg:text-[1.65rem]">
          {step === 1 ? t.auth.register.title : t.auth.register.step2Title}
        </h1>
        <span
          className="mt-0.5 inline-flex shrink-0 items-center rounded-full border border-border-soft bg-gray-soft px-2.5 py-1 text-[0.7rem] font-bold tabular-nums tracking-tight text-ink-muted"
          aria-label={stepLabel}
          aria-live="polite"
        >
          {step}/2
        </span>
      </div>
      <p className="mt-1 shrink-0 text-xs leading-snug text-ink-muted sm:line-clamp-2">
        {step === 1
          ? t.auth.register.subtitle
          : t.auth.register.step2Subtitle}
      </p>

      {step === 1 ? (
        <>
          <div className="mt-3">
            <WaitlistForm
              embedded
              initialValues={profile ?? undefined}
              submitLabel={t.auth.register.continue}
              onContinue={(form) => {
                setProfile(form);
                setStep(2);
              }}
            />
          </div>

          <div className="my-3 flex shrink-0 items-center gap-3">
            <span className="h-px flex-1 bg-border-soft" aria-hidden />
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted">
              {t.auth.or}
            </span>
            <span className="h-px flex-1 bg-border-soft" aria-hidden />
          </div>

          <GoogleAuthButton compact />
        </>
      ) : (
        <form
          onSubmit={onPasswordSubmit}
          className="mt-3 flex flex-col gap-3"
          noValidate
        >
          <Input
            compact
            revealable
            revealLabel={t.auth.showPassword}
            hideLabel={t.auth.hidePassword}
            label={t.auth.register.password}
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            compact
            revealable
            revealLabel={t.auth.showPassword}
            hideLabel={t.auth.hidePassword}
            label={t.auth.register.confirmPassword}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <ul className="space-y-1" aria-label={t.auth.register.passwordHint}>
            {rules.map((rule) => (
              <li
                key={rule.id}
                className={`flex items-center gap-2 text-[0.7rem] font-semibold ${
                  rule.ok ? "text-brand-green" : "text-ink-muted"
                }`}
              >
                <span
                  className={`inline-block size-1.5 shrink-0 rounded-full ${
                    rule.ok ? "bg-brand-green" : "bg-border-soft"
                  }`}
                  aria-hidden
                />
                {ruleLabel(rule.id)}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={submitting}
              variant="pink"
              size="sm"
              magnetic={false}
              className="!w-full !min-w-0"
            >
              {submitting ? t.form.submitting : t.form.submit}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              magnetic={false}
              className="!w-full !min-w-0"
              onClick={() => setStep(1)}
            >
              {t.auth.register.back}
            </Button>
          </div>
        </form>
      )}

      <p className="mt-3 shrink-0 text-center text-xs font-semibold text-ink-muted">
        {t.auth.register.hasAccount}{" "}
        <a
          href="/login"
          className="cursor-pointer font-bold text-brand-pink underline-offset-2 hover:underline"
        >
          {t.auth.register.loginLink}
        </a>
      </p>
    </div>
  );
}
