"use client";

import { useRef } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/StateBlocks";
import { Blob } from "@/components/bits";
import { HeartDoodle, PawDoodle } from "@/components/illustrations/Doodles";
import { getMockDiscoverItems, useDiscoverActivity } from "@/features/discover";
import type { PublicUserType } from "@/features/user-types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useT } from "@/i18n";
import { CountUp } from "@/components/CountUp";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

const TILE_HOVER =
  "transition-[translate,box-shadow] duration-(--duration-fast) ease-(--ease-out) hover:-translate-y-0.5 hover:shadow-md";

type DynamicDashboardProps = {
  userType: PublicUserType;
  displayName?: string | null;
};

const PINS = [
  { top: "20%", left: "66%", tone: "bg-secondary", size: "size-3" },
  { top: "62%", left: "26%", tone: "bg-honey-600", size: "size-3" },
  { top: "50%", left: "74%", tone: "bg-info", size: "size-2.5" },
] as const;

export function DynamicDashboard({
  userType,
  displayName,
}: DynamicDashboardProps) {
  const t = useT();
  const activity = useDiscoverActivity();
  const reduced = usePrefersReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const name = displayName?.trim() || t.brand;
  const isOrganization = userType === "ONG" || userType === "VETERINARY_CLINIC";

  const primary =
    userType === "ONG"
      ? { href: "/cases", label: t.dashboard.actionCases }
      : userType === "VETERINARY_CLINIC"
        ? { href: "/profile", label: t.dashboard.actionProfile }
        : { href: "/discover", label: t.dashboard.actionDiscover };

  const catalog = new Map(
    getMockDiscoverItems(t).map((item) => [item.id, item] as const),
  );
  const likes = activity.likes.filter((id) => !activity.matches.includes(id));
  const quiet =
    activity.likes.length === 0 && activity.matches.length === 0;

  useGSAP(
    () => {
      const pins = mapRef.current?.querySelectorAll<HTMLElement>(".dash-pin");
      if (reduced || !pins?.length) return;
      gsap.fromTo(
        pins,
        { scale: 0.6, y: 6, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: DURATION.enter,
          stagger: STAGGER * 1.5,
          ease: EASE.settle,
          delay: 0.3,
        },
      );
    },
    { scope: mapRef, dependencies: [reduced] },
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
            <p className="text-label text-primary">
              {isOrganization ? t.dashboard.nav.organization : t.dashboard.nav.dashboard}
            </p>
            <h1 className="text-h1 mt-2 text-text">
              {t.dashboard.welcome.replace("{name}", name)}
            </h1>
            <p className="mt-2 max-w-xl text-body-sm text-text-secondary">{t.dashboard.actionBody}</p>
        </div>
        <Button href={primary.href} variant="primary" size="sm">
          {primary.label}
        </Button>
      </header>

      <section className="grid items-stretch gap-4 lg:grid-cols-5">
        <Link
          href="/matches"
          className={`relative flex min-h-56 flex-col justify-between overflow-hidden rounded-[2rem] bg-primary-soft p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-7 lg:col-span-3 ${TILE_HOVER}`}
        >
          <HeartDoodle className="pointer-events-none absolute -right-3 -bottom-6 size-36 rotate-12 text-primary/25" />
          <span className="text-label text-primary-ink">{t.dashboard.summary.matches}</span>
          <CountUp
            value={activity.matches.length}
            className="relative font-display text-6xl leading-none text-text"
          />
          <span className="relative max-w-[16rem] text-body-sm text-text-secondary">
            {t.dashboard.nav.matches}
          </span>
        </Link>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Link
            href="/favorites"
            className={`relative flex flex-1 flex-col justify-between overflow-hidden rounded-[1.6rem] bg-secondary-soft px-5 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${TILE_HOVER}`}
          >
            <span className="text-label text-secondary-ink">{t.dashboard.summary.favorites}</span>
            <CountUp
              value={activity.favorites.length}
              className="font-display text-4xl leading-none text-text"
            />
          </Link>
          <Link
            href="/discover"
            className={`group flex items-center justify-between gap-3 rounded-full bg-warning-soft px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${TILE_HOVER}`}
          >
            <span className="font-display text-lg text-warning-ink">
              {t.dashboard.nav.discover}
            </span>
            <PawDoodle className="size-8 text-warning-ink" />
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-h2 text-text">{t.dashboard.nav.map}</h2>
            <p className="mt-1 max-w-md text-body-sm text-text-secondary">
              {t.institution.overview.moduleMap}
            </p>
          </div>
          <Button href={isOrganization ? "/map" : "/discover"} variant="ghost" size="sm">
            {t.dashboard.nav.map}
          </Button>
        </div>
        <div
          ref={mapRef}
          className="relative mt-4 h-72 overflow-hidden rounded-[2.4rem] sm:h-80"
        >
          <div className="map-grid absolute inset-0 opacity-70" />
          <Blob variant={1} className="absolute -top-10 -left-8 size-56 text-info/35" />
          <Blob variant={0} className="absolute -right-8 -bottom-12 size-52 text-primary/25" />
          <span className="dash-pin absolute top-[34%] left-[36%] z-10 inline-flex origin-center items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-caption font-semibold text-text shadow-md">
            <MapPin className="size-4 text-primary" aria-hidden />
            {name}
          </span>
          {PINS.map((pin) => (
            <span
              key={`${pin.top}-${pin.left}`}
              className={`dash-pin absolute z-10 origin-center rounded-full shadow-sm ${pin.tone} ${pin.size}`}
              style={{ top: pin.top, left: pin.left }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 text-text">{t.dashboard.activityTitle}</h2>
        {quiet ? (
          <div className="mt-4">
            <EmptyState
              illustration="dog"
              title={t.dashboard.activityTitle}
              description={t.dashboard.activityEmpty}
              action={
                <Button href="/discover" variant="primary" size="sm">
                  {t.dashboard.actionDiscover}
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border-subtle rounded-3xl border border-border-subtle bg-surface p-2 shadow-sm">
            {activity.matches.map((id) => {
              const item = catalog.get(id);
              return (
                <li key={`m-${id}`}>
                  <Link
                    href="/matches"
                    className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="h-5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      <div className="min-w-0">
                        <p className="truncate text-body-sm font-semibold text-text">
                          {item?.title ?? id}
                        </p>
                        {item?.subtitle ? (
                          <p className="truncate text-caption text-text-secondary">
                            {item.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <Badge tone="primary">{t.discover.matched}</Badge>
                  </Link>
                </li>
              );
            })}
            {likes.map((id) => {
              const item = catalog.get(id);
              return (
                <li key={`l-${id}`}>
                  <Link
                    href="/discover"
                    className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="h-5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden />
                      <div className="min-w-0">
                        <p className="truncate text-body-sm font-semibold text-text">
                          {item?.title ?? id}
                        </p>
                        {item?.subtitle ? (
                          <p className="truncate text-caption text-text-secondary">
                            {item.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <Badge tone="neutral">{t.discover.liked}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
