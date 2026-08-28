"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { Button } from "@/components/Button";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_NAMES,
  useLocale,
  useT,
  type Locale,
} from "@/i18n";

type LocaleSwitcherProps = {
  tone?: "light" | "dark";
  /**
   * `pills` — compact PT|EN|ES segments (footer).
   * `menu` — “Languages” + icon trigger with a dropdown (auth / extensible).
   */
  variant?: "pills" | "menu";
  className?: string;
  "aria-label"?: string;
};

export function LocaleSwitcher({
  tone = "light",
  variant = "pills",
  className = "",
  "aria-label": ariaLabel,
}: LocaleSwitcherProps) {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target || rootRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (variant === "menu") {
    const trigger =
      tone === "dark"
        ? "inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-soft bg-gray-soft/80 px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-white";

    const panel =
      tone === "dark"
        ? "absolute right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-2xl border border-white/15 bg-[#1a1214] p-1.5 shadow-xl"
        : "absolute right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-2xl border border-border-soft bg-white p-1.5 shadow-xl";

    return (
      <div ref={rootRef} className={`relative ${className}`.trim()}>
        <button
          type="button"
          className={trigger}
          aria-label={ariaLabel ?? t.nav.languageAria}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{t.nav.language}</span>
          <Languages size={16} aria-hidden />
        </button>

        {open ? (
          <ul
            id={listId}
            role="listbox"
            aria-label={ariaLabel ?? t.nav.languageAria}
            className={panel}
          >
            {LOCALES.map((code: Locale) => {
              const active = locale === code;
              return (
                <li key={code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      tone === "dark"
                        ? active
                          ? "bg-brand-pink text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                        : active
                          ? "bg-pastel-pink text-brand-pink"
                          : "text-ink hover:bg-gray-soft"
                    }`}
                    onClick={() => {
                      setLocale(code);
                      setOpen(false);
                    }}
                  >
                    <span>
                      {LOCALE_NAMES[code]}
                      <span className="ml-1.5 text-xs opacity-60">
                        {LOCALE_LABELS[code]}
                      </span>
                    </span>
                    {active ? <Check size={16} aria-hidden /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }

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
