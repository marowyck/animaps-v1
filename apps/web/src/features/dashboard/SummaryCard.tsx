"use client";

import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/Card";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export function SummaryCard({ title, value, icon: Icon }: SummaryCardProps) {
  return (
    <Card padding="sm" className="flex items-center gap-3">
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-pastel-pink text-brand-pink">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {title}
        </p>
        <p className="truncate text-xl font-black text-ink">{value}</p>
      </div>
    </Card>
  );
}
