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
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary-ink">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-caption font-semibold text-text-muted">{title}</p>
        <p className="font-display truncate text-h4 text-text">{value}</p>
      </div>
    </Card>
  );
}
