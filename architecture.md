# Online Bookstore Platform — Architecture & Implementation Plan

## 1. Project Overview & Objectives
An e-commerce bookstore platform ("**Book Worm**") designed to deliver seamless customer journeys for both **Guest Users** and **Registered Members**, modelled as 6 modular core subsystems: **Member**, **Store**, **Catalog**, **Order**, **Payment**, and **Shipping**.

> **Architecture decision: frontend-only, everything mocked.** There is no backend, database, or API server. The six subsystems are implemented as typed, async mock services in the Vite + React SPA (`src/services`), backed by TypeScript fixtures (`src/data`) and `localStorage` for mutable state (cart, wishlist, orders, personas). Services return Promises with simulated latency and keep the same shape a real API would, so a backend can replace them later without UI changes. Sections that mention "server", "database" or "API" below describe the behaviour of these mock services.

---

## 2. Target System Architecture Diagram

```mermaid
graph TD
    subgraph Users [User Profiles]
        RegUser[Registered User]
        GuestUser[Guest User]
    end

    subgraph StorefrontFlow [Storefront Navigation Flow]
        Login[User Login / Auth]
        HomePage[Home Page]
        Browse[Browse Catalog]
        AddToCart[Add to Cart / Basket]
        PayProc[Payment Processing]
        Shipment[Shipment Tracking]
    end

    subgraph Subsystems [Core Architectural Subsystems]
        subgraph Sub_Member [1. Member Subsystem]
            M1[Guest / Registered Users]
            M2[Login & Logout]
            M3[Role & Entitlements]
        end

        subgraph Sub_Store [2. Store Subsystem]
            ST1[Create & Manage Stores]
            ST2[Create & Manage Catalogs]
            ST3[Create Store Policies]
        end

        subgraph Sub_Catalog [3. Catalog Subsystem]
            C1[Browse Catalog by Entitlement]
            C2[Browse Products by Category & Brand]
            C3[Recommendations based on Order History]
            C4[Show Up-Sell & Cross-Sell Products]
        end

        subgraph Sub_Order [4. Order Subsystem]
            O1[Create, Modify Order]
            O2[Order Checkout & Basket]
            O3[Confirm, Cancel 48h, Return Order]
            O4[Order History & Buy It Again]
            O5[Redeem Gift Points & Coupons]
        end

        subgraph Sub_Payment [5. Payment Subsystem]
            P1[Payment Processing Gateway]
            P2[Refund Processing]
            P3[Payment Confirmation]
            P4[Gift Cards & Wallet Balance]
        end

        subgraph Sub_Shipping [6. Shipping Subsystem]
            S1[Shipping Rate Calculation]
            S2[Approximate Delivery Time / ETA]
            S3[Return Shipment Logistics]
        end
    end

    %% User Flow Connections
    RegUser -->|Authenticates| Login
    Login --> HomePage
    GuestUser -->|Enters directly| HomePage

    HomePage -->|Explores| Browse
    Browse -->|Selects & adds items| AddToCart
    AddToCart -->|Proceeds to checkout| PayProc
    PayProc -->|Dispatches order| Shipment

    %% Subsystem Connections
    Login -.-> Sub_Member
    HomePage -.-> Sub_Store
    Browse -.-> Sub_Catalog
    AddToCart -.-> Sub_Order
    PayProc -.-> Sub_Payment
    Shipment -.-> Sub_Shipping
```

---

## 3. Subsystem Breakdown & Capability Matrix

### 1. Member Subsystem
- **Guest / Registered Users**: Anonymous guest cart and checkout vs. pre-seeded customer profiles from mock fixtures, persisted in the browser (`localStorage`).
- **Login & Logout**: No real authentication. Session state is simulated with a **UI Persona Switcher** (allows hot-swapping between pre-seeded mock profiles without OAuth, JWT, or password resets).
- **Role & Entitlement**: Role-Based Access Control (`GUEST`, `CUSTOMER`, `STORE_ADMIN`, `SYSTEM_ADMIN`) and catalog access entitlements (e.g., VIP discounts, member-only catalogues).

### 2. Store Subsystem
- **Create & Manage Stores**: Store multi-tenancy / store instance configuration (store metadata, currency, locale, contact info).
- **Create & Manage Catalogs**: Association of catalogues to stores and customer segments.
- **Create Store Policies**: Definition of cancellation window (e.g. 48-hour cancellation rule), return window (e.g. 14/30 days), shipping thresholds, and points exchange rates.

### 3. Catalog Subsystem
- **Browse Catalog by Entitlement**: Filters displayed products based on user role / segment entitlements.
- **Browse Products by Category & Brand**: Multi-level category hierarchy (e.g., Fiction, Non-Fiction, Tech) and Brand/Publisher/Author filtering.
- **Recommended Products based on Order History**: Suggestion engine analyzing past purchases and favorite genres.
- **Up-Sell & Cross-Sell Products**: Contextual product bundles (e.g., hardcover edition up-sell, related companion books, bookmarks).

### 4. Order Subsystem
- **Create, Modify Order**: Basket item addition/removal, quantity adjustments, price calculations.
- **Order Checkout**: Multi-step checkout pipeline (address selection, discounts, payment choice).
- **Confirm, Cancel & Return Order**:
  - Instant order confirmation and receipt.
  - **48-Hour Order Cancellation Rule**: Automated validation allowing instant cancellation and full reversal within 48h of order creation.
  - **Return Order**: Return request workflow post-delivery.
- **Order History & "Buy It Again"**: Customer past order tracking with 1-click repopulation of past basket items.
- **Redeem Gift Points & Coupons**: Applying coupon promo codes and redeeming loyalty gift points against the order total.

### 5. Payment Subsystem (Simulated Gateway)
- **Payment Processing using Gateway**: Client-side mock gateway service validating card parameters (checksums, CVV, dates), UPI formats, or store wallet balances, returning instant status codes after a simulated delay and recording transactions in the mock store.
- **Refund Processing**: Automated refund transaction updates in the mock store when an order is cancelled within 48 hours or when a return is requested.
- **Payment Confirmation**: Secure, immediate payment receipt settlement generation.
- **Gift & Wallet**: Customer wallet balance and gift points ledger management kept in the mock store.

### 6. Shipping Subsystem (Rule-Based Engine)
- **Shipping Rate Calculation**: Deterministic shipping cost calculation based on simple rules (e.g., Standard = Free / Express = $5) instead of complex carrier API integrations.
- **Approximate Delivery Time (Tentative Delivery Date)**: Dynamic calculation of estimated delivery dates in the shipping mock service relative to the current browser time (e.g., Standard = `now + 3 days` / Express = `now + 1 day`) displayed on PDP and checkout.
- **Return Shipment**: Return receipt registration and reverse logistics status tracking.

---

## 4. Storefront UI Specifications ("Book Worm")

### 1. Brand Identity & Global Shell (IBM Carbon Design System)
- **Storefront Name**: **"Book Worm"**
- **Design System Framework**: **IBM Carbon Design System (v11)**
- **Theme**: Carbon Dark Mode (**Gray 100 / g100** Theme tokens)
  - **Base Background**: `#161616` (Carbon `$background`)
  - **Card / Layer 01 Surface**: `#262626` (Carbon `$layer-01`)
  - **Secondary / Layer 02 Surface**: `#393939` (Carbon `$layer-02`)
  - **Primary Action Accent**: `#0f62fe` (Carbon `$interactive-01` / Carbon Blue 60)
  - **Interactive Hover**: `#0353e9` (Carbon `$hover-primary`)
  - **Primary Text**: `#f4f4f4` (Carbon `$text-primary`)
  - **Secondary Text**: `#c6c6c6` (Carbon `$text-secondary`)
  - **Muted Helper Text**: `#8d8d8d` (Carbon `$text-helper`)
  - **UI Borders**: `#393939` (Carbon `$border-weak` / `$border-subtle`)
- **Header Navigation** (matching Carbon UI Shell Header):
  - Logo: "Book Worm" icon or typography.
  - Links: `My Orders` (with Buy In Again), `My Wishlist`, `My Writers`.
  - Right: Cart icon with live quantity counter badge, User Account icon.

### 2. Search & Universal Filter Bar
- **Search Input**: Full-text search with placeholder *"Search you want to read here"* & auto-complete.
- **Filter Controls**: `Language` (All, EN, ES, FR, HI, etc.), `Format` (Paperback, Hardcover, eBook, Audiobook), `Price Range`, `Sort by` (Relevance, Price, Rating, Newest).

### 3. Category & Genre Left Sidebar
Vertical active navigation:
`All` · `Romance` · `Mystery` · `Science Fiction` · `Fantasy` · `Historical` · `Biography` · `Self-help` · `Memoir` · `Travel` · `Cooking` · `Children's` · `Young Adult` · `Comics & Graphic Novels` · `Poetry` · `Drama` · `Science` · `Philosophy` · `Religion` · `Language Learning`.

### 4. Product Detail Page (PDP) & Shopping Cart View
- **Breadcrumb Navigation**: e.g. `Home / Non-Fiction / Self Help`.
- **Book Showcase Grid**:
  - **Cover Showcase**: Front Cover image and interactive Back Cover preview card (blurbs, excerpt quote, barcode, author teaser).
  - **Book Summary & Actions Column**:
    - **Title**: e.g., *Joy of Minimalism*.
    - **Author**: `by Daniel Reed` (linked to writer profile).
    - **Tagline**: `Declutter your life to uncover peace, clarity, and joy.`
    - **Publisher/Brand**: `Published by: ABC Publishers` (clickable brand filter).
    - **Format Badge**: `Paperback` / `Hardcover` / `eBook`.
    - **Category Tags**: `Non-fiction`, `Self Help`.
    - **Price**: US dollars (e.g. `$12.99`). The mockups show ₹ amounts, but the app uses USD; format with `formatMoney` from `src/lib/money.ts`.
    - **Delivery ETA**: Real-time shipping calculation (e.g. `Delivery by Mon, 21 Jul`).
    - **Action Buttons**:
      * **"Add to Cart"** (Primary blue button with basket icon).
      * **"Add to Wishlist"** (Secondary button with bookmark icon).
    - **Metadata Metrics**:
      * `Language`: `English`
      * `Rating`: `★★★★★` (e.g. 5.0)
      * `Sells`: `145 copies sold` (social proof sales counter)
- **About the Writer Section**:
  - Author photo avatar, Full Name (`Daniel Reed`), and detailed biography narrative.
- **Customer Reviews & Rating Submission**:
  - Interactive "Leave Your Review" form with `0/100` character counter, 5-star rating widget `☆☆☆☆☆`, and `Submit →` button.
  - Review feed showing reviewer name, rating stars, and testimonial text.
- **Right Sidebar — "Related Reads"**:
  - Vertical cross-sell rail recommending related titles based on order history & author affinities (e.g., *The Art of Focus*, *The Art of Learning*, *The Path to Success*).

### 5. Payment & Purchase (Checkout) UI Specification
- **Breadcrumb**: `Home / Non-Fiction / Self Help / Joy of Minimalism / Checkout /`
- **Cart Summary & Quantity Controller**:
  - Multi-item card list (e.g., *Joy of Minimalism* ₹149 + *The Path to Success* ₹359).
  - Interactive quantity stepper `[ - ] <quantity> [ + ]` with automatic grand total recalculation.
- **Delivery Address Section**:
  - `[ ] Use Saved Address` toggle for authenticated members.
  - Input fields: `First Name`, `Last Name`, `Address Line 2`, `e-mail`, `City`, `Pin`, `Phone Number` (with country code `+91`), `State`, `Country` (dropdown selector).
- **Grand Total & Payment Panel**:
  - Book illustration card graphic.
  - Itemized financial breakdown:
    * `Price (X items)`: Sum of item prices.
    * `Tax`: Applicable tax calculation.
    * `Delivery Charges`: `Free` (or calculated rate).
    * `Discount`: Real-time deduction from redeemed Gift Points or promo Coupon.
    * `Total Amount`: Final payable figure.
  - Promo code / Gift points input with **"Apply"** button.
  - Primary CTA: **"Pay Now"** button with card icon triggering payment authorization modal.

### 6. Payment Screen / Modal Dialog Specification
- **Backdrop**: Themed illustrative background with floating book art.
- **Dialog Header**:
  - Title: **"Complete Payment"**
  - Amount: **"Payable Amount: ₹XXX"** (e.g., `₹580` / `₹470`)
- **Payment Method Tabs (Left Navigation)**:
  1. **`Credit Card`** (Default active)
  2. **`Debit card`**
  3. **`UPI`**
  4. **`Wallet`** (Gift Points & Store Wallet balance)
- **Card Form Fields (for Credit / Debit Card options)**:
  - `Card Number`: Formatted card number input (`XXXX-XXXX-XXXX-XXXX`)
  - `Name on Card`: Cardholder full name
  - `CVV`: 3 or 4 digit security code (`XXX`)
  - `Date of Expiry`: Expiration date (`MM/YYYY`)
- **UPI Option**:
  - Virtual Payment Address (VPA) / UPI ID input + dynamic QR code generator.
- **Wallet Option**:
  - Available balance indicator + 1-click authorization.
- **Action Button**:
  - High-contrast blue **"Pay Now"** CTA with credit card icon.

### 7. Purchase Confirmation Modal Specification
- **Status Indicator**: Centered green circular checkmark icon (`✔`).
- **Headline**: **"Your purchase of the following reads is successful"**
- **Purchased Reads Display**:
  - Side-by-side cards highlighting purchased books (*Joy of Minimalism* ₹149, *The Path to Success* ₹359) with format tags, genre badges, price, and tentative delivery date.
- **Primary Action**: Centered blue **"Continue your Shopping"** CTA (returns user to Home / Catalogue).
- **Post-Purchase State Automation**:
  - Shopping cart automatically cleared.
  - Order saved to the mock store (`localStorage`) with state `CONFIRMED`.
  - 48-Hour cancellation window initialized (`cancellationDeadline = placedAt + 48 hours`).

---

## 5. Technology Stack & Component Architecture

| Layer / Component | Technology Choice | Details & Implementation Notes |
|---|---|---|
| **Data Layer** | **Mock fixtures (`src/data`) + `localStorage`** | No database or backend. Seed data (books, authors, reviews, personas, coupons) lives in TypeScript fixtures; mutable state (cart, wishlist, orders) persists in the browser |
| **Service Layer** | **Typed async mock services (`src/services`)** | One module per subsystem (member, store, catalog, order, payment, shipping) returning Promises with simulated latency, so a real API can replace them later without UI changes |
| **AI Augmentation on UI** | **IBM BOB (or AWS KIRO)** | Vibe coding with rapid prototyping of pixel-perfect Tailwind/React components based on wireframes |
| **Data Model Design** | **Manual + AI-Assisted** | Domain model mapped from UI wireframes and business constraints, expressed as TypeScript types in `src/types` |
| **AI Augmented Test Case Generator** | **ICA Agents** | AI agent-driven testing: *Test Scenario Generator*, *API Testcase Generator*, *React Component Test Generator* |
| **Frontend Framework** | **Vite + React SPA** | TypeScript + IBM Carbon look (g100 tokens and IBM Plex configured in `tailwind.config.js`, square corners) + `@carbon/icons-react` + Tailwind CSS + React Context for session/cart state + `react-router-dom` |
| **Local Run** | **`npm run dev`** | Single process, no containers or external services required |
| **Hosting (optional)** | **Static bundle (`dist/`)** | Any static host; optionally an nginx container on AWS ROSA / IBM ROKS for a cloud demo |
| **Version Control & Collaboration** | **GitHub PR Workflow** | Feature branch development with Pull Requests submitted to personal GitHub with access granted to Manager |

---

## 6. Domain Data Model (TypeScript Entities & Mock Fixtures)

```mermaid
erDiagram
    STORE ||--o{ CATALOG : owns
    STORE ||--o{ STORE_POLICY : defines
    CATALOG ||--o{ CATEGORY : contains
    CATEGORY ||--o{ PRODUCT : categorizes
    BRAND ||--o{ PRODUCT : manufactures
    AUTHOR ||--o{ PRODUCT : writes
    PRODUCT ||--o{ PRODUCT_RELATION : up_cross_sells
    PRODUCT ||--o{ REVIEW : receives

    USER ||--o{ ADDRESS : has
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ WISHLIST_ITEM : saves
    USER ||--o{ GIFT_POINTS_TRANSACTION : owns
    USER ||--o| WALLET : holds
    USER ||--o| CART : holds
    CART ||--o{ CART_ITEM : contains
    PRODUCT ||--o{ CART_ITEM : in_cart

    ORDER ||--o{ ORDER_ITEM : includes
    ORDER ||--o| PAYMENT_TRANSACTION : paid_by
    ORDER ||--o| SHIPMENT : shipped_via
    ORDER ||--o| ADDRESS : delivers_to
    ORDER ||--o| COUPON : applies

    AUTHOR {
        string id PK
        string name
        string bio
        string avatarUrl
    }

    PRODUCT {
        string id PK
        string title
        string description
        string format "PAPERBACK | HARDCOVER | EBOOK | AUDIOBOOK"
        string language
        float price
        int stock
        int salesCount
        float averageRating
        string categoryId FK
        string brandId FK
        string authorId FK
        string coverImage
        string backCoverImage
        int deliveryLeadDays
    }

    REVIEW {
        string id PK
        string productId FK
        string userId FK
        string authorName
        string content
        int rating
        datetime createdAt
    }

    PAYMENT_TRANSACTION {
        string id PK
        string orderId FK
        string paymentMethod "CREDIT_CARD | DEBIT_CARD | UPI | WALLET"
        string transactionRef
        float amount
        string status "SUCCESS | PENDING | FAILED | REFUNDED"
        datetime processedAt
    }

    ORDER {
        string id PK
        string userId FK
        string addressId FK
        string status "PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED | RETURNED"
        float subtotal
        float taxAmount
        float shippingFee
        float discountAmount
        float totalAmount
        int pointsRedeemed
        int pointsEarned
        datetime placedAt
        datetime cancellationDeadline "placedAt + 48h"
        datetime tentativeDeliveryDate
    }

    SHIPMENT {
        string id PK
        string orderId FK
        string trackingNumber
        string carrier
        string status "PROCESSING | IN_TRANSIT | DELIVERED | RETURN_IN_PROGRESS"
        datetime estimatedDeliveryDate
        float shippingRate
    }
```

---

## 7. Step-by-Step Implementation Roadmap

### Phase 1: Foundation, Mock Data Layer & Subsystem Scaffolding
- [x] Initialize project structure (Vite + React SPA, frontend only).
- [x] Configure Dark Mode design tokens, Tailwind CSS, and `@carbon/icons-react`.
- [x] Model the domain as TypeScript types in `src/types` based on wireframes (see Section 6).
- [x] Create the mock service layer in `src/services` (one module per subsystem, async, typed).
- [x] Configure Member subsystem mock: Persona Switcher, Guest session handling, and Role/Entitlements.

> **Implementation layout:** fixtures in `src/data`; Promise-returning services (`ApiError` on failure, simulated latency, `localStorage` persistence) in `src/services`; `SessionProvider` / `CartProvider` in `src/context`; `useAsync` in `src/hooks`.
> **Demo values (currency: USD):** personas `guest`, `aarav` (wallet $100, 320 points, seeded orders), `priya` (wallet $5); coupons `BOOKWORM10` ($10 off, min $30), `WELCOME10` (10%), `READ5` ($5 off, min $20); card numbers are not validated (any number is approved; one ending in `0002` is declined), UPI ids starting with `fail` declined; `lost-kitten` has stock 3. Gift points: earned at 1 per $10 actually paid; redeemable at checkout (rules below). Adding to cart keeps the user on the current page and shows a success notice.
> **Gift points rules:** 1 point = $0.10 (`storePolicy.pointValue`); points may cover at most 50% of the amount payable after the coupon (`storePolicy.maxPointsCoverage`), in whole points; registered customers only (guests are asked to sign in). The request is stored on the cart (`pointsToRedeem`) and capped by the balance and the policy on every quote, so it shrinks if the cart gets cheaper. Points are spent only when the order is placed (net `earned − redeemed`); cancelling or returning an order restores the redeemed points and reverses the earned ones; a declined payment leaves balance and request untouched. The `localStorage` prefix is `bookworm:v3:` (older data is discarded).
> **Known gaps (not built, by decision):** UPI QR code, express shipping choice at checkout, Audiobook / Newest / extra-language filters, search auto-complete, role-based entitlements (personas only differ by data), up-sell suggestions, return shipment tracking. `@carbon/react` and Zustand from the original stack are not used (Tailwind + hand-built Carbon-styled components + React Context).

### Phase 2: Store & Catalog Subsystems (Discovery & Recommendations)
- [x] Seed mock catalog fixtures (`src/data`) with books shown in design (e.g., *Joy of Minimalism*, *The Art of Focus*, *The Art of Learning*, *The Path to Success*, etc.) and authors (e.g. Daniel Reed, Arjun Patel, Raj Patel, James Wright).
- [x] Implement Category Sidebar (20+ genres) and Filter Bar (Language, Format, Price Range, Sort).
- [x] Implement Home Sections: "Recommended for You", "Bestsellers this Month", and "New Launches".
- [x] Build Product Detail Page (PDP):
  - Cover gallery with Front and Back Cover views.
  - Book metadata (Language, Rating, Sales count counter).
  - Tentative Delivery Date calculator (Shipping Subsystem integration).
  - Author bio section and interactive Review submission form (`0/100` characters, star rating).
  - "Related Reads" cross-sell sidebar.

### Phase 3: Order Subsystem, Basket & Wishlist
- [x] Top navigation with live cart badge counter and links (`My Orders`, `My Wishlist`, `My Writers`).
- [x] Persistent shopping basket for both Guest and Registered users (Add to Cart from PDP and Feed).
- [x] Wishlist toggle ("Add to Wishlist" action).
- [x] Quantity stepper controls (`+` / `-`) with live subtotal updates.
- [x] Order History list with order details, item breakdown, and status badges.
- [x] "Buy It Again" 1-click basket population logic from Order History.

### Phase 4: Checkout, Coupons, Gift Points & Payment Subsystem
- [x] Multi-step checkout UI:
  - Shopping cart review panel with live quantity adjustments.
  - Delivery address form (First/Last name, Address line, Email, City, Pin, Phone with +91, State, Country) + Saved Address toggle.
  - Grand total card with breakdown (`Price`, `Tax`, `Delivery Charges`, `Discount`, `Total Amount`).
  - Coupon & Gift Points redemption engine with instant `Apply` calculation.
- [x] Complete Payment Screen / Modal dialog:
  - Tabbed payment method selector (`Credit Card`, `Debit card`, `UPI`, `Wallet`).
  - Card detail inputs (`Card Number`, `Name on Card`, `CVV`, `Date of Expiry`).
  - Payment gateway transaction processing via "Pay Now" trigger.
  - Purchase Confirmation modal: Green checkmark, purchased books overview, and "Continue your Shopping" button.
  - Post-purchase cart clearance and order persistence.

### Phase 5: Shipping, 48-Hour Order Cancellation & Returns
- [x] Shipping subsystem: Rate calculation engine & approximate delivery timeline.
- [x] 48-Hour Order Cancellation Engine:
  - Strict validation (`now <= placedAt + 48 hours` and not shipped).
  - Automatic inventory release, payment refund processing, and points reversal.
  - Order History cancellation action with remaining time display.
- [x] Return Order workflow: refund settlement and points reversal (return shipment tracking is not built).

### Phase 6: AI-Augmented Testing (ICA Agents) & Verification
- [x] Unit tests for every atom, molecule and organism (`src/components/{atoms,molecules,organisms}/*.test.tsx`) and `src/lib/money.ts`, using Vitest + Testing Library + happy-dom; shared builders in `src/test/fixtures.ts` and `src/test/providers.tsx` (router + session + cart contexts). Run with `npm test` (single file: `npm test -- Button`, single test: `npm test -- -t "calls onClick"`); coverage with `npm run test:coverage` (v8 provider; text table plus HTML report in `bookworm-app/coverage/`). Atoms, molecules and organisms are at 100% statements/branches/functions/lines. Test files are colocated with the component. `happy-dom` is used instead of `jsdom` because jsdom 27 needs Node 22.12+.
- [x] Service tests for pricing (`pricing.test.ts`) and gift points redemption (`points.test.ts`): caps, guest/balance/validation errors, placement, cancel and return. 298 tests in 30 files pass; overall coverage 46% statements / 45% branches / 48% functions / 50% lines (`src/services` ~52%, `pricing.ts` 100%).
- [ ] Remaining untested layers: templates, pages, `src/context` providers, `src/hooks`, and the catalog, member, review, wishlist and order services.
- [ ] Generate comprehensive test scenarios using **ICA Test Scenario Generator**:
  - End-to-End user journeys: Guest / Registered browsing, checkout, points redemption, 48-hour cancellation.
- [ ] Generate service-layer tests using **ICA API Testcase Generator**:
  - Contract tests that mock services for all 6 subsystems return data matching `src/types`.
  - Boundary and validation tests for payments, discounts, addresses, and order cancellation.
- [ ] Generate React unit/component tests using **ICA Testcase Generator for React**:
  - PDP reviews, filter controls, cart stepper, and checkout modal interactions.
- [ ] Execute test suites with 100% passing threshold before build approval.

### Phase 7: Build, Static Hosting & PR Delivery
- [ ] **Local Machine Readiness**:
  - `npm install && npm run dev` starts the app with seeded mock data; no other services required.
  - `npm run build && npm run preview` validates the production bundle.
- [ ] **Hosting (optional)**:
  - Deploy the static `dist/` bundle to any static host (or an nginx container on AWS ROSA / IBM ROKS if a cloud demo is required).
  - Validate the deployed URL loads all five pages and the cart → payment → confirmation flow.
- [ ] **GitHub PR & Review Workflow**:
  - Push branch to personal GitHub repository.
  - Open a well-structured Pull Request (PR) with feature breakdown and screenshots.
  - Grant repository collaborator access to Manager for PR review and approval.

---

## 8. Agents & Skills Matrix

| Role / Agent / Tool | Specific Function in Project |
|---|---|
| **IBM BOB (or AWS KIRO)** | Primary AI augmented IDE assistant for vibe coding the UI, implementing the mock service layer and fixtures, and managing Git/build workflows. |
| **ICA Test Scenario Generator** | AI agent generating complete functional test scenarios across customer journeys. |
| **ICA API Testcase Generator** | AI agent generating automated tests against the typed mock service contracts (`src/services`). |
| **ICA React Testcase Generator** | AI agent generating component and interaction tests for React/Next.js UI components. |
| **`create-chart`** | Visualizing order history analytics, sales trends, and loyalty points earning/spending charts. |
| **Screenshot / Vision Analysis** | Converting UI mockups and architectural diagrams into pixel-perfect frontend components and mock service workflows. |

---

## 9. Requirements & Screenshot Log
- **Batch 1 (Customer Journeys)**: E-Store Home, Catalog Discovery, Checkout & 48h Cancellation.
- **Batch 2 (Architectural Diagram Analysis)**: 6 Subsystems (Member, Store, Catalog, Order, Payment, Shipping).
- **Batch 3 (Storefront UI Mockup — 'Book Worm')**: Dark theme, 20-category sidebar, filter controls, 3 curated home feeds, book cards with delivery dates.
- **Batch 4 (The Catalogue Page Slide)**: Category selection, Brand browsing, Product selection with delivery dates, Related products, Order History "Buy In Again".
- **Batch 5 (Product Detail Page & Shopping Cart Slide)**: PDP layout, Dual covers, author bio, reviews (0/100 char limit), Related Reads sidebar.
- **Batch 6 (Payment & Purchase Slide)**: Cart list with steppers, Delivery address form, Grand Total itemized breakdown.
- **Batch 7 (Payment Screen Modal Slide)**: Complete Payment dialog, Credit/Debit/UPI/Wallet tabs, Card inputs, "Pay Now" action.
- **Batch 8 (Purchase Confirmation Slide)**: Green checkmark, Success headline, purchased reads cards, "Continue your Shopping" button.
- **Batch 9 (Tech Components, AI Agents, Deployment & PR Workflow)**:
  - ~~Database: PostgreSQL~~ → superseded by Batch 10 (mock data in the frontend).
  - AI augmentation on UI: Vibe coding with IBM BOB (or AWS KIRO).
  - Data model design: Wireframe-based manual validation (now expressed as TypeScript types + mock fixtures).
  - ~~OpenAPI / Swagger spec generation~~ → superseded by Batch 10 (typed mock service contracts).
  - AI test case generation: ICA Agents (Test Scenario Generator, React Testcase Generator; the API Testcase Generator now targets the mock service layer).
  - ~~Deployment: Local (Docker Compose) and Cloud (AWS ROSA / IBM ROKS)~~ → superseded by Batch 10 (static frontend build).
  - Collaboration: GitHub PR workflow with Manager access.
- **Batch 10 (Architecture Change — Frontend-Only, Everything Mocked)**:
  - No backend, database, ORM, or API server. All six subsystems run in the browser against mock data.
  - Persistence is limited to the browser (`localStorage`), seeded from fixtures in `src/data`.
- **Design Reference Mockups (Located in `./Design/` directory)**:
  - **Catalog Page (Browse, Search, Filter & Lists)**: [`Design/CatalogPage.png`](Design/CatalogPage.png)
  - **Product Detail Page (Cover, Summary, Review & Sidebar)**: [`Design/ProductDetailsPage.png`](Design/ProductDetailsPage.png)
  - **Cart & Checkout (Quantity controls, Address Form, Grand Total)**: [`Design/CartPage.png`](Design/CartPage.png)
  - **Payment Modal (Card, UPI & Wallet Options)**: [`Design/PaymentPage.png`](Design/PaymentPage.png)
  - **Purchase Confirmation (Success checklist & Return to Shopping)**: [`Design/ConfirmationPage.png`](Design/ConfirmationPage.png)
