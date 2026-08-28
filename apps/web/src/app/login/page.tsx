"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/components/Button";
import { ClickSpark } from "@/components/bits";
import { CookieBanner } from "@/features/consent";
import { Footer, Header } from "@/features/landing";
import { useT } from "@/i18n";

export default function LoginPage() {
  const t = useT();

  return (
    <ClickSpark sparkColor="#e07a96" sparkSize={10} sparkRadius={18} sparkCount={9}>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-16 md:pt-32 md:pb-24">
        <section className="w-full max-w-lg rounded-[2rem] border-2 border-border-soft bg-white p-8 shadow-sm md:p-10">
          <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-pastel-green text-brand-green">
            <LogIn size={22} aria-hidden />
          </div>
          <h1 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
            {t.login.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            {t.login.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/register" variant="pink" size="sm" magnetic={false}>
              {t.login.ctaRegister}
            </Button>
            <Button href="/#top" variant="white" size="sm" magnetic={false}>
              {t.login.ctaHome}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </ClickSpark>
  );
}
