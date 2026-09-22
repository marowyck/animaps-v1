import { HTML_LANG, type Locale } from "./locales";

export function formatDateTime(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(HTML_LANG[locale]);
}
