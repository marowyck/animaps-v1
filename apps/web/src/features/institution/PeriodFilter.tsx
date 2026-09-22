"use client";

import type { AnalyticsPeriod } from "./analytics";

type PeriodFilterProps = {
  value: AnalyticsPeriod;
  onChange: (value: AnalyticsPeriod) => void;
  labels: Record<AnalyticsPeriod, string>;
  ariaLabel: string;
};

const ORDER: AnalyticsPeriod[] = ["7d", "30d", "90d", "all"];

export function PeriodFilter({
  value,
  onChange,
  labels,
  ariaLabel,
}: PeriodFilterProps) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-2xl border-2 border-border-soft bg-white p-1"
      role="group"
      aria-label={ariaLabel}
    >
      {ORDER.map((id) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={[
              "rounded-xl px-3 py-1.5 text-xs font-bold transition-colors",
              selected
                ? "bg-brand-green text-white"
                : "text-ink-muted hover:bg-pastel-green/40 hover:text-ink",
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
