"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type HeadingPart = {
  text: string;
  className?: string;
};

type AnimatedHeadingProps = {
  parts: HeadingPart[];
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
  delay?: number;
  /** `mount` plays immediately; `scroll` waits until the heading nears the viewport. */
  trigger?: "mount" | "scroll";
};

/**
 * Word-by-word reveal. Used sparingly — hero and the match celebration —
 * so the rest of the page can stay still.
 */
export function AnimatedHeading({
  parts,
  as: Tag = "h2",
  id,
  className = "",
  delay = 0,
  trigger = "mount",
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const signature = parts.map((part) => part.text).join("|");

  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (reduced || !ref.current || !words?.length) return;
      gsap.fromTo(
        words,
        { yPercent: 115, rotate: 6, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.7,
          delay,
          stagger: 0.055,
          ease: "back.out(1.45)",
          scrollTrigger:
            trigger === "scroll"
              ? { trigger: ref.current, start: "top 88%", once: true }
              : undefined,
        },
      );
    },
    { dependencies: [reduced, delay, trigger, signature] },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {parts.map((part, partIndex) =>
        part.text
          .split(/\s+/)
          .filter(Boolean)
          .map((word, wordIndex) => (
            <span
              key={`${partIndex}-${wordIndex}`}
              className="mr-[0.28em] inline-block overflow-hidden py-[0.08em] align-bottom"
            >
              <span data-word className={`inline-block ${part.className ?? ""}`}>
                {word}
              </span>
            </span>
          )),
      )}
    </Tag>
  );
}
