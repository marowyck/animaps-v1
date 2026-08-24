"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Checkbox } from "@/components/Checkbox";
import { submitWaitlist } from "./submitWaitlist";
import type { ProfileType, WaitlistFormState } from "./types";
import {
  PROFILE_OPTIONS,
  validateWaitlistFormClient,
} from "./validation";

const INITIAL: WaitlistFormState = {
  name: "",
  email: "",
  profileType: "",
  city: "",
  state: "",
  lgpdConsent: false,
};

export function WaitlistForm() {
  const [form, setForm] = useState<WaitlistFormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const clientError = validateWaitlistFormClient(form);
    if (clientError) {
      setErrorMsg(clientError);
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
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado.");
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
          label="Nome"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          className="sm:col-span-2"
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <Select
          className="sm:col-span-2"
          label="Eu sou"
          name="profileType"
          options={[...PROFILE_OPTIONS]}
          value={form.profileType}
          onChange={(v) =>
            setForm({ ...form, profileType: v as ProfileType | "" })
          }
          required
        />

        <Input
          label="Cidade"
          name="city"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <Input
          label="Estado"
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
            Li e aceito a{" "}
            <a
              href="#privacidade"
              className="font-bold underline underline-offset-2"
            >
              política de privacidade
            </a>{" "}
            (coleta de nome, e-mail e tipo de perfil para a lista de espera).
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
          Você entrou na lista. Em breve falamos com você.
        </p>
      ) : null}

      <div className="mt-6">
        <Button
          type="submit"
          disabled={status === "loading"}
          variant="orange"
          magnetic={false}
        >
          {status === "loading" ? "Enviando…" : "Entrar na lista de espera"}
        </Button>
      </div>
    </form>
  );
}
