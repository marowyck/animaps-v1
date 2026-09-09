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
      <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">
        {groupLabel}
      </legend>
      <div className="inline-flex rounded-full border-2 border-border-soft bg-gray-soft p-1">
        {ORDER.map((key) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(key)}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
                selected
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink",
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
