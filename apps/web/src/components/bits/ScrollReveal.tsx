"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Soft blur + word scrub mode for string children. */
  cinematic?: boolean;
  enableBlur?: boolean;
  baseOpacity?: number;
  blurStrength?: number;
};

/**
 * Dual-mode reveal:
 * - default: simple fade/slide for any children (ANIMAPS original)
 * - cinematic: word unblur scrub for string children (React Bits style)
 */
export default function ScrollReveal({
  children,
  className = "",
  cinematic = false,
  enableBlur = true,
  baseOpacity = 0.15,
  blurStrength = 4,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      if (cinematic && typeof children === "string") {
        const words = ref.current.querySelectorAll<HTMLElement>(".sr-word");
        const tweens: gsap.core.Tween[] = [];

        tweens.push(
          gsap.fromTo(
            words,
            { opacity: baseOpacity, willChange: "opacity, filter" },
            {
              ease: "none",
              opacity: 1,
              stagger: 0.05,
              scrollTrigger: {
                trigger: ref.current,
                start: "top 90%",
                end: "top 45%",
                scrub: true,
              },
            },
          ),
        );

        if (enableBlur) {
          tweens.push(
            gsap.fromTo(
              words,
              { filter: `blur(${blurStrength}px)` },
              {
                ease: "none",
                filter: "blur(0px)",
                stagger: 0.05,
                scrollTrigger: {
                  trigger: ref.current,
                  start: "top 90%",
                  end: "top 45%",
                  scrub: true,
                },
              },
            ),
          );
        }

        return () => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
        };
      }

      // fromTo + once avoids Lenis leaving elements stuck at opacity: 0
      gsap.fromTo(
        ref.current,
        { y: 28, scale: 0.92, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.6)",
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
    {
      dependencies: [
        reduced,
        cinematic,
        enableBlur,
        baseOpacity,
        blurStrength,
        children,
      ],
    },
  );

  if (cinematic && typeof children === "string") {
    const parts = children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="sr-word inline-block" key={index}>
          {word}
        </span>
      );
    });
    return (
      <div ref={ref} className={className}>
        {parts}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
