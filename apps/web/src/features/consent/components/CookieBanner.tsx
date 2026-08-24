"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentValue,
} from "../storage";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readCookieConsent();
    if (!stored) setVisible(true);
  }, []);

  function choose(value: CookieConsentValue) {
    writeCookieConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-lg rounded-[2rem] border-2 border-border-soft bg-white p-5 shadow-xl md:inset-x-auto md:right-6 md:bottom-6"
    >
      <p className="text-sm font-bold text-ink-muted">
        Usamos cookies essenciais e, com seu consentimento, analytics (GA4) para
        melhorar a experiência.{" "}
        <a href="#privacidade" className="underline underline-offset-2">
          Saiba mais
        </a>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="orange"
          magnetic={false}
          className="!px-5 !py-2.5 !text-sm"
          onClick={() => choose("accepted")}
        >
          Aceitar
        </Button>
        <Button
          type="button"
          variant="white"
          magnetic={false}
          className="!border-2 !px-5 !py-2.5 !text-sm"
          onClick={() => choose("rejected")}
        >
          Recusar não essenciais
        </Button>
      </div>
    </div>
  );
}
