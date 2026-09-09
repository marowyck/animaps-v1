"use client";

import { useT } from "@/i18n";
import type { PublicUserType } from "@/features/user-types";
import {
  getDashboardConfig,
  SUMMARY_MOCK,
  type SummaryId,
} from "./navigation";
import { SummaryCard } from "./SummaryCard";

type DynamicDashboardProps = {
  userType: PublicUserType;
  displayName?: string | null;
};

export function DynamicDashboard({
  userType,
  displayName,
}: DynamicDashboardProps) {
  const t = useT();
  const name = displayName?.trim() || "friend";
  const { summaryOrder } = getDashboardConfig(userType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          {t.dashboard.welcome.replace("{name}", name)}
        </h1>
        <p className="mt-1 text-sm font-semibold text-ink-muted">{userType}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {summaryOrder.map((id) => {
          const mock = SUMMARY_MOCK[id];
          if (!mock) return null;
          const title =
            t.dashboard.summary[id as keyof typeof t.dashboard.summary] ?? id;
          return (
            <SummaryCard
              key={id}
              title={String(title)}
              value={
                id === "region" && mock.value === "—"
                  ? t.dashboard.comingSoon
                  : mock.value
              }
              icon={mock.icon}
            />
          );
        })}
      </div>
    </div>
  );
}

export type { SummaryId };
