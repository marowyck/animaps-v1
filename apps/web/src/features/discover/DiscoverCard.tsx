"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, SkipForward, Star } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ParticleBurst } from "@/components/bits";
import { PawDoodle } from "@/components/illustrations/Doodles";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useT } from "@/i18n";
import type { DiscoverAction, DiscoverEntityKind, DiscoverItem } from "./types";
import { useSwipeGesture } from "./useSwipeGesture";

const FALLBACK_IMAGE: Record<DiscoverEntityKind, string> = {
  animal: "/images/auth/adoption.png",
  person: "/images/auth/rescue.png",
  organization: "/images/auth/wildlife.png",
  protector: "/images/hero-pet.jpg",
};

const TAG_TONES = [
  "bg-primary-soft text-(--pink-700)",
  "bg-success-soft text-(--mint-700)",
  "bg-warning-soft text-(--honey-700)",
  "bg-secondary-soft text-(--lilac-700)",
] as const;

type DiscoverCardProps = {
  item: DiscoverItem;
  onAction: (action: DiscoverAction) => void;
};

export function DiscoverCard({ item, onAction }: DiscoverCardProps) {
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const favRef = useRef<HTMLButtonElement>(null);
  const [favBurst, setFavBurst] = useState(0);
  const {
    offsetX,
    dragging,
    exiting,
    rotation,
    likeOpacity,
    skipOpacity,
    opacity,
    photoShift,
    exitMs,
    playExit,
    onPointerDown,
    onPointerMove,
    finishDrag,
  } = useSwipeGesture(cardRef, onAction);

  useGSAP(
    () => {
      if (reduced || !enterRef.current) return;
      gsap.fromTo(
        enterRef.current,
        { scale: 0.96, y: 18, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      );
    },
    { dependencies: [reduced, item.id] },
  );

  const popFavorite = useCallback(() => {
    if (!reduced && favRef.current) {
      gsap.fromTo(
        favRef.current,
        { scale: 1 },
        {
          scale: 1.16,
          duration: 0.16,
          yoyo: true,
          repeat: 1,
          ease: "back.out(2)",
          onComplete: () => {
            if (favRef.current) gsap.set(favRef.current, { clearProps: "transform" });
          },
        },
      );
    }
    setFavBurst((count) => count + 1);
    playExit("right", "favorite");
  }, [playExit, reduced]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        playExit("right", "like");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        playExit("left", "skip");
      } else if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        popFavorite();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playExit, popFavorite]);

  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-1 flex-col">
      <div className="relative min-h-0 flex-1 overflow-visible px-1">
        <div ref={enterRef} className="h-full">
          <div
            ref={cardRef}
            role="group"
            aria-label={item.title}
            aria-keyshortcuts="ArrowLeft ArrowRight f"
            className="relative flex h-full min-h-[28rem] cursor-grab touch-pan-y select-none flex-col overflow-hidden rounded-[2rem] bg-surface shadow-lg active:cursor-grabbing will-change-transform"
            style={{
              transform: `translate3d(${offsetX}px, 0, 0) rotate(${rotation}deg)`,
              opacity,
              transition: dragging
                ? "none"
                : exiting
                  ? `transform ${exitMs}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity ${exitMs}ms ease-out`
                  : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease-out",
              pointerEvents: exiting ? "none" : undefined,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
          >
            <div className="relative min-h-0 flex-1 overflow-hidden bg-surface-accent">
              <div
                className="absolute inset-0"
                style={{
                  transform: `translate3d(${photoShift}px, 0, 0) scale(1.08)`,
                }}
              >
                <Image
                  src={item.imageUrl ?? FALLBACK_IMAGE[item.kind]}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 32rem"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-text/50 via-transparent to-transparent" />

              <span
                className="pointer-events-none absolute top-5 left-5 inline-flex -rotate-12 items-center gap-1.5 rounded-full border-[3px] border-(--mint-700) bg-surface/90 px-3 py-1 font-display text-lg text-(--mint-700)"
                style={{ opacity: likeOpacity }}
                aria-hidden
              >
                <PawDoodle className="size-5" />
                {t.discover.actions.like}
              </span>
              <span
                className="pointer-events-none absolute top-5 right-5 inline-flex rotate-12 items-center rounded-full border-[3px] border-(--coral-700) bg-surface/90 px-3 py-1 font-display text-lg text-(--coral-700)"
                style={{ opacity: skipOpacity }}
                aria-hidden
              >
                {t.discover.actions.skip}
              </span>

              <span className="absolute bottom-4 left-4 rounded-full bg-surface px-3 py-1 font-display text-sm text-(--pink-700) shadow-sm">
                {t.discover.kinds[item.kind]}
              </span>
              {typeof item.distanceKm === "number" ? (
                <span className="absolute right-4 bottom-4 rounded-full bg-text/80 px-3 py-1 text-caption font-semibold text-surface shadow-sm">
                  {item.distanceKm.toFixed(1)} km
                </span>
              ) : null}
            </div>

            <div className="space-y-2 bg-background px-5 py-4">
              <h2 className="font-display text-3xl leading-none text-text sm:text-4xl">{item.title}</h2>
              {item.subtitle ? (
                <p className="max-w-sm text-body-sm text-text-secondary">{item.subtitle}</p>
              ) : null}
              {item.tags?.length ? (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {item.tags.map((tag, index) => (
                    <li
                      key={tag}
                      className={`rounded-full px-3 py-1 text-caption font-semibold ${TAG_TONES[index % TAG_TONES.length]}`}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex shrink-0 items-center justify-center gap-4">
        <button
          type="button"
          aria-label={t.discover.actions.skip}
          disabled={exiting}
          className="inline-flex size-14 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm transition duration-150 hover:scale-105 hover:border-danger/40 hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => playExit("left", "skip")}
        >
          <SkipForward className="size-6" aria-hidden />
        </button>
        <div className="relative size-12">
          <button
            ref={favRef}
            type="button"
            aria-label={t.discover.actions.favorite}
            disabled={exiting}
            className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-(--sky-700) shadow-sm transition duration-150 hover:scale-105 hover:bg-info-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            onClick={popFavorite}
          >
            <Star className="size-5" aria-hidden />
          </button>
          <ParticleBurst play={favBurst} count={7} shapes={["heart", "star", "paw"]} />
        </div>
        <button
          type="button"
          aria-label={t.discover.actions.like}
          disabled={exiting}
          className="inline-flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-surface-elevated shadow-sm transition duration-150 hover:scale-105 hover:bg-primary-hover hover:shadow-[var(--shadow-glow-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => playExit("right", "like")}
        >
          <Heart className="size-6 fill-current" aria-hidden />
        </button>
      </div>
      <p className="mt-2 text-center text-caption text-ink-muted">{t.discover.keyboardHint}</p>
    </div>
  );
}
