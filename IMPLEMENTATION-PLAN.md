# Shopora — implementation checklist (Amazon-inspired marketplace, demo build)

Reference analysis (from public amazon.com + provided screenshots):

- **Header:** dark top bar (logo · deliver-to location · category-scoped search · language menu · account hover-dropdown with sign-in CTA and Lists/Account columns · returns & orders · cart w/ badge) + slate secondary nav ("All" hamburger opens slide-out, then link row). Mobile: two-row header (logo/account/cart, then full-width sticky search), nav scrolls horizontally, hamburger opens drawer.
- **Homepage:** full-bleed hero carousel with content cards overlapping its lower half; rows of 4-up "category tile" cards (title, 2×2 image links, see-more); deal + product carousels; sign-in nudge card; recently viewed; dense grey-bg information architecture; back-to-top footer bar + four link columns.
- **Auth:** dedicated minimal layout (logo only, centered bordered card, legal fine print, tiny footer). Sign-in is **two-step** (email → password), with create-account handoff when the email is unknown.
- **Commerce:** product page (gallery + info column + buy box; FBT; reviews w/ histogram; related), search with left filter rail + sort + pagination, data-driven category pages, cart with save-for-later, wishlist, 4-step checkout (address → payment → review → success), account hub of card modules, order history + order detail.

## Checklist

- [x] Phase 2 scaffold: Next.js 15 App Router + TS strict, CSS Modules + global tokens, folder structure (`app/ components/ lib/ types/ hooks/`)
- [x] Data layer: 8 categories, 52 products (seeded/deterministic), reviews, sellers, demo user, seeded orders; `lib/api` query functions (search/filter/sort/paginate); local SVG placeholder image route
- [x] State: Auth / Cart (+saved-for-later) / Wishlist / Recently-viewed / Toast contexts, localStorage persistence, hydration-safe
- [x] Core UI: Button, Input, Select, Modal, Rating, Price, Badge, Breadcrumb, Pagination, Skeletons, EmptyState, Toast
- [x] Header + nav + mobile drawer + footer + back-to-top
- [x] Homepage (hero, tile rows, deals, carousels, sign-in card, recently viewed)
- [x] Product detail (gallery, buy box, FBT, reviews, related, JSON-LD)
- [x] Search + category pages (filter rail, sort, pagination, mobile filter sheet)
- [x] Cart (qty, remove, save-for-later, summary, empty state) + Wishlist
- [x] Auth: /signin two-step, /signup, forgot-password (demo), validation/loading/error states
- [x] Account hub + login & security + addresses + payments + preferences
- [x] Orders list + order detail + buy-again + track modal
- [x] Checkout: address → payment → review → success (mock payment, order creation)
- [x] Errors: 404 (real 404 status incl. unknown product/category), error boundary
- [x] SEO: metadata templates, OG, canonical, product/breadcrumb JSON-LD, sitemap, robots
- [x] Polish: typecheck green (strict, no `any`), production build green, every route smoke-tested

**Brand:** "Shopora" — original wordmark/logo, generated SVG product art, mock data only. No Amazon assets, APIs, or real payments.

## Known trade-offs

- Route-level `loading.tsx` was removed: with in-memory data it was never visibly useful, and its streaming shell turned `notFound()` responses into HTTP 200s. Client-side skeletons (cart, orders, auth guard) remain.
- Auth/cart/wishlist persistence is `localStorage` by design (demo); the `authService`/`lib/api` seams are where a real backend would plug in.
- Demo account: `demo@shopora.com` / `demo1234` (seeded orders, addresses, payment methods).
