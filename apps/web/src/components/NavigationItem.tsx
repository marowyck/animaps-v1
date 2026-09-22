"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type NavigationItemProps = {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  tone?: "default" | "exit";
  onClick?: () => void;
};

export function NavigationItem({
  href,
  label,
  icon,
  active = false,
  disabled = false,
  tone = "default",
  onClick,
}: NavigationItemProps) {
  const className = [
    "flex items-center gap-3 rounded-full px-3 py-2.5 text-body-sm font-semibold transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    tone === "exit"
      ? "bg-danger-soft text-(--coral-700) hover:bg-danger/20"
      : active
        ? "bg-primary-soft text-(--pink-700)"
        : "text-text-secondary hover:bg-primary-soft/60 hover:text-text",
    disabled ? "pointer-events-none opacity-45" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (disabled) {
    return (
      <span className={className} aria-disabled="true">
        <span aria-hidden>{icon}</span>
        {label}
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-current={active ? "page" : undefined} onClick={onClick}>
      <span aria-hidden>{icon}</span>
      {label}
    </Link>
  );
}
