"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DISTANCE, DURATION, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Staggered entrance for an app screen. Mark the pieces in reading order with
 * `data-enter` (heading, subtitle, primary action, content). Without marks the
 * blocks of the page root enter in sequence.
 */
export function usePageEnter<T extends HTMLElement = HTMLDivElement>(
  key?: string,
  axis: "y" | "x" = "y",
) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (reduced || !root) return;
      const marked = root.querySelectorAll<HTMLElement>("[data-enter]");
      const shell = root.children.length === 1 ? root.children[0] : root;
      const targets = marked.length ? Array.from(marked) : Array.from(shell.children);
      if (!targets.length) return;
      gsap.fromTo(
        targets,
        axis === "x"
          ? { x: DISTANCE.enter, opacity: 0 }
          : { y: DISTANCE.small, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: DURATION.enter,
          stagger: STAGGER,
          ease: EASE.settle,
          clearProps: "transform,opacity",
        },
      );
    },
    { scope: ref, dependencies: [reduced, key, axis] },
  );

  return ref;
}
