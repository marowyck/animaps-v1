"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PATHS = [
  "M60 20C110 8 170 30 182 80C194 130 160 180 110 186C55 192 18 160 16 110C14 60 20 32 60 20Z",
  "M90 16C140 8 188 48 184 100C180 150 140 188 88 176C40 166 12 130 28 86C40 50 48 24 90 16Z",
  "M70 28C120 10 168 40 176 92C184 144 150 190 100 184C48 178 20 140 32 92C42 52 40 40 70 28Z",
] as const;

type BlobProps = {
  className?: string;
  /** Which asymmetric silhouette to paint. */
  variant?: 0 | 1 | 2;
};

/**
 * Soft organic color field. Color comes from `currentColor`
 * (set a `text-*` utility on `className`). A slow squash-and-turn
 * stands in for path morphing so we don't need a paid GSAP plugin.
 */
export function Blob({ className = "", variant = 0 }: BlobProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.to(ref.current, {
        scaleX: 1.07,
        scaleY: 0.93,
        rotation: variant % 2 === 0 ? 8 : -7,
        duration: 5.4 + variant * 0.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    },
    { dependencies: [reduced, variant] },
  );

  return (
    <div ref={ref} className={`pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="h-full w-full" fill="currentColor">
        <path d={PATHS[variant]} />
      </svg>
    </div>
  );
}
