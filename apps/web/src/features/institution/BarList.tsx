"use client";

import { useId, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

type BarListProps = {
  items: { key: string; label: string; count: number }[];
  empty: string;
  className?: string;
};

/** SVG bar chart with a text table for the same values. Bars grow in on mount and on data change. */
export function BarList({ items, empty, className = "" }: BarListProps) {
  const titleId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();
  const signature = items.map((i) => `${i.key}:${i.count}`).join("|");

  useGSAP(
    () => {
      const bars = svgRef.current?.querySelectorAll("rect");
      if (reduced || !bars?.length) return;
      gsap.fromTo(
        bars,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: DURATION.enter + 0.2,
          stagger: STAGGER,
          ease: EASE.settle,
          delay: 0.15,
        },
      );
    },
    { scope: svgRef, dependencies: [reduced, signature] },
  );

  if (items.length === 0) {
    return <p className="text-body-sm text-text-secondary">{empty}</p>;
  }

  const max = Math.max(...items.map((i) => i.count), 1);
  const row = 28;
  const height = items.length * row;

  return (
    <figure className={className}>
      <svg
        ref={svgRef}
        role="img"
        aria-labelledby={titleId}
        viewBox={`0 0 100 ${height}`}
        className="h-auto w-full"
      >
        <title id={titleId}>
          {items.map((item) => `${item.label}: ${item.count}`).join(", ")}
        </title>
        {items.map((item, index) => {
          const width = Math.max((item.count / max) * 100, item.count > 0 ? 4 : 0);
          const fill = ["fill-primary", "fill-secondary", "fill-success", "fill-honey-600", "fill-info"][
            index % 5
          ];
          return (
            <rect
              key={item.key}
              x="0"
              y={index * row + 6}
              width={width}
              height={16}
              rx="8"
              className={fill}
            />
          );
        })}
      </svg>
      <table className="mt-3 w-full text-body-sm">
        <tbody>
          {items.map((item) => (
            <tr key={item.key} className="border-b border-border-subtle last:border-0">
              <th scope="row" className="py-1.5 pr-3 text-left font-semibold text-text">
                {item.label}
              </th>
              <td className="py-1.5 text-right font-semibold tabular-nums text-text-secondary">
                {item.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
