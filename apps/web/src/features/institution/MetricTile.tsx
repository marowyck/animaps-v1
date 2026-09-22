const TONES = [
  "rounded-[1.7rem] bg-primary-soft",
  "rounded-[1.35rem] bg-secondary-soft",
  "rounded-[1.5rem] bg-warning-soft",
  "rounded-[1.9rem] bg-success-soft",
  "rounded-[1.25rem] bg-info-soft",
] as const;

type MetricTileProps = {
  label: string;
  value: string | number;
  /** Cycles the wash so a row of metrics is not five identical boxes. */
  tone?: number;
};

export function MetricTile({ label, value, tone = 0 }: MetricTileProps) {
  return (
    <div className={`px-4 py-4 ${TONES[Math.abs(tone) % TONES.length]}`}>
      <p className="text-caption font-semibold text-text-secondary">{label}</p>
      <p className="mt-1 font-display text-4xl leading-none tabular-nums text-text">{value}</p>
    </div>
  );
}
