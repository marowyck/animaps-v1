"use client";

import { useId } from "react";

type BarListProps = {
  items: { key: string; label: string; count: number }[];
  empty: string;
  className?: string;
};

/** SVG bar chart with a text table for the same values. */
export function BarList({ items, empty, className = "" }: BarListProps) {
  const titleId = useId();

  if (items.length === 0) {
    return <p className="text-body-sm text-text-secondary">{empty}</p>;
  }

  const max = Math.max(...items.map((i) => i.count), 1);
  const row = 28;
  const height = items.length * row;

  return (
    <figure className={className}>
      <svg
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
      <table className="mt-2 w-full text-sm">
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <th scope="row" className="py-1 pr-3 text-left font-semibold text-ink">
                {item.label}
              </th>
              <td className="py-1 text-right font-bold tabular-nums text-ink-muted">
                {item.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
