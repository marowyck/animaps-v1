"use client";

import type { LucideIcon } from "lucide-react";
import { SelectableCard } from "@/components/SelectableCard";

export type IntentionOption<T extends string> = {
  id: T;
  title: string;
  description?: string;
  icon: LucideIcon;
};

type IntentionSelectorProps<T extends string> = {
  options: IntentionOption<T>[];
  selected: T[];
  onToggle: (id: T) => void;
  multi?: boolean;
  compact?: boolean;
  className?: string;
};

export function IntentionSelector<T extends string>({
  options,
  selected,
  onToggle,
  multi = true,
  compact = true,
  className = "",
}: IntentionSelectorProps<T>) {
  return (
    <div
      className={[
        "grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-2.5",
        className,
      ].join(" ")}
      role={multi ? "group" : "radiogroup"}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selected.includes(opt.id);
        return (
          <SelectableCard
            key={opt.id}
            compact={compact}
            title={opt.title}
            description={opt.description}
            icon={<Icon className="size-4" />}
            selected={isSelected}
            onClick={() => onToggle(opt.id)}
          />
        );
      })}
    </div>
  );
}
