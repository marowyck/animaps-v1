/**
 * One motion language for the whole product.
 * `settle` for anything arriving or responding, `exit` for anything leaving.
 * `celebrate` (overshoot) is reserved for earned moments: match, favorite, step done.
 * Mirrors the --duration-* / --ease-* tokens in globals.css.
 */
export const EASE = {
  settle: "power3.out",
  exit: "power2.in",
  celebrate: "back.out(1.6)",
} as const;

export const DURATION = {
  hover: 0.16,
  state: 0.24,
  enter: 0.52,
} as const;

export const STAGGER = 0.06;

export const DISTANCE = {
  enter: 20,
  small: 12,
} as const;
