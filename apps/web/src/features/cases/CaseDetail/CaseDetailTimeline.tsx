"use client";

import { formatDateTime, useLocale } from "@/i18n";

export function StatusPill({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  return (
    <span className="inline-flex flex-col rounded-2xl border border-border-soft bg-gray-soft px-3 py-1.5">
      <span className="text-[0.65rem] font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      <span className="text-sm font-bold text-ink">{children}</span>
    </span>
  );
}

export type TimelineItem = {
  id: string;
  title: string;
  body: string;
  at: string;
};

export function CaseDetailTimeline({
  items,
  empty,
}: {
  items: TimelineItem[];
  empty: string;
}) {
  const { locale } = useLocale();
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border-soft bg-white px-3 py-4 text-sm text-ink-muted">
        {empty}
      </p>
    );
  }
  return (
    <ol className="space-y-2 rounded-2xl border border-border-soft bg-white p-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="border-b border-border-soft/60 pb-2 last:border-0 last:pb-0"
        >
          <div className="flex justify-between gap-2">
            <span className="text-sm font-bold text-ink">{item.title}</span>
            <time className="text-[0.65rem] tabular-nums text-ink-muted">
              {formatDateTime(item.at, locale)}
            </time>
          </div>
          {item.body ? (
            <p className="mt-0.5 text-sm text-ink-muted">{item.body}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
