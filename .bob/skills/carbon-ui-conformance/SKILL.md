---
name: carbon-ui-conformance
description: Use when building, restyling, or reviewing any Book Worm UI in bookworm-app (components, pages, Tailwind config, CSS), or when the user says the design does not match the mockups, is rounded, or is not IBM Carbon.
---

# Carbon UI Conformance (Book Worm)

The storefront must match `Design/*.png` and `architecture.md` section 4: IBM Carbon v11, g100 dark theme, square geometry.

## 1. Load the source of truth
1. `read_file` `architecture.md` (section 4 and the tech stack table).
2. `read_file` the PNG(s) in `Design/` for the page being changed: `CatalogPage`, `ProductDetailsPage`, `CartPage`, `PaymentPage`, `ConfirmationPage`.

## 2. Token mapping (Tailwind config must expose these)
| Purpose | Value |
|---|---|
| Background | `#161616` |
| Layer 01 (cards, inputs, panels) | `#262626` |
| Layer 02 / borders | `#393939` |
| Primary / hover | `#0f62fe` / `#0353e9` |
| Text primary / secondary / helper | `#f4f4f4` / `#c6c6c6` / `#8d8d8d` |
| Link on dark | `#78a9ff` |
| Font | IBM Plex Sans (and Plex Mono for code), loaded explicitly |

## 3. Shape and component rules
- Zero border radius everywhere. Set `borderRadius` in `tailwind.config.js` so every radius utility resolves to `0`, and remove rounded classes from components.
- Allowed circles only: cart count badge, author avatar, green success check.
- Text input / select / textarea: `#262626` fill, `1px` bottom border `#8d8d8d`, no side or top border, 2px `#0f62fe` focus outline.
- Buttons: square, `#0f62fe`, label left and icon right, secondary button `#393939`.
- Quantity stepper: underlined row with `value | - | +`, no box.
- Sidebar: flat list, active row has `#393939` fill, no pills.
- Payment tabs: vertical list, active tab has a 3px left `#0f62fe` bar.
- Header: Carbon UI Shell style, `#161616` with a 1px bottom border `#393939`.
- Icons: use `@carbon/icons-react` only (already installed; `lucide-react` was removed). Check the icon exists in `node_modules/@carbon/icons-react/lib/<Name>.js` before importing; never hand-draw inline SVG icons. Prefer `@carbon/react` over hand-built widgets when adding new components.
- Layering: fields on a `.card` (layer-01 `#262626`) use layer-02 `#393939`; fields on the page background use layer-01.
- Cart stepper is `value | - | +` in a fixed-width underlined row; Grand Total is a card with the illustration on the left, rows with hairline dividers, and a square Apply button attached to an underlined coupon field.

## 4. Verify
1. `grep` `bookworm-app/src` for `rounded|border-radius|rx=` and justify every remaining hit against the allowed circles.
2. `grep` for off-palette colors: `#3b82f6`, `#1a1a1a`, `#2d2d2d`, `bg-yellow-`, `bg-green-`, `bg-red-` and similar Tailwind palette utilities.
3. From `bookworm-app/` run `npm run build` and `npm run lint`; both must pass.
4. Compare against the PNG for the page once more before reporting done.
