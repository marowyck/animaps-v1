import type { ReactNode } from "react";

const TONE = {
  primary: "bg-primary-soft text-(--pink-700)",
  secondary: "bg-secondary-soft text-(--lilac-700)",
  success: "bg-success-soft text-(--mint-700)",
  warning: "bg-warning-soft text-(--honey-700)",
  info: "bg-info-soft text-(--sky-700)",
} as const;

type WorkspaceSectionProps = {
  title: string;
  hint?: string;
  icon?: ReactNode;
  tone?: keyof typeof TONE;
  children: ReactNode;
  className?: string;
};

/** Open workspace block: a colored icon and a heading, without a card frame. */
export function WorkspaceSection({
  title,
  hint,
  icon,
  tone = "primary",
  children,
  className = "",
}: WorkspaceSectionProps) {
  return (
    <section className={["space-y-3", className].filter(Boolean).join(" ")}>
      <div className="flex items-center gap-3">
        {icon ? (
          <span
            className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full ${TONE[tone]}`}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        <h2 className="text-h4 text-text">{title}</h2>
      </div>
      {hint ? <p className="max-w-xl text-body-sm text-text-secondary">{hint}</p> : null}
      {children}
    </section>
  );
}
