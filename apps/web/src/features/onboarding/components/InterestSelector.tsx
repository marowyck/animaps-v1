"use client";

import { useMemo, useState } from "react";
import { InterestTag } from "@/components/InterestTag";
import { SearchInput } from "@/components/SearchInput";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { INTEREST_CATALOG } from "../data";
import { MAX_INTERESTS } from "../types";

type InterestSelectorProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  max?: number;
};

export function InterestSelector({
  selectedIds,
  onToggle,
  max = MAX_INTERESTS,
}: InterestSelectorProps) {
  const t = useT();
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INTEREST_CATALOG;
    return INTEREST_CATALOG.filter((item) => {
      const label = t.onboarding.interests.items[item.id] ?? item.id;
      return label.toLowerCase().includes(q) || item.id.includes(q);
    });
  }, [query, t]);

  const toggle = (id: string) => {
    const selected = selectedIds.includes(id);
    if (!selected && selectedIds.length >= max) {
      toast({ message: t.onboarding.interests.maxReached, tone: "warning" });
      return;
    }
    onToggle(id);
  };

  return (
    <div className="space-y-3">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={t.onboarding.interests.search}
        label={t.onboarding.interests.searchLabel}
      />
      <div className="flex flex-wrap gap-2">
        {filtered.map((item) => {
          const selected = selectedIds.includes(item.id);
          return (
            <InterestTag
              key={item.id}
              label={t.onboarding.interests.items[item.id] ?? item.id}
              selected={selected}
              disabled={!selected && selectedIds.length >= max}
              onClick={() => toggle(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
