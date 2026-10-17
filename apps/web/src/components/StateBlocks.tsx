"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  BirdDoodle,
  CatDoodle,
  DogDoodle,
  FamilyDoodle,
  PawDoodle,
} from "./illustrations/Doodles";

export type StateIllustration = "paw" | "dog" | "cat" | "bird" | "family";

type StateBlockProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  illustration?: StateIllustration;
};

function renderIllustration(kind: StateIllustration) {
  switch (kind) {
    case "dog":
      return <DogDoodle className="size-10" />;
    case "cat":
      return <CatDoodle className="size-10" />;
    case "bird":
      return <BirdDoodle className="size-10" />;
    case "family":
      return <FamilyDoodle className="size-12" />;
    default:
      return <PawDoodle className="size-8" />;
  }
}

function StateShell({
  icon,
  toneClass = "bg-primary-soft text-primary-ink",
  title,
  description,
  action,
  className = "",
}: StateBlockProps & { icon: ReactNode; toneClass?: string }) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface px-6 py-12 text-center shadow-sm animate-fade-in-up",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={`flex size-14 items-center justify-center rounded-2xl ${toneClass}`}
        aria-hidden
      >
        {icon}
      </span>
      <h3 className="text-h4 text-text">{title}</h3>
      {description ? (
        <p className="max-w-sm text-body-sm text-text-secondary">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ illustration = "paw", ...props }: StateBlockProps) {
  return <StateShell icon={renderIllustration(illustration)} {...props} />;
}

export function LoadingState({
  title,
  description,
  className = "",
}: Omit<StateBlockProps, "action">) {
  return (
    <div aria-busy="true" aria-live="polite">
      <StateShell
        icon={<Loader2 className="size-7 animate-spin" />}
        toneClass="bg-secondary-soft text-secondary-ink"
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
      icon={<AlertCircle className="size-7" />}
      toneClass="bg-danger-soft text-danger-ink"
      {...props}
    />
  );
}

export function SuccessState(props: StateBlockProps) {
  return (
    <StateShell
      icon={<CheckCircle2 className="size-7" />}
      toneClass="bg-success-soft text-success-ink"
      {...props}
    />
  );
}
