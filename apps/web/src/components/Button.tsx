"use client";

import { Loader2 } from "lucide-react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link"
  | "pink"
  | "orange"
  | "blue"
  | "green"
  | "white"
  | "ink"
  | "soft"
  | "segment"
  | "field";

export type ButtonSize = "md" | "sm" | "xs" | "icon" | "stretch" | "field";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Kept for call-site compatibility. Motion is a short press, not a magnetic pull. */
  magnetic?: boolean;
  selected?: boolean;
  tone?: "light" | "dark";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

type AsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "disabled"> & {
    href?: undefined;
  };

type AsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = AsButton | AsLink;

const SIZE: Record<ButtonSize, string> = {
  md: "min-h-12 justify-center px-5 py-3 text-body-sm font-semibold",
  sm: "min-h-10 justify-center px-4 py-2 text-body-sm font-semibold",
  xs: "min-h-8 justify-center px-3 text-caption font-semibold",
  icon: "size-11 shrink-0 justify-center p-0",
  stretch: "w-full justify-between gap-4 px-5 py-4 text-left text-body font-semibold",
  field: "w-full justify-between gap-3 rounded-xl border px-4 py-3 text-left font-semibold",
};

function resolveVariant(variant: ButtonVariant): ButtonVariant {
  switch (variant) {
    case "pink":
    case "orange":
      return "primary";
    case "white":
      return "outline";
    case "blue":
      return "secondary";
    default:
      return variant;
  }
}

function skinClasses(
  variant: ButtonVariant,
  selected: boolean,
  tone: "light" | "dark",
): string {
  switch (resolveVariant(variant)) {
    case "green":
      return "bg-success text-surface-elevated shadow-sm hover:brightness-95";
    case "primary":
      return "bg-primary text-surface-elevated shadow-sm hover:bg-primary-hover hover:shadow-[var(--shadow-glow-primary)] active:bg-primary-active";
    case "secondary":
      return "bg-secondary text-surface-elevated shadow-sm hover:bg-secondary-hover hover:shadow-[var(--shadow-glow-secondary)]";
    case "outline":
      return "border border-border bg-surface text-text hover:border-primary/40 hover:bg-primary-soft";
    case "danger":
      return "bg-danger text-surface-elevated shadow-sm hover:brightness-95";
    case "link":
      return "h-auto min-h-0 bg-transparent px-0 py-0 text-primary underline-offset-4 hover:underline";
    case "ink":
      return "bg-text text-surface-elevated hover:opacity-90";
    case "soft":
      return selected
        ? "bg-primary text-surface-elevated"
        : "bg-primary-soft text-primary hover:bg-primary hover:text-surface-elevated";
    case "ghost":
      return "bg-transparent text-text hover:bg-surface-hover";
    case "segment":
      if (tone === "dark") {
        return selected
          ? "bg-primary text-surface-elevated shadow-sm"
          : "bg-transparent text-surface/70 hover:text-surface";
      }
      return selected
        ? "bg-primary text-surface-elevated shadow-sm"
        : "bg-transparent text-text-secondary hover:bg-surface hover:text-text";
    case "field":
      return "border-border bg-background text-text shadow-none outline-none focus:border-primary focus:bg-surface";
    default:
      return "";
  }
}

export function Button({
  children,
  href,
  className = "",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  selected = false,
  tone = "light",
  magnetic: _magnetic,
  ...rest
}: ButtonProps) {
  void _magnetic;
  const resolvedSize = variant === "field" && size === "md" ? "field" : size;
  const isDisabled = disabled || loading;
  const base = [
    "group relative inline-flex cursor-pointer items-center gap-2 rounded-full transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
    "active:scale-[0.98]",
    SIZE[resolvedSize],
    skinClasses(variant, selected, tone),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <span
      className={[
        "relative z-10 inline-flex items-center gap-2",
        resolvedSize === "stretch" || resolvedSize === "field" ? "w-full justify-between" : "",
      ].join(" ")}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </span>
  );

  if (href) {
    const { onClick, ...anchorRest } = rest as Omit<AsLink, keyof SharedProps | "href">;
    return (
      <a
        href={href}
        className={base}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<AsButton, keyof SharedProps>;
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={base}
      aria-busy={loading || undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
}

type NamedButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function PrimaryButton(props: NamedButtonProps) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: NamedButtonProps) {
  return <Button variant="secondary" {...props} />;
}

export function OutlineButton(props: NamedButtonProps) {
  return <Button variant="outline" {...props} />;
}

export function GhostButton(props: NamedButtonProps) {
  return <Button variant="ghost" {...props} />;
}

export function DangerButton(props: NamedButtonProps) {
  return <Button variant="danger" {...props} />;
}

export function LinkButton(props: NamedButtonProps) {
  return <Button variant="link" {...props} />;
}
