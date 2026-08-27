"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MagnetProps = {
  children: ReactNode;
  padding?: number;
  magnetStrength?: number;
  className?: string;
};

export default function Magnet({
  children,
  padding = 40,
  magnetStrength = 4,
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      ref.current.style.transform = `translate(${x / magnetStrength}px, ${y / magnetStrength}px)`;
    },
    [magnetStrength, reduced],
  );

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }, []);

  return (
    <div
      className={`inline-block ${className}`}
      style={{ padding }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={ref}
        className="transition-transform duration-150 ease-out will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
