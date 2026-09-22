"use client";

type BarListProps = {
  items: { key: string; label: string; count: number }[];
  empty: string;
  className?: string;
};

/** Simple horizontal bar chart — no external chart lib. */
export function BarList({ items, empty, className = "" }: BarListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border-soft bg-white px-3 py-6 text-center text-sm text-ink-muted">
        {empty}
      </p>
    );
  }

  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <ul className={`space-y-2 ${className}`.trim()}>
      {items.map((item) => {
        const pct = Math.max((item.count / max) * 100, item.count > 0 ? 4 : 0);
        return (
          <li key={item.key} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="min-w-0 truncate font-semibold text-ink">
                {item.label}
              </span>
              <span className="shrink-0 tabular-nums font-bold text-ink-muted">
                {item.count}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-soft">
              <div
                className="h-full rounded-full bg-brand-green transition-[width] duration-300"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
