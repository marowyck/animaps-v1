"use client";

import { useT } from "@/i18n";

export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={[
        "skeleton-shimmer block rounded-xl bg-background-secondary",
        className,
      ].join(" ")}
    />
  );
}

export function PageLoader({ label }: { label?: string }) {
  const t = useT();
  const text = label ?? t.chrome.loading;
  return (
    <div className="flex min-h-[40vh] flex-col justify-center gap-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">{text}</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
