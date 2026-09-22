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
  pending: "bg-background-secondary text-text-secondary border-border-subtle",
  processing: "bg-info-soft text-info border-info/30",
  approved: "bg-success-soft text-success border-success/30",
  rejected: "bg-danger-soft text-danger border-danger/30",
  retry_required: "bg-warning-soft text-warning border-warning/40",
};

export function VerificationStatusBadge({
  status,
  label,
}: VerificationStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-caption font-semibold",
        STYLES[status],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
