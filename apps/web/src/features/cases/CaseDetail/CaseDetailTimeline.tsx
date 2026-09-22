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
    <span className="inline-flex flex-col rounded-full bg-secondary-soft px-3 py-1.5">
      <span className="text-caption font-semibold text-(--lilac-700)">
        {label}
      </span>
      <span className="text-body-sm font-semibold text-text">{children}</span>
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
    return <p className="text-body-sm text-text-secondary">{empty}</p>;
  }
  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className="mt-1 h-auto w-1.5 shrink-0 self-stretch rounded-full bg-primary" aria-hidden />
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex justify-between gap-2">
              <span className="text-body-sm font-semibold text-text">{item.title}</span>
              <time
                dateTime={item.at}
                className="text-caption tabular-nums text-text-muted"
              >
                {formatDateTime(item.at, locale)}
              </time>
            </div>
            {item.body ? (
              <p className="mt-0.5 text-body-sm text-text-secondary">{item.body}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
