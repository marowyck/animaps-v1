"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type NavigationItemProps = {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function NavigationItem({
  href,
  label,
  icon,
  active = false,
  disabled = false,
  onClick,
}: NavigationItemProps) {
  const className = [
    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all duration-200 active:scale-[0.97]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
    active
      ? "bg-pastel-pink text-brand-pink shadow-sm"
      : "text-ink-muted hover:bg-pastel-pink/30 hover:text-ink",
    disabled ? "pointer-events-none opacity-45 active:scale-100" : "",
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
