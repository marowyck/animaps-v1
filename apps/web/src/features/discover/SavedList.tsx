"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/StateBlocks";
import { HeartDoodle, PawDoodle } from "@/components/illustrations/Doodles";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useT } from "@/i18n";
import { DISTANCE, DURATION, EASE, STAGGER } from "@/lib/motion";
import { useDiscoverActivity } from "./activity";
import { getMockDiscoverItems } from "./mockDiscoverItems";
import type { DiscoverEntityKind } from "./types";

type SavedListProps = {
  kind: "matches" | "favorites";
};

const FALLBACK_IMAGE: Record<DiscoverEntityKind, string> = {
  animal: "/images/auth/adoption.png",
  person: "/images/auth/rescue.png",
  organization: "/images/auth/wildlife.png",
  protector: "/images/hero-pet.jpg",
};

const TAG_TONES = [
  "bg-primary-soft text-primary-ink",
  "bg-success-soft text-success-ink",
  "bg-warning-soft text-warning-ink",
  "bg-secondary-soft text-secondary-ink",
] as const;

const PORTRAIT = [
  "rounded-[1.5rem_2rem_1.25rem_1.75rem]",
  "rounded-[2rem_1.35rem_1.8rem_1.2rem]",
  "rounded-[1.7rem]",
] as const;

export function SavedList({ kind }: SavedListProps) {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const activity = useDiscoverActivity();
  const ids = kind === "matches" ? activity.matches : activity.favorites;
  const items = getMockDiscoverItems(t).filter((item) => ids.includes(item.id));
  const copy =
    kind === "matches"
      ? {
          title: t.saved.matchesTitle,
          subtitle: t.saved.matchesSubtitle,
          empty: t.saved.matchesEmpty,
        }
      : {
          title: t.saved.favoritesTitle,
          subtitle: t.saved.favoritesSubtitle,
          empty: t.saved.favoritesEmpty,
        };

  useGSAP(
    () => {
      const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-saved]");
      if (reduced || !rows?.length) return;
      gsap.fromTo(
        rows,
        { y: DISTANCE.small, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.enter,
          delay: 0.12,
          stagger: STAGGER,
          ease: EASE.settle,
          clearProps: "transform",
        },
      );
    },
    { scope: listRef, dependencies: [reduced, ids.join("|")] },
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 text-text">{copy.title}</h1>
          <p className="mt-2 max-w-md text-body-sm text-text-secondary">{copy.subtitle}</p>
        </div>
        {kind === "matches" ? (
          <HeartDoodle className="hidden size-10 shrink-0 text-primary sm:block" />
        ) : (
          <span className="hidden size-10 items-center justify-center rounded-full bg-secondary-soft text-secondary-ink sm:flex">
            <PawDoodle className="size-6" />
          </span>
        )}
      </header>

      {items.length === 0 ? (
        <EmptyState
          illustration={kind === "matches" ? "dog" : "cat"}
          title={copy.title}
          description={copy.empty}
          action={
            <Button href="/discover" variant="primary" size="sm">
              {t.saved.openDiscover}
            </Button>
          }
        />
      ) : (
        <ul ref={listRef} className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={item.id} data-saved>
              <Link
                href="/discover"
                className="group flex items-center gap-4 rounded-[1.6rem] px-2 py-2 transition-colors duration-(--duration-fast) hover:bg-primary-soft/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span
                  className={`relative size-20 shrink-0 overflow-hidden bg-surface-accent sm:size-24 ${PORTRAIT[index % PORTRAIT.length]}`}
                >
                  <Image
                    src={item.imageUrl ?? FALLBACK_IMAGE[item.kind]}
                    alt=""
                    fill
                    sizes="6rem"
                    className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.04]"
                  />
                </span>
                <span className="min-w-0 py-1">
                  <span className="text-caption font-semibold text-primary-ink">
                    {t.discover.kinds[item.kind]}
                    {typeof item.distanceKm === "number"
                      ? ` · ${item.distanceKm.toFixed(1)} km`
                      : ""}
                  </span>
                  <span className="mt-0.5 block truncate font-display text-2xl leading-none text-text">
                    {item.title}
                  </span>
                  {item.subtitle ? (
                    <span className="mt-1 block line-clamp-2 text-body-sm text-text-secondary">
                      {item.subtitle}
                    </span>
                  ) : null}
                  {item.tags?.length ? (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${TAG_TONES[tagIndex % TAG_TONES.length]}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
