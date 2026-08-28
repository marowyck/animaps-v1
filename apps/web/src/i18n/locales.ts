export const LOCALES = ["pt", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

export const LOCALE_STORAGE_KEY = "animaps-locale";

export const HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
};

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

/** Full language names for dropdown menus (extensible as locales grow). */
export const LOCALE_NAMES: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** First visit: browser language → locale. */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore quota / private mode */
  }
}
