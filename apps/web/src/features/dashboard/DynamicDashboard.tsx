"use client";

import { useRef } from "react";
import { MapPin, PawPrint } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/Button";
import { Blob } from "@/components/bits";
import { HeartDoodle, PawDoodle } from "@/components/illustrations/Doodles";
import { useDiscoverActivity } from "@/features/discover";
import type { PublicUserType } from "@/features/user-types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useT } from "@/i18n";

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

  const likes = activity.likes.filter((id) => !activity.matches.includes(id));
  const quiet =
    activity.likes.length === 0 && activity.matches.length === 0;

  useGSAP(
    () => {
      const pins = mapRef.current?.querySelectorAll<HTMLElement>(".dash-pin");
      if (reduced || !pins?.length) return;
      gsap.fromTo(
        pins,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.09,
          ease: "back.out(1.7)",
          delay: 0.12,
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
        <a
          href="/matches"
          className="relative flex min-h-56 flex-col justify-between overflow-hidden rounded-[2rem] bg-primary-soft p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-7 lg:col-span-3"
        >
          <HeartDoodle className="pointer-events-none absolute -right-3 -bottom-6 size-36 rotate-12 text-primary/25" />
          <span className="text-label text-(--pink-700)">{t.dashboard.summary.matches}</span>
          <span className="relative font-display text-6xl leading-none text-text tabular-nums">
            {activity.matches.length}
          </span>
          <span className="relative max-w-[16rem] text-body-sm text-text-secondary">
            {t.dashboard.nav.matches}
          </span>
        </a>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <a
            href="/favorites"
            className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[1.6rem] bg-secondary-soft px-5 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="text-label text-(--lilac-700)">{t.dashboard.summary.favorites}</span>
            <span className="font-display text-4xl leading-none text-text tabular-nums">
              {activity.favorites.length}
            </span>
          </a>
          <a
            href="/discover"
            className="flex items-center justify-between gap-3 rounded-full bg-warning-soft px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="font-display text-lg text-(--honey-700)">
              {t.dashboard.nav.discover}
            </span>
            <PawDoodle className="size-8 text-(--honey-700)" />
          </a>
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
          <div className="mt-5 flex flex-col items-start gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary-soft text-(--lilac-700)">
              <PawPrint className="size-6" aria-hidden />
            </span>
            <div>
              <p className="max-w-sm text-body text-text-secondary">{t.dashboard.activityEmpty}</p>
              <Button href="/discover" variant="primary" size="sm" className="mt-4">
                {t.dashboard.actionDiscover}
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {activity.matches.map((id) => (
              <li key={`m-${id}`} className="flex items-stretch gap-3 py-1">
                <span className="mt-0.5 min-h-5 w-1.5 shrink-0 self-stretch rounded-full bg-primary" aria-hidden />
                <span className="text-body-sm text-text">
                  <span className="font-semibold">{t.discover.matched}</span>
                  <span className="text-text-muted"> · {id}</span>
                </span>
              </li>
            ))}
            {likes.map((id) => (
              <li key={`l-${id}`} className="flex items-stretch gap-3 py-1">
                <span className="mt-0.5 min-h-5 w-1.5 shrink-0 self-stretch rounded-full bg-secondary" aria-hidden />
                <span className="text-body-sm text-text">
                  <span className="font-semibold">{t.discover.liked}</span>
                  <span className="text-text-muted"> · {id}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
