"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type BurstShape = "paw" | "heart" | "star";

const COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--honey-600)",
  "var(--mint-600)",
] as const;

type ParticleBurstProps = {
  /** Increment to fire another burst. `0` stays quiet. */
  play: number;
  count?: number;
  shapes?: BurstShape[];
  className?: string;
};

function BurstShapeIcon({ shape }: { shape: BurstShape }) {
  if (shape === "heart") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
        <path d="M12 20s-7-4.2-7-8.8A3.9 3.9 0 0 1 12 8.4 3.9 3.9 0 0 1 19 11.2C19 15.8 12 20 12 20z" />
      </svg>
    );
  }
  if (shape === "star") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M12 2.8 14.4 9h6.4l-5.2 3.8 2 6.2L12 15.4 6.4 19l2-6.2L3.2 9h6.4L12 2.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="16.2" rx="4.2" ry="3.4" />
      <ellipse cx="6.2" cy="10.2" rx="2" ry="2.6" />
      <ellipse cx="9.6" cy="7.2" rx="1.8" ry="2.4" />
      <ellipse cx="14.4" cy="7.2" rx="1.8" ry="2.4" />
      <ellipse cx="17.8" cy="10.4" rx="2" ry="2.6" />
    </svg>
  );
}

/** Short celebratory spray of paws, hearts, and stars. DOM only — no canvas. */
export function ParticleBurst({
  play,
  count = 12,
  shapes = ["paw", "heart", "star"],
  className = "",
}: ParticleBurstProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const bits = root.current?.querySelectorAll<HTMLElement>("[data-bit]");
      if (reduced || play === 0 || !bits?.length) return;
      gsap.killTweensOf(bits);
      bits.forEach((el, index) => {
        const angle = (index / bits.length) * Math.PI * 2 + (index % 3) * 0.18;
        const distance = 64 + (index % 5) * 16;
        gsap.fromTo(
          el,
          { x: 0, y: 0, scale: 0.35, opacity: 1, rotate: 0 },
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 18,
            scale: 1,
            opacity: 0,
            rotate: index % 2 === 0 ? 28 : -32,
            duration: 0.85 + (index % 4) * 0.06,
            ease: "power2.out",
            delay: (index % 4) * 0.02,
          },
        );
      });
    },
    { dependencies: [play, reduced, count] },
  );

  if (reduced) return null;

  return (
    <div
      ref={root}
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-bit
          className="absolute left-1/2 top-1/2 opacity-0"
          style={{
            color: COLORS[index % COLORS.length],
            marginLeft: -10,
            marginTop: -10,
          }}
        >
          <BurstShapeIcon shape={shapes[index % shapes.length]} />
        </span>
      ))}
    </div>
  );
}
