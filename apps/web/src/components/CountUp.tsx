"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE } from "@/lib/motion";

type CountUpProps = {
  value: number;
  className?: string;
  /** Formats each frame; defaults to a rounded integer. */
  format?: (n: number) => string;
  duration?: number;
  delay?: number;
};

/**
 * Counts from 0 to `value` on mount. Plays on mount rather than on scroll because
 * app screens scroll inside <main>, not the window. The final value is always in the DOM.
 */
export function CountUp({
  value,
  className = "",
  format,
  duration = 0.9,
  delay = 0.2,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const render = format ?? ((n: number) => String(Math.round(n)));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced || value === 0) return;
      const state = { n: 0 };
      el.textContent = render(0);
      gsap.to(state, {
        n: value,
        duration,
        delay,
        ease: EASE.settle,
        onUpdate: () => {
          el.textContent = render(state.n);
        },
        onComplete: () => {
          el.textContent = render(value);
        },
      });
    },
    { dependencies: [value, reduced] },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {render(value)}
    </span>
  );
}
