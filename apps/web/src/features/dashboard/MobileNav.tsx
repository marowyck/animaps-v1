"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
      "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1.5 py-1.5 text-[11px] font-semibold transition-colors duration-150",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      active
        ? "bg-primary-soft text-primary-ink"
        : "text-text-secondary hover:bg-surface-hover hover:text-text",
      placeholder ? "opacity-45 pointer-events-none" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface/95 px-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-sm backdrop-blur-md lg:hidden"
      aria-label={t.chrome.mobileNav}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const label =
            t.dashboard.nav[item.id as keyof typeof t.dashboard.nav] ?? item.id;

          if (item.placeholder) {
            return (
              <li key={item.id} className="flex flex-1">
                <span className={itemClass(false, true)} aria-disabled="true">
                  <Icon className="size-5" aria-hidden />
                  <span className="max-w-full truncate">{String(label)}</span>
                </span>
              </li>
            );
          }

          return (
            <li key={item.id} className="flex flex-1">
              <Link
                href={item.href}
                className={itemClass(active)}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" aria-hidden />
                <span className="max-w-full truncate">{String(label)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
