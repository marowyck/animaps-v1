"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { UserTypeSelector } from "@/features/onboarding";
import type { PublicUserType } from "@/features/user-types";
import { submitWaitlist } from "./submitWaitlist";
import type { WaitlistFormState } from "./types";
import { validateWaitlistFormClient } from "./validation";

const INITIAL: WaitlistFormState = {
  name: "",
  email: "",
  profileType: "",
  city: "",
  state: "",
  lgpdConsent: false,
};

export function WaitlistForm({
  embedded = false,
  initialValues,
  onContinue,
  submitLabel,
}: {
  /** When true, omit outer card chrome (used inside AuthSplitLayout). */
  embedded?: boolean;
  /** Prefill when remounting (e.g. register step 1 after going back). */
  initialValues?: WaitlistFormState;
  /**
   * When set, validated form data is handed off instead of calling the waitlist API
   * (multi-step register).
   */
  onContinue?: (form: WaitlistFormState) => void;
  /** Override primary button label (defaults to form.submit / form.submitting). */
  submitLabel?: string;
}) {
  const t = useT();
  const { toast } = useToast();
  const [form, setForm] = useState<WaitlistFormState>(
    initialValues ?? INITIAL,
  );
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const clientError = validateWaitlistFormClient(form);
    if (clientError) {
      toast({ message: t.form.errors[clientError], tone: "error" });
      return;
    }

    if (onContinue) {
      onContinue(form);
      return;
    }

    setStatus("loading");
    try {
      await submitWaitlist(form);
      toast({ message: t.form.success, tone: "success" });
      setForm(INITIAL);
    } catch (err) {
      toast({
        message:
          err instanceof Error ? err.message : t.form.unexpectedError,
        tone: "error",
      });
    } finally {
      setStatus("idle");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        embedded
          ? "overflow-visible"
          : "overflow-visible rounded-[2.5rem] border-2 border-border-soft bg-white p-6 shadow-sm md:col-span-7 md:p-8"
      }
      noValidate
    >
      <div
        className={`grid overflow-visible ${embedded ? "grid-cols-2 gap-2.5" : "gap-5 sm:grid-cols-2"}`}
      >
        <Input
          className="col-span-2"
          compact={embedded}
          label={t.form.name}
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          className="col-span-2"
          compact={embedded}
          label={t.form.email}
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <div className="col-span-2 space-y-1.5">
          <p className="text-xs font-bold text-ink">{t.form.profileType}</p>
          <UserTypeSelector
            compact={embedded}
            value={form.profileType}
            onChange={(v: PublicUserType) =>
              setForm({ ...form, profileType: v })
            }
          />
        </div>

        <Input
          compact={embedded}
          label={t.form.city}
          name="city"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <Input
          compact={embedded}
          label={t.form.state}
          name="state"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
      </div>

      <Checkbox
        className={`${embedded ? "mt-3 text-xs leading-snug" : "mt-5"}`}
        name="lgpdConsent"
        checked={form.lgpdConsent}
        onChange={(e) => setForm({ ...form, lgpdConsent: e.target.checked })}
        required
        label={
          <>
            {t.form.privacyBefore}{" "}
            <Link
              href="/#privacy"
              className="font-bold underline underline-offset-2"
            >
              {t.form.privacyLink}
            </Link>{" "}
            {t.form.privacyAfter}
          </>
        }
      />

      <div
        className={`${embedded ? "mt-3" : "mt-6"} ${embedded ? "w-full [&>a]:w-full [&>button]:w-full" : ""}`}
      >
        <Button
          type="submit"
          disabled={status === "loading"}
          variant="pink"
          size={embedded ? "sm" : "md"}
          magnetic={false}
          className={embedded ? "!w-full !min-w-0" : ""}
        >
          {status === "loading"
            ? t.form.submitting
            : (submitLabel ?? t.form.submit)}
        </Button>
      </div>
    </form>
  );
}
