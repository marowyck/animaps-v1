"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type AnimatedContentProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  ease?: string;
};

export default function AnimatedContent({
  children,
  className = "",
  delay = 0,
  distance = 32,
  ease = "back.out(1.5)",
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.from(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: distance,
        opacity: 0,
        duration: 0.65,
        delay,
        ease,
      });
    },
    { dependencies: [reduced, delay, distance, ease] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
