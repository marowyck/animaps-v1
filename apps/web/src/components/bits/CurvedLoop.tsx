"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CurvedLoopProps = {
  marqueeText: string;
  speed?: number;
  className?: string;
  direction?: "left" | "right";
  textColor?: string;
  ribbonFill?: string;
  amplitude?: number;
  wavelength?: number;
  ribbonThickness?: number;
  /** Fill from above down to the ribbon wave (covers gap under previous section). */
  bridgeAbove?: boolean;
  bridgeAboveFill?: string;
  /**
   * Fill from the ribbon’s lower sine edge downward (e.g. footer `#1a1214`)
   * so the marquee text rides the same wave as the dark section below.
   */
  bridgeBelow?: boolean;
  bridgeBelowFill?: string;
  bridgeBelowExtend?: number;
};

/** Single continuous sine centerline — stroke fills the ribbon without polygon seams. */
function buildCenterlinePath(
  width: number,
  amplitude: number,
  wavelength: number,
  centerY: number,
) {
  if (width <= 0) return "";
  const step = 3;
  const pad = 2;
  let d = `M ${-pad} ${(centerY + Math.sin(-pad / wavelength) * amplitude).toFixed(2)}`;
  for (let x = 0; x <= width; x += step) {
    const y = centerY + Math.sin(x / wavelength) * amplitude;
    d += ` L ${x} ${y.toFixed(2)}`;
  }
  const endY = centerY + Math.sin((width + pad) / wavelength) * amplitude;
  d += ` L ${width + pad} ${endY.toFixed(2)}`;
  return d;
}

/**
 * Solid fill from above the band down to the lower edge of the wavy ribbon —
 * same sine as the stroke, so it reads as one continuous “ondinha”.
 */
function buildBridgeAbovePath(
  width: number,
  amplitude: number,
  wavelength: number,
  centerY: number,
  thickness: number,
  extendUp: number,
) {
  if (width <= 0) return "";
  const step = 3;
  const pad = 2;
  const half = thickness / 2;
  const topY = -extendUp;

  const bottom: string[] = [];
  for (let x = -pad; x <= width + pad; x += step) {
    const y = centerY + Math.sin(x / wavelength) * amplitude + half;
    bottom.push(`${x},${y.toFixed(2)}`);
  }
  const endX = width + pad;
  const endY =
    centerY + Math.sin(endX / wavelength) * amplitude + half;
  bottom.push(`${endX},${endY.toFixed(2)}`);

  let d = `M ${-pad},${topY}`;
  d += ` L ${endX},${topY}`;
  for (let i = bottom.length - 1; i >= 0; i--) d += ` L ${bottom[i]}`;
  return `${d} Z`;
}

/** Solid fill from the ribbon’s lower sine edge down (footer / next section). */
function buildBridgeBelowPath(
  width: number,
  amplitude: number,
  wavelength: number,
  centerY: number,
  thickness: number,
  extendDown: number,
) {
  if (width <= 0 || extendDown <= 0) return "";
  const step = 3;
  const pad = 2;
  const half = thickness / 2;
  const bottomY = centerY + amplitude + half + extendDown;

  const topEdge: string[] = [];
  for (let x = -pad; x <= width + pad; x += step) {
    const y = centerY + Math.sin(x / wavelength) * amplitude + half;
    topEdge.push(`${x},${y.toFixed(2)}`);
  }
  const endX = width + pad;
  const endY =
    centerY + Math.sin(endX / wavelength) * amplitude + half;
  topEdge.push(`${endX},${endY.toFixed(2)}`);

  let d = `M ${topEdge[0]}`;
  for (let i = 1; i < topEdge.length; i++) d += ` L ${topEdge[i]}`;
  d += ` L ${endX},${bottomY}`;
  d += ` L ${-pad},${bottomY}`;
  return `${d} Z`;
}

/**
 * Infinite marquee with one continuous wavy ribbon (no seam between loops).
 * bridgeAbove / bridgeBelow paint the same sine so text rides the section join.
 */
export default function CurvedLoop({
  marqueeText,
  speed = 36,
  className = "",
  direction = "left",
  textColor = "var(--ink)",
  ribbonFill = "var(--pastel-green)",
  amplitude = 18,
  wavelength = 88,
  ribbonThickness = 52,
  bridgeAbove = false,
  bridgeAboveFill,
  bridgeBelow = false,
  bridgeBelowFill = "#1a1214",
  bridgeBelowExtend = 96,
}: CurvedLoopProps) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  const unit = marqueeText.trim().endsWith("·")
    ? `${marqueeText.trim()} `
    : `${marqueeText.trim()} · `;
  const sequence = Array(5).fill(unit).join("");
  const full = sequence + sequence;
  const chars = Array.from(full);

  const bandH = ribbonThickness + amplitude * 2 + 28;
  const centerY = bandH / 2;
  const bridgeExtendUp = bridgeAbove ? 120 : 0;
  const bridgeExtendDown = bridgeBelow ? bridgeBelowExtend : 0;

  const halfW = textWidth / 2;
  const periodHint = 2 * Math.PI * wavelength;
  const periods =
    halfW > 0 ? Math.max(2, Math.round(halfW / periodHint)) : 2;
  const wl = halfW > 0 ? halfW / (2 * Math.PI * periods) : wavelength;

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => setTextWidth(el.scrollWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [full]);

  useGSAP(
    () => {
      const track = trackRef.current;
      const textEl = textRef.current;
      if (!track || !textEl || reduced || textWidth <= 0) return;

      const half = textWidth / 2;
      const letters = textEl.querySelectorAll<HTMLElement>("[data-wave-char]");

      const applyWave = () => {
        letters.forEach((el) => {
          const local = el.offsetLeft + el.offsetWidth / 2;
          const y = Math.sin(local / wl) * amplitude;
          el.style.transform = `translateY(${y}px)`;
        });
      };

      applyWave();
      gsap.set(track, { x: direction === "right" ? -half : 0 });

      const tween = gsap.to(track, {
        x: direction === "right" ? 0 : -half,
        duration: speed,
        ease: "none",
        repeat: -1,
      });

      return () => {
        tween.kill();
      };
    },
    {
      dependencies: [
        speed,
        direction,
        reduced,
        full,
        amplitude,
        wl,
        textWidth,
      ],
    },
  );

  const ribbonD = buildCenterlinePath(textWidth, amplitude, wl, centerY);
  const bridgeAboveD = bridgeAbove
    ? buildBridgeAbovePath(
        textWidth,
        amplitude,
        wl,
        centerY,
        ribbonThickness,
        bridgeExtendUp,
      )
    : "";
  const bridgeBelowD = bridgeBelow
    ? buildBridgeBelowPath(
        textWidth,
        amplitude,
        wl,
        centerY,
        ribbonThickness,
        bridgeExtendDown,
      )
    : "";

  const svgH = bandH + bridgeExtendUp + bridgeExtendDown;
  const svgTop = bridgeAbove ? -bridgeExtendUp : 0;

  return (
    <section
      className={`relative z-10 overflow-x-hidden overflow-y-visible ${
        bridgeAbove || bridgeBelow ? "-mt-1 pt-0 pb-0" : "bg-transparent py-2"
      } ${className}`}
      aria-hidden
      style={
        bridgeBelow
          ? { marginBottom: -Math.min(bridgeExtendDown, 72) }
          : undefined
      }
    >
      <div className="overflow-x-hidden overflow-y-visible">
        <div
          ref={trackRef}
          className="relative w-max will-change-transform"
          style={{ height: bandH + bridgeExtendDown }}
        >
          {textWidth > 0 && ribbonD ? (
            <svg
              className="pointer-events-none absolute left-0"
              width={textWidth + 4}
              height={svgH}
              viewBox={`-2 ${svgTop} ${textWidth + 4} ${svgH}`}
              aria-hidden
              style={{
                top: svgTop,
                overflow: "visible",
              }}
            >
              {bridgeAboveD ? (
                <path d={bridgeAboveD} fill={bridgeAboveFill ?? ribbonFill} />
              ) : null}
              {bridgeBelowD ? (
                <path d={bridgeBelowD} fill={bridgeBelowFill} />
              ) : null}
              <path
                d={ribbonD}
                fill="none"
                stroke={ribbonFill}
                strokeWidth={ribbonThickness}
                strokeLinecap="butt"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}

          <div
            ref={textRef}
            className="relative z-10 flex items-center whitespace-nowrap px-1"
            style={{ height: bandH }}
          >
            {chars.map((ch, i) => (
              <span
                key={`c-${i}`}
                data-wave-char
                className="font-display inline-block text-2xl tracking-tight md:text-3xl"
                style={{
                  color: textColor,
                  whiteSpace: ch === " " ? "pre" : undefined,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
