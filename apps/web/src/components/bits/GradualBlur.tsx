"use client";

import { useMemo, type CSSProperties } from "react";

type GradualBlurProps = {
  position?: "top" | "bottom";
  strength?: number;
  height?: string;
  divCount?: number;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
};

/** Soft edge blur fade — React Bits GradualBlur, simplified for section exits. */
export default function GradualBlur({
  position = "bottom",
  strength = 1.6,
  height = "5rem",
  divCount = 5,
  zIndex = 20,
  className = "",
  style,
}: GradualBlurProps) {
  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / divCount;
    const direction = position === "top" ? "to top" : "to bottom";

    for (let i = 1; i <= divCount; i++) {
      const progress = i / divCount;
      const blurValue = 0.0625 * (progress * divCount + 1) * strength;
      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      divs.push(
        <div
          key={i}
          className="absolute inset-0"
          style={{
            maskImage: `linear-gradient(${direction}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
          }}
        />,
      );
    }
    return divs;
  }, [divCount, position, strength]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${position === "top" ? "top-0" : "bottom-0"} ${className}`}
      style={{
        height,
        zIndex,
        ...style,
      }}
    >
      {blurDivs}
    </div>
  );
}
