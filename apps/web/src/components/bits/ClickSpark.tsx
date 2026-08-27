"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children?: React.ReactNode;
  className?: string;
};

type Spark = { x: number; y: number; angle: number; startTime: number };

export default function ClickSpark({
  sparkColor = "#e07a96",
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 9,
  duration = 420,
  children,
  className = "",
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    return () => ro.disconnect();
  }, [reduced]);

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed > duration) return false;
        const t = elapsed / duration;
        const ease = 1 - (1 - t) * (1 - t);
        const dist = ease * sparkRadius;
        const x = spark.x + Math.cos(spark.angle) * dist;
        const y = spark.y + Math.sin(spark.angle) * dist;
        ctx.beginPath();
        ctx.fillStyle = sparkColor;
        ctx.globalAlpha = 1 - t;
        ctx.arc(x, y, sparkSize * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      if (sparksRef.current.length > 0) {
        requestAnimationFrame(draw);
      }
    },
    [duration, sparkColor, sparkRadius, sparkSize],
  );

  const onClick = (e: React.MouseEvent) => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (Math.PI * 2 * i) / sparkCount,
        startTime: now,
      });
    }
    requestAnimationFrame(draw);
  };

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[100]"
        aria-hidden
      />
      {children}
    </div>
  );
}
