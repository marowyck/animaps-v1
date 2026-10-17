import type { ReactNode } from "react";

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const TONE: Record<BadgeTone, string> = {
  neutral: "border-border-subtle bg-background-secondary text-text-secondary",
  primary: "border-primary/20 bg-primary-soft text-primary-ink",
  success: "border-success/25 bg-success-soft text-success-ink",
  warning: "border-warning/30 bg-warning-soft text-warning-ink",
  danger: "border-danger/25 bg-danger-soft text-danger-ink",
  info: "border-info/25 bg-info-soft text-info-ink",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-semibold",
        TONE[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
