"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DISTANCE, DURATION, EASE, STAGGER } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type AnimatedContentProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  /** Reveal direct children one after another instead of the wrapper as a block. */
  stagger?: boolean;
  as?: "div" | "ul" | "ol" | "section";
};

/** Reveal on scroll: fade + short rise, settled ease. Plays once. */
export default function AnimatedContent({
  children,
  className = "",
  delay = 0,
  distance = DISTANCE.enter,
  stagger = false,
  as: Tag = "div",
}: AnimatedContentProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (reduced || !root) return;
      const targets = stagger ? Array.from(root.children) : root;
      gsap.fromTo(
        targets,
        { y: distance, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.enter,
          delay,
          stagger: stagger ? STAGGER : 0,
          ease: EASE.settle,
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: { trigger: root, start: "top 88%", once: true },
        },
      );
    },
    { dependencies: [reduced, delay, distance, stagger] },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
