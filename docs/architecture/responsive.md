# ANIMAPS — Responsive

Mobile-first. Breakpoints are Tailwind's (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Do not add a custom breakpoint unless a layout truly needs it.

## Layouts

| Surface | Small | `md` and up |
|---|---|---|
| Landing | Stacked sections, full-viewport blocks, bubble menu | Header CTAs visible; multi-column grids |
| Auth | Form only | Split: carousel + form |
| Onboarding | Single column, sticky continue | Same flow, wider card grids |
| App shell | Bottom `MobileNav`, no sidebar | Sidebar + content |
| Institution map | Full-width map, list below | Same; map height stays `28rem` |

## Rules

- Touch targets stay at least 44px (`min-h-11` on compact buttons, `size-11` icon buttons).
- Do not hide the only path to an action below `md`. Landing login/register move into the bubble menu on small screens; they do not disappear.
- The How it works leash is decorative and desktop-only. The four steps still read without it.
- Dashboard content scrolls inside the shell (`h-dvh`). Maps disable scroll-wheel zoom so the page can still scroll.
- Ultrawide: cap reading columns (`max-w-5xl` / `max-w-3xl`). Do not stretch a form across the viewport.

## Type

The display and H1/H2 tokens use `clamp`, so headlines scale without a pile of breakpoint classes. Body sizes stay stable.
