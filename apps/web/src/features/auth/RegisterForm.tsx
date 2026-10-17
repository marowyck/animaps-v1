"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { WaitlistForm, type WaitlistFormState } from "@/features/waitlist";
import { submitWaitlist } from "@/features/waitlist/submitWaitlist";
import { mapSignupOption, useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { AuthDivider } from "./AuthDivider";
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
  const router = useRouter();
  const { patch } = useOnboarding();
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
      const account = profile.accountOption
        ? mapSignupOption(profile.accountOption)
        : null;
      patch({
        email: profile.email,
        displayName: profile.name,
        userType: profile.profileType || account?.userType || "PERSON",
        accountType: account?.accountType ?? null,
        organizationType: profile.organizationType || null,
        institutionTypeId: profile.institutionTypeId || null,
      });
      toast({ message: t.form.success, tone: "success" });
      const email = encodeURIComponent(profile.email);
      router.push(`/verify-email?email=${email}`);
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
    <div className="flex w-full flex-col py-2">
      <div data-enter>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-h2 min-w-0 flex-1 text-text">
            {step === 1 ? t.auth.register.title : t.auth.register.step2Title}
          </h1>
          <span
            className="mt-1.5 inline-flex shrink-0 items-center rounded-full bg-secondary-soft px-2.5 py-1 text-caption font-semibold tabular-nums text-secondary-ink"
            aria-label={stepLabel}
            aria-live="polite"
          >
            {step}/2
          </span>
        </div>
        <p className="text-body-sm mt-2 text-text-secondary">
          {step === 1
            ? t.auth.register.subtitle
            : t.auth.register.step2Subtitle}
        </p>
      </div>

      {step === 1 ? (
        <div key="profile" className="animate-enter-from-start">
          <div className="mt-5">
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

          <AuthDivider label={t.auth.or} />

          <GoogleAuthButton compact />
        </div>
      ) : (
        <form
          key="password"
          onSubmit={onPasswordSubmit}
          className="animate-enter-from-start mt-5 flex flex-col gap-4"
          noValidate
        >
          <Input
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

          <ul className="space-y-1.5" aria-label={t.auth.register.passwordHint}>
            {rules.map((rule) => (
              <li
                key={rule.id}
                className={`flex items-center gap-2 text-caption font-semibold transition-colors duration-(--duration-base) ${
                  rule.ok ? "text-success-ink" : "text-text-muted"
                }`}
              >
                <span
                  className={`inline-block size-1.5 shrink-0 rounded-full transition-[background-color,scale] duration-(--duration-base) ${
                    rule.ok ? "scale-125 bg-success" : "bg-border"
                  }`}
                  aria-hidden
                />
                {ruleLabel(rule.id)}
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-col gap-2">
            <Button
              type="submit"
              disabled={submitting}
              loading={submitting}
              variant="primary"
              magnetic={false}
              className="w-full"
            >
              {submitting ? t.form.submitting : t.form.submit}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              magnetic={false}
              className="w-full"
              onClick={() => setStep(1)}
            >
              {t.auth.register.back}
            </Button>
          </div>
        </form>
      )}

      <p className="text-body-sm mt-6 text-center text-text-secondary">
        {t.auth.register.hasAccount}{" "}
        <a
          href="/login"
          className="font-semibold text-primary-ink underline-offset-2 hover:underline"
        >
          {t.auth.register.loginLink}
        </a>
      </p>
    </div>
  );
}
