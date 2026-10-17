"use client";

export type PrivacyVisibility = "public" | "matches" | "private";

type PrivacySelectorProps = {
  value: PrivacyVisibility;
  onChange: (value: PrivacyVisibility) => void;
  labels: Record<PrivacyVisibility, string>;
  groupLabel?: string;
};

const ORDER: PrivacyVisibility[] = ["public", "matches", "private"];

export function PrivacySelector({
  value,
  onChange,
  labels,
  groupLabel = "Visibility",
}: PrivacySelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-caption font-semibold text-text-secondary">
        {groupLabel}
      </legend>
      <div
        className="inline-flex rounded-full bg-surface p-1 shadow-sm"
        role="group"
      >
        {ORDER.map((key) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(key)}
              className={[
                "min-h-11 cursor-pointer rounded-full px-4 py-1.5 text-body-sm font-semibold transition-colors duration-(--duration-fast) ease-(--ease-out)",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                selected
                  ? "bg-primary-soft text-primary-ink"
                  : "text-text-secondary hover:text-text",
              ].join(" ")}
            >
              {labels[key]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
