"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function LoginForm() {
  const t = useT();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    toast({ message: t.auth.login.soon, tone: "info" });
  }

  return (
    <div className="flex min-h-0 flex-col">
      <h1 className="font-display shrink-0 text-2xl tracking-tight text-ink lg:text-[1.65rem]">
        {t.auth.login.title}
      </h1>
      <p className="mt-1 shrink-0 text-xs leading-snug text-ink-muted line-clamp-2">
        {t.auth.login.subtitle}
      </p>

      <form onSubmit={onSubmit} className="mt-3 space-y-3" noValidate>
        <Input
          compact
          label={t.auth.login.email}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          compact
          revealable
          revealLabel={t.auth.showPassword}
          hideLabel={t.auth.hidePassword}
          label={t.auth.login.password}
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="pink"
          size="sm"
          magnetic={false}
          className="!w-full !min-w-0"
        >
          {t.auth.login.submit}
        </Button>
      </form>

      <div className="my-3 flex shrink-0 items-center gap-3">
        <span className="h-px flex-1 bg-border-soft" aria-hidden />
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted">
          {t.auth.or}
        </span>
        <span className="h-px flex-1 bg-border-soft" aria-hidden />
      </div>

      <GoogleAuthButton compact />

      <p className="mt-3 shrink-0 text-center text-xs font-semibold text-ink-muted">
        {t.auth.login.noAccount}{" "}
        <a
          href="/register"
          className="cursor-pointer font-bold text-brand-pink underline-offset-2 hover:underline"
        >
          {t.auth.login.registerLink}
        </a>
      </p>
    </div>
  );
}
