"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Checkbox } from "@/components/Checkbox";
import { useT } from "@/i18n";
import { submitWaitlist } from "./submitWaitlist";
import type { ProfileType, WaitlistFormState } from "./types";
import { validateWaitlistFormClient } from "./validation";

const INITIAL: WaitlistFormState = {
  name: "",
  email: "",
  profileType: "",
  city: "",
  state: "",
  lgpdConsent: false,
};

export function WaitlistForm() {
  const t = useT();
  const [form, setForm] = useState<WaitlistFormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const profileOptions = useMemo(
    () =>
      [
        { value: "guardian", label: t.form.profiles.guardian },
        { value: "ngo", label: t.form.profiles.ngo },
        { value: "clinic", label: t.form.profiles.clinic },
        { value: "other", label: t.form.profiles.other },
      ] as const,
    [t],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const clientError = validateWaitlistFormClient(form);
    if (clientError) {
      setErrorMsg(t.form.errors[clientError]);
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await submitWaitlist(form);
      setStatus("ok");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : t.form.unexpectedError,
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="overflow-visible rounded-[2.5rem] border-2 border-border-soft bg-white p-6 shadow-sm md:col-span-7 md:p-8"
      noValidate
    >
      <div className="grid gap-5 overflow-visible sm:grid-cols-2">
        <Input
          className="sm:col-span-2"
          label={t.form.name}
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          className="sm:col-span-2"
          label={t.form.email}
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <Select
          className="sm:col-span-2"
          label={t.form.profileType}
          name="profileType"
          options={[...profileOptions]}
          value={form.profileType}
          onChange={(v) =>
            setForm({ ...form, profileType: v as ProfileType | "" })
          }
          required
        />

        <Input
          label={t.form.city}
          name="city"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <Input
          label={t.form.state}
          name="state"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
      </div>

      <Checkbox
        className="mt-5"
        name="lgpdConsent"
        checked={form.lgpdConsent}
        onChange={(e) => setForm({ ...form, lgpdConsent: e.target.checked })}
        required
        label={
          <>
            {t.form.privacyBefore}{" "}
            <a
              href="/#privacy"
              className="font-bold underline underline-offset-2"
            >
              {t.form.privacyLink}
            </a>{" "}
            {t.form.privacyAfter}
          </>
        }
      />

      {status === "error" && errorMsg ? (
        <p className="mt-4 text-sm font-bold text-red-500" role="alert">
          {errorMsg}
        </p>
      ) : null}
      {status === "ok" ? (
        <p className="mt-4 text-sm font-bold text-brand-green" role="status">
          {t.form.success}
        </p>
      ) : null}

      <div className="mt-6">
        <Button
          type="submit"
          disabled={status === "loading"}
          variant="pink"
          magnetic={false}
        >
          {status === "loading" ? t.form.submitting : t.form.submit}
        </Button>
      </div>
    </form>
  );
}
