"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const CLAY = {
  puppy: {
    src: "/images/clay/clay-puppy.webp",
    alt: "Mascote de massinha: cachorrinho sorridente",
    w: 1440,
    h: 1580,
  },
  cat: {
    src: "/images/clay/clay-calico-cat.webp",
    alt: "Mascote de massinha: gatinha calico",
    w: 1440,
    h: 2026,
  },
  family: {
    src: "/images/clay/clay-family.png",
    alt: "Família de massinha com gato e cachorro",
    w: 1011,
    h: 841,
  },
  critter: {
    src: "/images/clay/clay-critter.webp",
    alt: "Mascote de massinha: bichinho selvagem",
    w: 1440,
    h: 1142,
  },
  monkey: {
    src: "/images/clay/clay-monkey.webp",
    alt: "Mascote de massinha: macaquinho com banana",
    w: 1440,
    h: 1350,
  },
} as const;

export type ClayKey = keyof typeof CLAY;

type ClayFigureProps = {
  name: ClayKey;
  className?: string;
  size?: number | string;
  /** CSS float — cheaper than GSAP loops */
  float?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Skip Next optimizer (use for large HQ PNGs) */
  unoptimized?: boolean;
  onClick?: () => void;
};

/**
 * Clay mascot — high-res WebP sources (1440w) for crisp retina display.
 */
export function ClayFigure({
  name,
  className = "",
  size = 220,
  float = true,
  priority = false,
  sizes = "(max-width: 768px) 200px, 320px",
  unoptimized,
  onClick,
}: ClayFigureProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const asset = CLAY[name];
  const skipOptimize = unoptimized ?? name === "family";

  const wiggle = () => {
    if (!wrapRef.current || reduced) {
      onClick?.();
      return;
    }
    gsap.fromTo(
      wrapRef.current,
      { rotate: 0, scale: 1 },
      {
        rotate: 8,
        scale: 1.05,
        duration: 0.12,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.set(wrapRef.current, { rotate: 0, scale: 1 });
          onClick?.();
        },
      },
    );
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      wiggle();
    }
  };

  const sizeStyle: CSSProperties | undefined = className.includes("!w-")
    ? { maxWidth: "100%" }
    : typeof size === "number"
      ? { width: size, maxWidth: "100%" }
      : { width: size, maxWidth: "100%" };

  return (
    <div
      ref={wrapRef}
      className={`relative inline-block max-w-full [&_img]:h-auto [&_img]:w-full ${
        float && !reduced ? "clay-float" : ""
      } ${className}`}
      style={sizeStyle}
      onClick={wiggle}
      role="img"
      onKeyDown={onKey}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.w}
        height={asset.h}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={skipOptimize ? 100 : 92}
        unoptimized={skipOptimize}
        sizes={sizes}
        className="h-auto w-full select-none drop-shadow-[0_12px_28px_rgba(26,18,20,0.14)]"
        draggable={false}
      />
    </div>
  );
}
