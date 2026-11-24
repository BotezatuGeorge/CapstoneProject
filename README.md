# CapstoneProject: Book Worm

An online bookstore storefront built as a frontend-only React SPA with an IBM Carbon g100 look. Everything (catalog, cart, orders, payments, gift points) is mocked in the browser and persisted in `localStorage`.

- `architecture.md`: objectives, UI specifications, data model, roadmap and status.
- `Design/`: the five Carbon mockups the UI follows.
- `bookworm-app/`: the application. See its [README](bookworm-app/README.md) for commands, demo personas, coupons, test cards and the gift points rules.
- `AGENTS.md`: conventions for agents working in this repo.

## Quick start

```bash
cd bookworm-app
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests
npm run build      # production bundle
```

## Features

Catalog with category sidebar and filters, home feeds, product details with reviews and related reads, persistent cart and wishlist, coupons and gift points, payment (card, UPI, wallet) with confirmation, shipping rates, order history with Buy It Again, 48-hour cancellation and returns. Known gaps are listed in `architecture.md`.
