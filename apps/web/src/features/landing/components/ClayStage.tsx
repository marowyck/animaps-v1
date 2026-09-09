"use client";

import type { ReactNode } from "react";
import { ClayFigure, type ClayKey } from "./ClayFigure";

type ClayStageProps = {
  name: ClayKey;
  caption: string;
  className?: string;
  figureClassName?: string;
  size?: number;
  sizes?: string;
  priority?: boolean;
  tone?: "pink" | "green" | "sky" | "yellow";
  children?: ReactNode;
};

const TONE = {
  pink: "from-pastel-pink/80 to-white",
  green: "from-pastel-green/80 to-white",
  sky: "from-pastel-sky/90 to-white",
  yellow: "from-pastel-yellow/80 to-white",
} as const;

/**
 * Framed “stage” for clay mascots — gives each figure a clear narrative home
 * instead of floating randomly over the layout.
 */
export function ClayStage({
  name,
  caption,
  className = "",
  figureClassName = "",
  size = 240,
  sizes = "(max-width: 768px) 180px, 240px",
  priority = false,
  tone = "pink",
  children,
}: ClayStageProps) {
  return (
    <aside
      className={`relative flex flex-col items-center rounded-[2rem] bg-gradient-to-b ${TONE[tone]} p-5 shadow-[0_16px_40px_-16px_rgba(36,48,40,0.18)] md:p-6 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-8 bottom-16 h-16 rounded-[100%] bg-ink/5 blur-md"
        aria-hidden
      />
      <ClayFigure
        name={name}
        size={size}
        sizes={sizes}
        priority={priority}
        float
        className={`relative z-10 ${figureClassName}`}
      />
      {/* Soft clay podium */}
      <div
        className="relative z-[1] -mt-3 h-4 w-[70%] rounded-[100%] bg-white/90 shadow-[0_8px_20px_-6px_rgba(36,48,40,0.2)]"
        aria-hidden
      />
      <p className="relative z-10 mt-4 max-w-[16rem] text-center text-sm font-semibold leading-snug text-ink">
        {caption}
      </p>
      {children}
    </aside>
  );
}
