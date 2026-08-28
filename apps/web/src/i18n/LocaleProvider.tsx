"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  HTML_LANG,
  readStoredLocale,
  writeStoredLocale,
  type Locale,
} from "./locales";
import type { Messages } from "./types";
import { pt } from "./messages/pt";
import { en } from "./messages/en";
import { es } from "./messages/es";

const CATALOG: Record<Locale, Messages> = { pt, en, es };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyDocumentLocale(locale: Locale, messages: Messages) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = HTML_LANG[locale];
  document.title = messages.meta.title;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale();
    const next = stored ?? detectBrowserLocale();
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate locale after mount */
    setLocaleState(next);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    applyDocumentLocale(next, CATALOG[next]);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStoredLocale(next);
    applyDocumentLocale(next, CATALOG[next]);
  }, []);

  const messages = CATALOG[locale];

  const value = useMemo(
    () => ({ locale, setLocale, messages }),
    [locale, setLocale, messages],
  );

  // Avoid flashing wrong language before storage/browser detection.
  if (!ready) {
    return (
      <LocaleContext.Provider
        value={{ locale: DEFAULT_LOCALE, setLocale, messages: pt }}
      >
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useMessages() {
  return useLocale().messages;
}

/** Convenience alias used by sections. */
export function useT() {
  return useMessages();
}
