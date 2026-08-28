"use client";

import { Button } from "@/components/Button";
import {
  LOCALES,
  LOCALE_LABELS,
  useLocale,
  useT,
  type Locale,
} from "@/i18n";

type LocaleSwitcherProps = {
  tone?: "light" | "dark";
  className?: string;
  /** Overrides default i18n aria label. */
  "aria-label"?: string;
};

export function LocaleSwitcher({
  tone = "light",
  className = "",
  "aria-label": ariaLabel,
}: LocaleSwitcherProps) {
  const t = useT();
  const { locale, setLocale } = useLocale();

  const shell =
    tone === "dark"
      ? "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1"
      : "flex items-center gap-1 rounded-full bg-gray-soft/80 p-1";

  return (
    <div
      className={`${shell} ${className}`.trim()}
      role="group"
      aria-label={ariaLabel ?? t.nav.languageAria}
    >
      {LOCALES.map((code: Locale) => {
        const active = locale === code;
        return (
          <Button
            key={code}
            type="button"
            variant="segment"
            tone={tone}
            size="xs"
            selected={active}
            aria-pressed={active}
            magnetic={false}
            className="flex-1"
            onClick={() => setLocale(code)}
          >
            {LOCALE_LABELS[code]}
          </Button>
        );
      })}
    </div>
  );
}
