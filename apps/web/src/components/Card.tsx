"use client";

import type { HTMLAttributes, ReactNode } from "react";

type CardLevel = "surface" | "card" | "interactive" | "elevated";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  level?: CardLevel;
};

const PAD = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
} as const;

const LEVEL: Record<CardLevel, string> = {
  surface: "bg-surface",
  card: "border border-border-subtle bg-surface",
  interactive:
    "border border-border-subtle bg-surface transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-hover hover:shadow-md",
  elevated: "border border-border-subtle bg-surface-elevated shadow-md",
};

export function Card({
  children,
  padding = "md",
  level = "card",
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={["rounded-2xl", LEVEL[level], PAD[padding], className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Surface(props: Omit<CardProps, "level">) {
  return <Card level="surface" {...props} />;
}

export function InteractiveCard(props: Omit<CardProps, "level">) {
  return <Card level="interactive" {...props} />;
}

export function ElevatedCard(props: Omit<CardProps, "level">) {
  return <Card level="elevated" {...props} />;
}
