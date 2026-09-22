"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useT } from "@/i18n";
import type { PublicUserType } from "@/features/user-types";
import {
  filterNavByPermissions,
  getDashboardConfig,
} from "./navigation";

type MobileNavProps = {
  userType?: PublicUserType;
};

export function MobileNav({ userType = "PERSON" }: MobileNavProps) {
  const t = useT();
  const pathname = usePathname();
  const config = getDashboardConfig(userType);
  const nav = filterNavByPermissions(config.nav, userType);
  const items = nav.filter((n) => config.mobileNavIds.includes(n.id));

  const itemClass = (active: boolean, placeholder = false) =>
    [
      "flex flex-1 flex-col items-center gap-1 rounded-full px-1 py-1.5 text-[10px] font-semibold transition-colors duration-150",
      active
        ? "bg-primary-soft text-(--pink-700)"
        : "text-text-muted hover:text-text",
      placeholder ? "opacity-45 pointer-events-none" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 bg-background px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
      aria-label={t.chrome.mobileNav}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1">
        <li className="flex-1">
          <Link
            href="/"
            className="flex flex-1 flex-col items-center gap-1 rounded-full bg-danger-soft px-1 py-1.5 text-[10px] font-semibold text-(--coral-700)"
            aria-label={t.dashboard.exit}
          >
            <LogOut className="size-5" aria-hidden />
            {t.dashboard.exit}
          </Link>
        </li>
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const label =
            t.dashboard.nav[item.id as keyof typeof t.dashboard.nav] ?? item.id;

          if (item.placeholder) {
            return (
              <li key={item.id} className="flex-1">
                <span className={itemClass(false, true)} aria-disabled="true">
                  <Icon className="size-5" aria-hidden />
                  {String(label)}
                </span>
              </li>
            );
          }

          return (
            <li key={item.id} className="flex-1">
              <Link
                href={item.href}
                className={itemClass(active)}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" aria-hidden />
                {String(label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
