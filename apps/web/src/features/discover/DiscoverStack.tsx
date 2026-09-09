"use client";

import { useState } from "react";
import { EmptyState } from "@/components/StateBlocks";
import { useToast } from "@/components/Toast";
import { useT } from "@/i18n";
import { DiscoverCard } from "./DiscoverCard";
import { MOCK_DISCOVER_ITEMS } from "./mockDiscoverItems";
import type { DiscoverAction } from "./types";

export function DiscoverStack() {
  const t = useT();
  const { toast } = useToast();
  const [index, setIndex] = useState(0);
  const item = MOCK_DISCOVER_ITEMS[index];

  if (!item) {
    return (
      <EmptyState
        title={t.discover.empty}
        description={t.discover.subtitle}
      />
    );
  }

  const onAction = (action: DiscoverAction) => {
    const messages: Partial<Record<DiscoverAction, string>> = {
      like: t.discover.liked,
      favorite: t.discover.favorited,
      skip: t.discover.skipped,
      report: t.discover.reported,
      share: t.discover.shared,
    };
    const message = messages[action];
    if (message) {
      toast({
        message,
        tone: action === "report" ? "warning" : "info",
      });
    }
    if (action === "like" || action === "skip" || action === "favorite") {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col overflow-visible lg:h-[calc(100dvh-4rem)]">
      <DiscoverCard key={item.id} item={item} onAction={onAction} />
    </div>
  );
}
