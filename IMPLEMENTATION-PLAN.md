# Shopora — implementation checklist (Amazon-inspired marketplace, demo build)

Reference analysis (from public amazon.com + provided screenshots):

- **Header:** dark top bar (logo · deliver-to location · category-scoped search · language menu · account hover-dropdown with sign-in CTA and Lists/Account columns · returns & orders · cart w/ badge) + slate secondary nav ("All" hamburger opens slide-out, then link row). Mobile: two-row header (logo/account/cart, then full-width search), nav scrolls horizontally, hamburger opens drawer.
- **Homepage:** full-bleed hero carousel with content cards overlapping its lower half; rows of 4-up "category tile" cards (title, 2×2 image links, see-more); deal + product carousels; sign-in nudge card; recently viewed; dense grey-bg information architecture; back-to-top footer bar + four link columns.
- **Auth:** dedicated minimal layout (logo only, centered bordered card, legal fine print, tiny footer). Sign-in is **two-step** (email → password), with create-account handoff when the email is unknown.
- **Commerce:** product page (gallery + info column + buy box; FBT; reviews w/ histogram; related), search with left filter rail + sort + pagination, data-driven category pages, cart with save-for-later, wishlist, 4-step checkout (address → payment → review → success), account hub of card modules, order history + order detail.

## Checklist

- [x] Phase 2 scaffold: Next.js 15 App Router + TS strict, CSS Modules + global tokens, folder structure (`app/ components/ lib/ types/ hooks/`)
- [ ] Data layer: 8 categories, ~48 products (seeded/deterministic), reviews, sellers, demo user, seeded orders; `lib/api` query functions (search/filter/sort/paginate); local SVG placeholder image route
- [ ] State: Auth / Cart (+saved-for-later) / Wishlist / Recently-viewed / Toast contexts, localStorage persistence, hydration-safe
- [ ] Core UI: Button, Input, Select, Modal, Rating, Price, Badge, Breadcrumb, Pagination, Skeletons, EmptyState, Toast
- [ ] Header + nav + mobile drawer + footer + back-to-top
- [ ] Homepage (hero, tile rows, deals, carousels, sign-in card, recently viewed)
- [ ] Product detail (gallery, buy box, FBT, reviews, related, JSON-LD)
- [ ] Search + category pages (filter rail, sort, pagination, mobile filter sheet)
- [ ] Cart (qty, remove, save-for-later, summary, empty state) + Wishlist
- [ ] Auth: /signin two-step, /signup, forgot-password (demo), validation/loading/error states
- [ ] Account hub + login & security + addresses + payments + preferences
- [ ] Orders list + order detail + buy-again + track modal
- [ ] Checkout: address → payment → review → success (mock payment, order creation)
- [ ] Errors: 404, error boundary, invalid product/order
- [ ] SEO: metadata templates, OG, canonical, product/breadcrumb JSON-LD, sitemap, robots
- [ ] Polish: responsive 375→1920, a11y pass, hydration-safe persistence, typecheck + production build green, route smoke tests

**Brand:** "Shopora" — original wordmark/logo, generated SVG product art, mock data only. No Amazon assets, APIs, or real payments.
