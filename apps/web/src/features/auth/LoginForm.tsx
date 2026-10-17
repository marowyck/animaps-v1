"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";
import { useOnboarding } from "@/features/onboarding";
import { useT } from "@/i18n";
import { AuthDivider } from "./AuthDivider";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function LoginForm() {
  const t = useT();
  const { toast } = useToast();
  const router = useRouter();
  const { patch } = useOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast({ message: t.auth.login.soon, tone: "info" });
      return;
    }
    // Frontend-only: password is not checked. The next screen is a demo code.
    patch({ email: email.trim() });
    toast({ message: t.auth.login.preview, tone: "info" });
    router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
  }

  return (
    <div className="flex w-full flex-col py-2">
      <div data-enter>
        <h1 className="text-h2 text-text">{t.auth.login.title}</h1>
        <p className="text-body-sm mt-2 text-text-secondary">{t.auth.login.subtitle}</p>
      </div>

      <form data-enter onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Input
          label={t.auth.login.email}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
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

        <Button type="submit" variant="primary" magnetic={false} className="mt-2 w-full">
          {t.auth.login.submit}
        </Button>
      </form>

      <div data-enter>
        <AuthDivider label={t.auth.or} />
        <GoogleAuthButton compact />
        <p className="text-body-sm mt-6 text-center text-text-secondary">
          {t.auth.login.noAccount}{" "}
          <a
            href="/register"
            className="font-semibold text-primary-ink underline-offset-2 hover:underline"
          >
            {t.auth.login.registerLink}
          </a>
        </p>
      </div>
    </div>
  );
}
