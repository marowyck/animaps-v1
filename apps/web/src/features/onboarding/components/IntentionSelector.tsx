"use client";

import type { LucideIcon } from "lucide-react";
import { TypeSelector } from "./TypeSelector";

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
    <TypeSelector
      multi={multi}
      layout="dense"
      compact={compact}
      className={className}
      selected={selected}
      onToggle={onToggle}
      value={multi ? undefined : selected[0]}
      onChange={multi ? undefined : onToggle}
      options={options.map((option) => {
        const Icon = option.icon;
        return {
          id: option.id,
          title: option.title,
          description: option.description,
          icon: <Icon className="size-4" />,
        };
      })}
    />
  );
}
