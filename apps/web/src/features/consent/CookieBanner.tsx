"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useT } from "@/i18n";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentValue,
} from "./storage";

export function CookieBanner() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Client-only: localStorage is unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate consent visibility after mount
    if (!readCookieConsent()) setVisible(true);
  }, []);

  function choose(value: CookieConsentValue) {
    writeCookieConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t.cookies.aria}
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-lg rounded-[2rem] border-2 border-border-soft bg-white p-5 shadow-xl md:inset-x-auto md:right-6 md:bottom-6"
    >
      <p className="text-sm font-bold text-ink-muted">
        {t.cookies.body}{" "}
        <a href="/#privacy" className="underline underline-offset-2">
          {t.cookies.learnMore}
        </a>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="pink"
          size="sm"
          magnetic={false}
          onClick={() => choose("accepted")}
        >
          {t.cookies.accept}
        </Button>
        <Button
          type="button"
          variant="white"
          size="sm"
          magnetic={false}
          onClick={() => choose("rejected")}
        >
          {t.cookies.reject}
        </Button>
      </div>
    </div>
  );
}
