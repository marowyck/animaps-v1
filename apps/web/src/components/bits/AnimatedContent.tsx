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
  pop?: boolean;
};

/** Default physics: elastic pop — back.out(1.6) */
export default function AnimatedContent({
  children,
  className = "",
  delay = 0,
  distance = 32,
  ease = "back.out(1.6)",
  pop = true,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.fromTo(
        ref.current,
        {
          y: distance,
          scale: pop ? 0.86 : 1,
          rotate: pop ? -1.5 : 0,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.75,
          delay,
          ease,
          immediateRender: false,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            once: true,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { dependencies: [reduced, delay, distance, ease, pop] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
