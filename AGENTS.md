# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview
- Greenfield capstone project repository (`CapstoneProject`) initialized on branch `main`.
- **Service conventions:** services reject with `ApiError` (see `src/services/mock.ts`) and use `respond()` for latency; React contexts live in a `*.ts` file (context + hook) separate from the `*Provider.tsx` component; load data via promise chains / `useAsync`, not `setState` inside `useEffect`; use the `Notice` atom for errors and `BookArt` for covers (no network images).
- **Gift points & storage:** 1 point = $0.10, max 50% of the payable amount, customers only (`storePolicy` in `src/data`, logic in `src/services/pricing.ts` and `cart.ts`); points are spent on order placement and restored on cancel/return. `localStorage` keys use the `bookworm:v3:` prefix (bump it when stored shapes change). Use `emptyCart()` from `db.ts`, never a shared constant.
- **Architecture: frontend-only, everything mocked** (see `architecture.md`). Do not add a backend, database, ORM, OpenAPI, Docker or any network calls. Data comes from `bookworm-app/src/data` fixtures and typed async mock services in `bookworm-app/src/services`; mutable state persists in `localStorage`. Keep service signatures API-shaped (Promise-returning) so UI code does not change if a real backend is added later.

## Build, Lint & Test Commands
- Tests: Vitest + Testing Library + happy-dom (`npm test`, `npm run test:watch`; one file `npm test -- Button`; one test `npm test -- -t "name"`; coverage `npm run test:coverage`, HTML report in `bookworm-app/coverage/index.html`). Every new atom, molecule or organism needs a colocated `<Name>.test.tsx` and must stay at 100% coverage. Shared builders: `src/test/fixtures.ts` (data) and `src/test/providers.tsx` (`renderWithProviders` supplies router + session + cart contexts with mockable values; use it for anything calling `useCart`/`useSession`). Never nest `<a>` in `<a>`; make cards clickable by stretching the title link (`after:absolute after:inset-0`). Run `npm test` together with build and lint before finishing.
- `bookworm-app/` commands (`npm run build`, `npm run lint`, `npm test`) must run from `bookworm-app/`. `npm` is not on the default shell PATH here; prefix with `export PATH="$HOME/.nvm/versions/node/v22.11.0/bin:$PATH" &&`.
- After editing `tailwind.config.js` (new tokens/colors), the running `vite` dev server keeps the old config and shows "class does not exist" overlays. Tell the user to restart `npm run dev` and verify with a fresh `npm run build`.

- Check project root and subdirectories for package manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.) once added.
- Always execute commands from the appropriate directory containing the manifest.
- When adding test suites, ensure single-test runner commands (e.g., `npm test -- -t "test name"`, `pytest path/to/test.py::test_func`, `cargo test test_name`) are supported and documented.

## Code Style & Development Conventions
- Imports: Group standard library / core imports first, third-party packages second, internal/relative modules last.
- Formatting & Types: Enforce strict type definitions and linting before committing code. Avoid implicit `any` or untyped signatures.
- Naming: Use descriptive domain-driven naming for files, classes, functions, and constants. Follow language idioms (e.g., camelCase for JS/TS, snake_case for Python/Rust).
- Error Handling: Fail fast with explicit, typed exceptions/errors rather than swallowing failures or returning silent fallbacks.

## UI / Design Rules (Book Worm storefront in `bookworm-app/`)
- Source of truth: `architecture.md` section 4 and the mockups in `Design/*.png`. Read both and view the relevant PNG before building or changing any UI; do not rely on memory or generic "modern UI" defaults.
- Design system is **IBM Carbon v11, g100 dark theme**. Use Carbon tokens (`#161616` background, `#262626` layer-01, `#393939` layer-02/borders, `#0f62fe` primary, `#0353e9` hover, `#f4f4f4` / `#c6c6c6` / `#8d8d8d` text) and IBM Plex Sans/Mono, not ad-hoc Tailwind palette colors.
- **No rounded corners.** Carbon is square: never use `rounded`, `rounded-lg`, `rounded-full`, `border-radius` or SVG `rx` on buttons, inputs, cards, tags, sidebar items, images, modals or tabs. The only circular elements in the mockups are the cart count badge, the author avatar, and the green success check.
- Inputs are filled (`#262626`) with a **bottom border only**; the quantity stepper is underlined, not boxed; focus is a 2px `#0f62fe` outline; modal tabs use a 3px left blue bar for the active item.
- Links are underlined Carbon blue (`#78a9ff` on dark); buttons are square, blue, with the label left and the icon right.
- Icons come from `@carbon/icons-react` only (`lucide-react` was removed; do not reintroduce it or hand-drawn SVG icons). Prefer `@carbon/react` over hand-rolled components. Tailwind is only a layout/utility helper.
- After any UI change, grep `src/` for `rounded|border-radius|rx=` and compare the result against the matching mockup. Use the `carbon-ui-conformance` skill for the full checklist.
