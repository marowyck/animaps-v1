"use client";

export type VerificationStatus =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "retry_required";

type VerificationStatusBadgeProps = {
  status: VerificationStatus;
  label: string;
};

const STYLES: Record<VerificationStatus, string> = {
  pending: "bg-gray-soft text-ink-muted border-border-soft",
  processing: "bg-pastel-blue text-brand-blue border-brand-blue/30 animate-pulse",
  approved: "bg-pastel-green text-brand-green border-brand-green/40",
  rejected: "bg-red-50 text-error border-error/30",
  retry_required: "bg-amber-50 text-warning border-warning/30",
};

export function VerificationStatusBadge({
  status,
  label,
}: VerificationStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide",
        STYLES[status],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
