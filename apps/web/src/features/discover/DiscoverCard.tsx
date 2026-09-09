"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";
import { Heart, SkipForward, Star } from "lucide-react";
import { useT } from "@/i18n";
import type { DiscoverAction, DiscoverItem } from "./types";

type DiscoverCardProps = {
  item: DiscoverItem;
  onAction: (action: DiscoverAction) => void;
};

const SWIPE_THRESHOLD = 72;
/** Keep sliding past the release point so it feels like a gentle slip. */
const EXIT_EXTRA = 0.55;
const EXIT_MS = 420;

export function DiscoverCard({ item, onAction }: DiscoverCardProps) {
  const t = useT();
  const cardRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState(false);
  const startX = useRef(0);
  const offsetRef = useRef(0);
  const exitLock = useRef(false);

  const setOffset = (value: number) => {
    offsetRef.current = value;
    setOffsetX(value);
  };

  const playExit = useCallback(
    (dir: "left" | "right", action: DiscoverAction) => {
      if (exitLock.current) return;
      exitLock.current = true;
      setDragging(false);

      const width = cardRef.current?.offsetWidth ?? 360;
      const from = offsetRef.current;
      const slipTarget =
        dir === "right"
          ? Math.max(from, 0) + width * EXIT_EXTRA
          : Math.min(from, 0) - width * EXIT_EXTRA;

      // Two-frame commit so the browser applies current offset before easing out.
      requestAnimationFrame(() => {
        setExiting(true);
        setOffset(slipTarget);
      });

      window.setTimeout(() => {
        onAction(action);
      }, EXIT_MS);
    },
    [onAction],
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (exiting) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || exiting) return;
    setOffset(e.clientX - startX.current);
  };

  const finishDrag = () => {
    if (!dragging || exiting) return;
    setDragging(false);
    const x = offsetRef.current;
    if (x > SWIPE_THRESHOLD) {
      playExit("right", "like");
      return;
    }
    if (x < -SWIPE_THRESHOLD) {
      playExit("left", "skip");
      return;
    }
    setOffset(0);
  };

  const rotation = offsetX * 0.018;
  const likeOpacity = Math.min(0.9, Math.max(0, offsetX / SWIPE_THRESHOLD));
  const skipOpacity = Math.min(0.9, Math.max(0, -offsetX / SWIPE_THRESHOLD));
  /** Soft fade only as it slips away — still readable while sliding. */
  const opacity = exiting ? 0.35 : 1;

  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-1 flex-col">
      {/* Stage allows the card to slip sideways without clipping. */}
      <div className="relative min-h-0 flex-1 overflow-visible px-1">
        <div
          ref={cardRef}
          role="group"
          aria-label={item.title}
          className="relative flex h-full min-h-[28rem] cursor-grab touch-pan-y select-none flex-col overflow-hidden rounded-[2rem] border-2 border-border-soft bg-white shadow-xl active:cursor-grabbing will-change-transform"
          style={{
            transform: `translate3d(${offsetX}px, 0, 0) rotate(${rotation}deg)`,
            opacity,
            transition: dragging
              ? "none"
              : exiting
                ? `transform ${EXIT_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity ${EXIT_MS}ms ease-out`
                : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease-out",
            pointerEvents: exiting ? "none" : undefined,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
        <div className="relative min-h-0 flex-1 animate-gradient-shift bg-gradient-to-br from-pastel-pink via-pastel-sky to-pastel-green">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl text-ink/20 sm:text-6xl">
              ANIMAPS
            </span>
          </div>

          <span
            className="pointer-events-none absolute left-5 top-5 rounded-full border-4 border-brand-green px-4 py-1 text-lg font-black uppercase tracking-wide text-brand-green"
            style={{ opacity: likeOpacity }}
            aria-hidden
          >
            {t.discover.actions.like}
          </span>
          <span
            className="pointer-events-none absolute right-5 top-5 rounded-full border-4 border-error px-4 py-1 text-lg font-black uppercase tracking-wide text-error"
            style={{ opacity: skipOpacity }}
            aria-hidden
          >
            {t.discover.actions.skip}
          </span>

          {typeof item.distanceKm === "number" ? (
            <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-green shadow-sm">
              {item.distanceKm.toFixed(1)} km
            </span>
          ) : null}
        </div>

        <div className="space-y-2 border-t border-border-soft bg-white px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-pink">
            {t.discover.kinds[item.kind]}
          </p>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">{item.title}</h2>
          {item.subtitle ? (
            <p className="text-sm text-ink-muted">{item.subtitle}</p>
          ) : null}
          {item.tags?.length ? (
            <ul className="flex flex-wrap gap-2 pt-1">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border-soft bg-gray-soft px-3 py-1 text-xs font-semibold text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        </div>
      </div>

      <div className="mt-4 flex shrink-0 items-center justify-center gap-4">
        <button
          type="button"
          aria-label={t.discover.actions.skip}
          disabled={exiting}
          className="inline-flex size-14 cursor-pointer items-center justify-center rounded-full border-2 border-border-soft bg-white text-error shadow-md transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:pointer-events-none disabled:opacity-50"
          onClick={() => playExit("left", "skip")}
        >
          <SkipForward className="size-6" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t.discover.actions.favorite}
          disabled={exiting}
          className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-border-soft bg-white text-brand-blue shadow-md transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:pointer-events-none disabled:opacity-50"
          onClick={() => playExit("right", "favorite")}
        >
          <Star className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t.discover.actions.like}
          disabled={exiting}
          className="inline-flex size-14 cursor-pointer items-center justify-center rounded-full border-2 border-brand-green/40 bg-brand-green text-white shadow-md transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:pointer-events-none disabled:opacity-50"
          onClick={() => playExit("right", "like")}
        >
          <Heart className="size-6 fill-current" aria-hidden />
        </button>
      </div>
    </div>
  );
}
