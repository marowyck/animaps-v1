import type { SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement>;

/**
 * Flat pastel doodles. They read the current palette through `currentColor`
 * (set `text-*` on the parent) plus the shared `--secondary` / `--honey-600`
 * tokens, so they stay in sync with the theme automatically.
 */

export function PawDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden {...rest}>
      <ellipse cx="32" cy="42" rx="13" ry="11" fill="currentColor" />
      <ellipse cx="16" cy="26" rx="6" ry="8" fill="currentColor" />
      <ellipse cx="27" cy="18" rx="5.5" ry="7.5" fill="currentColor" />
      <ellipse cx="39" cy="18" rx="5.5" ry="7.5" fill="currentColor" />
      <ellipse cx="49" cy="27" rx="6" ry="8" fill="currentColor" />
    </svg>
  );
}

export function HeartDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden {...rest}>
      <path
        d="M32 52s-16-9.6-16-20a9 9 0 0 1 16-5.8A9 9 0 0 1 48 32c0 10.4-16 20-16 20z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MapPinDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden {...rest}>
      <path
        d="M32 56s18-16 18-30a18 18 0 1 0-36 0c0 14 18 30 18 30z"
        fill="currentColor"
      />
      <circle cx="32" cy="26" r="7" className="fill-surface" />
    </svg>
  );
}

export function BoneDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden {...rest}>
      <path
        d="M18 24a6 6 0 1 1 6-10 6 6 0 0 1 10 0 6 6 0 1 1 6 10l4 8-4 8a6 6 0 1 1-6 10 6 6 0 0 1-10 0 6 6 0 1 1-6-10l-4-8z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Sitting dog, facing right. */
export function DogDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden {...rest}>
      <ellipse cx="62" cy="108" rx="34" ry="6" className="fill-text/10" />
      <path d="M30 70c-2 10 2 20 10 22 4-8 2-16-2-22z" fill="currentColor" />
      <path
        d="M34 62c0-20 14-36 34-36 16 0 28 12 30 28 6 2 12 8 12 16 0 8-6 14-14 14H46c-8 0-14-6-12-16z"
        fill="currentColor"
      />
      <path d="M86 78c8 2 16 10 14 18-6 2-12-2-14-8z" className="fill-secondary" />
      <ellipse cx="92" cy="46" rx="9" ry="13" fill="currentColor" />
      <ellipse cx="66" cy="42" rx="8" ry="12" fill="currentColor" />
      <ellipse cx="92" cy="50" rx="5" ry="7" className="fill-secondary" />
      <ellipse cx="66" cy="46" rx="4.5" ry="6.5" className="fill-secondary" />
      <circle cx="84" cy="66" r="3" className="fill-text" />
      <circle cx="100" cy="68" r="3" className="fill-text" />
      <ellipse cx="93" cy="76" rx="5" ry="3.5" className="fill-text/70" />
    </svg>
  );
}

/** Sitting cat with a curled tail. */
export function CatDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden {...rest}>
      <ellipse cx="60" cy="108" rx="30" ry="6" className="fill-text/10" />
      <path
        d="M34 66c2-24 14-40 30-40s28 14 30 38c8 4 14 12 12 20-2 10-12 16-24 16H46c-12 0-22-6-22-16 0-6 4-12 10-18z"
        fill="currentColor"
      />
      <path d="M40 34l-8-18 18 12z" fill="currentColor" />
      <path d="M80 34l8-18-18 12z" fill="currentColor" />
      <path d="M38 30l-4-10 10 7z" className="fill-secondary" />
      <path d="M82 30l4-10-10 7z" className="fill-secondary" />
      <path d="M96 92c10-2 16 6 12 12-8 2-14-4-14-10z" className="fill-secondary" />
      <circle cx="54" cy="64" r="3" className="fill-text" />
      <circle cx="74" cy="64" r="3" className="fill-text" />
      <path d="M62 70l3 4h-6z" className="fill-text/70" />
      <path d="M46 74h8M74 74h8" stroke="currentColor" className="stroke-text/40" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Small round bird. */
export function BirdDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden {...rest}>
      <ellipse cx="60" cy="108" rx="26" ry="5" className="fill-text/10" />
      <ellipse cx="60" cy="66" rx="30" ry="26" fill="currentColor" />
      <circle cx="78" cy="46" r="16" fill="currentColor" />
      <path d="M90 46l16 4-16 6z" className="fill-honey-600" />
      <circle cx="82" cy="44" r="2.5" className="fill-text" />
      <path d="M44 62c-14 2-20 12-16 16 8 0 16-6 18-12z" className="fill-secondary" />
      <path d="M50 92l-4 12M70 92l4 12" className="stroke-honey-600" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Group of a person with a dog and a cat — the "community" doodle. */
export function FamilyDoodle({ className, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 150" fill="none" className={className} aria-hidden {...rest}>
      <ellipse cx="100" cy="140" rx="78" ry="7" className="fill-text/10" />
      <circle cx="100" cy="46" r="16" fill="currentColor" />
      <path d="M74 120V78c0-12 12-20 26-20s26 8 26 20v42z" fill="currentColor" />
      <path d="M86 66c-10 6-16 18-14 30l10-4c0-10 2-18 8-24z" className="fill-secondary" />
      <path d="M58 104c-2-16 6-30 18-36 2 10-2 20-8 28z" className="fill-secondary" />
      <ellipse cx="46" cy="100" rx="16" ry="12" className="fill-secondary" />
      <circle cx="34" cy="92" r="8" className="fill-secondary" />
      <circle cx="31" cy="90" r="1.6" className="fill-text" />
      <path d="M150 112c2-18-6-34-20-40-2 12 2 22 8 30z" fill="currentColor" />
      <ellipse cx="166" cy="108" rx="15" ry="11" fill="currentColor" />
      <circle cx="178" cy="100" r="8" fill="currentColor" />
      <path d="M174 92l4-10 6 8z" fill="currentColor" />
      <circle cx="180" cy="98" r="1.6" className="fill-text" />
    </svg>
  );
}
