# Book Worm: storefront app

Vite + React + TypeScript single-page app styled after IBM Carbon (g100 dark theme, IBM Plex, square corners). It is **frontend-only**: no backend, database or network calls. Seed data lives in `src/data`, async mock services in `src/services` return Promises with simulated latency, and mutable state (cart, wishlist, orders, session) persists in `localStorage` under the `bookworm:v3:` prefix.

## Commands

Run everything from this directory.

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server (restart it after editing `tailwind.config.js`) |
| `npm run build` | Type-check and build the production bundle into `dist/` |
| `npm run preview` | Serve the production bundle |
| `npm run lint` | Lint with oxlint |
| `npm test` | Run all unit tests once (Vitest + Testing Library + happy-dom) |
| `npm test -- Button` | Run one test file |
| `npm test -- -t "calls onClick"` | Run one test by name |
| `npm run test:coverage` | Tests plus a coverage table; HTML report in `coverage/index.html` |

Atoms, molecules, organisms and `src/lib` are at 100% coverage. Pricing and gift points services are tested as well; templates, pages and some services are not yet.

## Demo data

- **Personas** (switch from the navbar): `guest`, `aarav` (wallet $100, 320 points, seeded orders), `priya` (wallet $5, 40 points).
- **Coupons:** `BOOKWORM10` ($10 off, min $30), `WELCOME10` (10%), `READ5` ($5 off, min $20).
- **Payment:** card numbers are not validated; any number is approved, one ending in `0002` is declined. UPI ids starting with `fail` are declined. Wallet needs enough balance.
- **Shipping and tax:** standard shipping is free, express is $5, tax is 12%. The book `lost-kitten` has stock 3.
- Currency is USD.

## Gift points

- 1 point = $0.10; points can cover at most 50% of the amount payable after the coupon, in whole points.
- Customers only; guests are asked to sign in.
- Points are spent when the order is placed and restored when it is cancelled (within 48 hours) or returned.
- Points are earned at 1 per $10 actually paid. A declined payment leaves the balance untouched.

## Layout

```
src/
  components/{atoms,molecules,organisms,templates}   Atomic design, Carbon-styled (square, no rounded corners)
  pages/            Route-level screens (catalog, product, cart, payment, confirmation, orders, wishlist, writers)
  context/          SessionProvider, CartProvider (context + hook in *.ts, component in *Provider.tsx)
  services/         Mock subsystems: member, catalog, cart, order, payment, shipping, review, wishlist, pricing
  data/             Seed fixtures (books, authors, personas, coupons, store policy)
  types/            Domain types
  hooks/            useAsync
  lib/              money.ts (USD formatting)
  test/             setup, fixtures, renderWithProviders
```

Design source of truth: `../architecture.md` and the mockups in `../Design/`.
