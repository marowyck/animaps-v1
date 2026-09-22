"use client";

import { useCallback, useRef, useState, type PointerEvent, type RefObject } from "react";
import type { DiscoverAction } from "./types";

const SWIPE_THRESHOLD = 72;
const EXIT_EXTRA = 0.55;
const EXIT_MS = 420;

export function useSwipeGesture(
  cardRef: RefObject<HTMLDivElement | null>,
  onAction: (action: DiscoverAction) => void,
) {
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

      requestAnimationFrame(() => {
        setExiting(true);
        setOffset(slipTarget);
      });

      window.setTimeout(() => {
        onAction(action);
      }, EXIT_MS);
    },
    [cardRef, onAction],
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
  const opacity = exiting ? 0.35 : 1;
  /** Photo drifts against the card so the portrait feels deeper than the frame. */
  const photoShift = -offsetX * 0.16;

  return {
    offsetX,
    dragging,
    exiting,
    rotation,
    likeOpacity,
    skipOpacity,
    opacity,
    photoShift,
    exitMs: EXIT_MS,
    playExit,
    onPointerDown,
    onPointerMove,
    finishDrag,
  };
}
