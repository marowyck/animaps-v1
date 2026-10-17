"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatDateTime, useLocale } from "@/i18n";
import { DISTANCE, DURATION, EASE, STAGGER } from "@/lib/motion";

export function StatusPill({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  return (
    <span className="inline-flex flex-col rounded-full bg-secondary-soft px-3 py-1.5">
      <span className="text-caption font-semibold text-secondary-ink">
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
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const rows = listRef.current?.children;
      if (reduced || !rows?.length) return;
      gsap.fromTo(
        rows,
        { y: DISTANCE.small, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.enter,
          delay: 0.15,
          stagger: STAGGER,
          ease: EASE.settle,
          clearProps: "transform",
        },
      );
    },
    { scope: listRef, dependencies: [reduced, items.length] },
  );

  if (items.length === 0) {
    return <p className="text-body-sm text-text-secondary">{empty}</p>;
  }
  return (
    <ol ref={listRef} className="relative">
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
          {index < items.length - 1 ? (
            <span
              className="absolute top-4 bottom-0 left-[0.3125rem] w-0.5 rounded-full bg-primary-soft"
              aria-hidden
            />
          ) : null}
          <span
            className={`relative mt-1.5 size-3 shrink-0 rounded-full ring-4 ring-background ${
              index === 0 ? "bg-primary" : "bg-primary/40"
            }`}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
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
