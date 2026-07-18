"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { SectionDivider } from "./SectionDivider";

type ProfileType = "guardian" | "ngo" | "clinic" | "other";

type FormState = {
  name: string;
  email: string;
  profileType: ProfileType | "";
  city: string;
  state: string;
  lgpdConsent: boolean;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  profileType: "",
  city: "",
  state: "",
  lgpdConsent: false,
};

const PROFILE_OPTIONS = [
  { value: "guardian", label: "Tutor / quero adotar" },
  { value: "ngo", label: "ONG" },
  { value: "clinic", label: "Clínica veterinária" },
  { value: "other", label: "Outro" },
];

export function WaitlistForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.profileType) {
      setErrorMsg("Preencha nome, e-mail e tipo de perfil.");
      setStatus("error");
      return;
    }
    if (!form.lgpdConsent) {
      setErrorMsg("É necessário aceitar a política de privacidade.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(
          data.message || "Não foi possível enviar. Tente de novo.",
        );
      }
      setStatus("ok");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  return (
    <section
      id="lista"
      className="relative z-10 overflow-visible bg-gray-soft px-4 py-24 md:py-28"
    >
      <SectionDivider fill="var(--pastel-yellow)" position="top" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 overflow-visible pt-12 md:grid-cols-12 md:pt-16">
        <div className="md:col-span-5">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-brand-orange">
            Lista de espera
          </p>
          <h2 className="font-display text-4xl leading-tight text-ink md:text-5xl">
            Entre na lista.{" "}
            <span className="text-brand-orange">A gente te avisa.</span>
          </h2>
          <p className="mt-5 text-lg font-bold text-ink-muted">
            {/* TODO copy */}
            Cadastro rápido — sem senha e sem documentos nesta fase.
          </p>
        </div>

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
              options={PROFILE_OPTIONS}
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
            onChange={(e) =>
              setForm({ ...form, lgpdConsent: e.target.checked })
            }
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
      </div>
    </section>
  );
}
