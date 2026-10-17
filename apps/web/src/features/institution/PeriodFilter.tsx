"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { AnalyticsPeriod } from "./analytics";

type PeriodFilterProps = {
  value: AnalyticsPeriod;
  onChange: (value: AnalyticsPeriod) => void;
  labels: Record<AnalyticsPeriod, string>;
  ariaLabel: string;
};

const ORDER: AnalyticsPeriod[] = ["7d", "30d", "90d", "all"];

/** Segmented control: one pill slides under the selected period. */
export function PeriodFilter({
  value,
  onChange,
  labels,
  ariaLabel,
}: PeriodFilterProps) {
  const buttons = useRef<Partial<Record<AnalyticsPeriod, HTMLButtonElement | null>>>({});
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = buttons.current[value];
      if (el) setThumb({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value, labels]);

  return (
    <div
      className="relative inline-flex rounded-full bg-surface p-1 shadow-sm"
      role="group"
      aria-label={ariaLabel}
    >
      {thumb ? (
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-0 rounded-full bg-success-soft transition-[translate,width] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none"
          style={{ width: thumb.w, translate: `${thumb.x}px 0` }}
        />
      ) : null}
      {ORDER.map((id) => {
        const selected = value === id;
        return (
          <button
            key={id}
            ref={(el) => {
              buttons.current[id] = el;
            }}
            type="button"
            onClick={() => onChange(id)}
            className={[
              "relative min-h-11 cursor-pointer rounded-full px-4 py-1.5 text-body-sm font-semibold transition-colors duration-(--duration-fast)",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected ? "text-success-ink" : "text-text-secondary hover:text-text",
            ].join(" ")}
            aria-pressed={selected}
          >
            {labels[id]}
          </button>
        );
      })}
    </div>
  );
}
