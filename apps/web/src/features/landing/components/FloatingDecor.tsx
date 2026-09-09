"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** Soft SVG decorations + clickable paw easter eggs */
export function FloatingDecor() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>("[data-speed]");
      items.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.9");
        gsap.to(el, {
          y: () => (1 - speed) * Math.min(ScrollTrigger.maxScroll(window), 4000) * 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  const hop = (el: SVGSVGElement) => {
    gsap.fromTo(
      el,
      { scale: 1, rotate: 0 },
      {
        scale: 1.35,
        rotate: 15,
        duration: 0.22,
        yoyo: true,
        repeat: 1,
        ease: "back.out(2)",
      },
    );
  };

  if (reduced) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-full overflow-hidden"
      aria-hidden
    >
      <svg
        data-speed="0.7"
        className="absolute left-[6%] top-[18%] h-14 w-24 opacity-40 md:h-20 md:w-36"
        viewBox="0 0 120 60"
      >
        <path
          fill="#ffffff"
          d="M20 40 C15 25, 35 15, 50 25 C60 10, 90 15, 95 30 C110 28, 115 45, 100 50 C95 58, 70 55, 60 48 C45 58, 25 55, 20 40 Z"
        />
      </svg>

      <svg
        data-speed="1.1"
        className="absolute right-[8%] top-[38%] h-12 w-20 opacity-35 md:h-16 md:w-28"
        viewBox="0 0 120 60"
      >
        <path
          fill="#ffffff"
          d="M25 38 C20 24, 40 14, 55 24 C65 10, 92 14, 98 30 C112 28, 115 44, 100 48 C94 56, 68 54, 58 46 C44 56, 28 52, 25 38 Z"
        />
      </svg>

      {/* Clickable easter-egg paws */}
      <svg
        data-speed="0.85"
        className="egg-paw pointer-events-auto absolute left-[8%] top-[52%] h-9 w-9 cursor-pointer text-brand-pink/40 md:h-12 md:w-12"
        viewBox="0 0 40 40"
        fill="currentColor"
        onClick={(e) => hop(e.currentTarget)}
      >
        <ellipse cx="20" cy="26" rx="10" ry="9" />
        <circle cx="10" cy="14" r="4" />
        <circle cx="17" cy="10" r="4" />
        <circle cx="25" cy="10" r="4" />
        <circle cx="31" cy="15" r="4" />
      </svg>

      <svg
        data-speed="1.15"
        className="egg-paw pointer-events-auto absolute right-[10%] top-[68%] h-8 w-8 cursor-pointer text-brand-green/40 md:h-11 md:w-11"
        viewBox="0 0 40 40"
        fill="currentColor"
        onClick={(e) => hop(e.currentTarget)}
      >
        <ellipse cx="20" cy="26" rx="10" ry="9" />
        <circle cx="10" cy="14" r="4" />
        <circle cx="17" cy="10" r="4" />
        <circle cx="25" cy="10" r="4" />
        <circle cx="31" cy="15" r="4" />
      </svg>

      <svg
        data-speed="0.75"
        className="absolute left-[72%] top-[22%] h-8 w-6 opacity-35 md:h-12 md:w-9"
        viewBox="0 0 40 50"
      >
        <path
          fill="#5faf6a"
          d="M20 2 C35 18, 38 35, 20 48 C2 35, 5 18, 20 2 Z"
        />
        <path stroke="#4e9858" strokeWidth="1.5" fill="none" d="M20 8 L20 42" />
      </svg>
    </div>
  );
}
