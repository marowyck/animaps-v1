"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Inbox, Loader2 } from "lucide-react";

type StateBlockProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function StateShell({
  icon,
  title,
  description,
  action,
  className = "",
}: StateBlockProps & { icon: ReactNode }) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-border-soft bg-white px-6 py-12 text-center animate-fade-in-up",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-brand-pink" aria-hidden>
        {icon}
      </span>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function EmptyState(props: StateBlockProps) {
  return <StateShell icon={<Inbox className="size-8" />} {...props} />;
}

export function LoadingState({
  title,
  description,
  className = "",
}: Omit<StateBlockProps, "action">) {
  return (
    <div aria-busy="true" aria-live="polite">
      <StateShell
        icon={<Loader2 className="size-8 animate-spin" />}
        title={title}
        description={description}
        className={className}
      />
    </div>
  );
}

export function ErrorState(props: StateBlockProps) {
  return (
    <StateShell
      icon={<AlertCircle className="size-8 text-error" />}
      {...props}
    />
  );
}

export function SuccessState(props: StateBlockProps) {
  return (
    <StateShell
      icon={<CheckCircle2 className="size-8 text-success" />}
      {...props}
    />
  );
}
