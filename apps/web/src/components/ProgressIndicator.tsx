"use client";

type ProgressIndicatorProps = {
  current: number;
  total: number;
  label?: string;
  className?: string;
};

export function ProgressIndicator({
  current,
  total,
  label,
  className = "",
}: ProgressIndicatorProps) {
  const safeTotal = Math.max(total, 1);
  const clamped = Math.min(Math.max(current, 0), safeTotal);
  const pct = Math.round((clamped / safeTotal) * 100);

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-ink-muted">
        <span>{label ?? `Step ${clamped} of ${safeTotal}`}</span>
        <span aria-hidden>{pct}%</span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-border-soft"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-label={label ?? `Step ${clamped} of ${safeTotal}`}
      >
        <div
          className="h-full rounded-full bg-brand-pink transition-[width] duration-500 ease-out shadow-[0_0_8px_rgba(224,122,150,0.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
