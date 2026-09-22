"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { PawDoodle } from "./illustrations/Doodles";

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
        "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface px-6 py-12 text-center animate-fade-in-up",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary" aria-hidden>
        {icon}
      </span>
      <h3 className="text-h4 text-text">{title}</h3>
      {description ? (
        <p className="max-w-sm text-body-sm text-text-secondary">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function EmptyState(props: StateBlockProps) {
  return <StateShell icon={<PawDoodle className="size-8" />} {...props} />;
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
