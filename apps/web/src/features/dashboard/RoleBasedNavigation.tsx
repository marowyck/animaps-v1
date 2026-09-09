"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { NavigationItem } from "@/components/NavigationItem";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useT } from "@/i18n";
import type { PublicUserType } from "@/features/user-types";
import {
  filterNavByPermissions,
  getDashboardConfig,
  type DashboardNavItem,
} from "./navigation";

type RoleBasedNavigationProps = {
  userType: PublicUserType;
  displayName?: string | null;
  /** desktop sidebar vs mobile list rendering handled by parent; this is sidebar chrome. */
  variant?: "sidebar" | "list";
  navOverride?: DashboardNavItem[];
};

export function RoleBasedNavigation({
  userType,
  displayName,
  variant = "sidebar",
  navOverride,
}: RoleBasedNavigationProps) {
  const t = useT();
  const pathname = usePathname();
  const name = displayName?.trim() || "ANIMAPS";
  const config = getDashboardConfig(userType);
  const nav = filterNavByPermissions(navOverride ?? config.nav, userType);

  if (variant === "list") {
    return (
      <nav className="flex flex-col gap-1" aria-label="Dashboard">
        {nav.map((item) => renderItem(item, pathname, t))}
      </nav>
    );
  }

  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col border-r-2 border-border-soft bg-white px-4 py-6 lg:flex">
      <div className="mb-8 px-2">
        <p className="font-display text-2xl text-ink">ANIMAPS</p>
      </div>
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gray-soft px-3 py-3">
        <ProfileAvatar name={name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{name}</p>
          <p className="truncate text-xs text-ink-muted">{userType}</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {nav.map((item) => renderItem(item, pathname, t))}
      </nav>
      <div className="mt-4 border-t border-border-soft pt-3">
        <NavigationItem
          href="/"
          label={t.dashboard.exit}
          icon={<LogOut className="size-4" />}
        />
      </div>
    </aside>
  );
}

function renderItem(
  item: DashboardNavItem,
  pathname: string,
  t: ReturnType<typeof useT>,
) {
  const Icon = item.icon;
  const label =
    t.dashboard.nav[item.id as keyof typeof t.dashboard.nav] ?? item.id;
  const active =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <NavigationItem
      key={item.id}
      href={item.placeholder ? "#" : item.href}
      label={
        item.placeholder ? `${label} · ${t.dashboard.comingSoon}` : String(label)
      }
      icon={<Icon className="size-4" />}
      active={active && !item.placeholder}
      disabled={item.placeholder}
    />
  );
}
