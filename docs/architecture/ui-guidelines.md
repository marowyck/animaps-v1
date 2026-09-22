# ANIMAPS — UI guidelines

How to build screens on the existing brand. Tokens live in [design-system.md](../features/design-system.md). Components live in [components.md](../features/components.md).

## Identity

Pink (`--primary`) is the action. Green (`--secondary`) is care, success, and map intensity. Mint cream is the page. White is the surface. Display type is Bagel Fat One; UI type is Nunito.

Do not introduce a second palette for product screens. Institution tools use the same tokens with quieter layout: fewer pastel tiles, more lists, map, and filters.

## Hierarchy

Each screen has one primary action. Secondary actions use `ghost`, `white`, or `soft`. Danger uses `--error`. Warning uses `--warning` and the soft warning surface (verification gate).

Leave space. Do not nest a card inside a card inside a card. A section title, one surface, and the content is enough.

## Type

Use the named scale (`.text-display` through `.text-caption`) on new UI. Do not pick a new `text-[13px]`.

## Color

Use semantic utilities (`bg-primary`, `text-text`, `bg-surface`, `text-error`). If a library needs a raw color (GSAP, SVG, Leaflet), read the CSS variable at runtime. Do not paste `#e07a96`.

## States

Data views need loading, empty, error, and the happy path. Empty states get a short explanation and a next step when one exists. Errors say what happened and offer retry or a way back.

## Motion

Motion explains a change. It does not decorate every hover. Respect `prefers-reduced-motion`.

## Maps

Institution maps show city aggregates on OpenStreetMap. They do not drop a pin on a reporter. Unknown cities stay in the list.
