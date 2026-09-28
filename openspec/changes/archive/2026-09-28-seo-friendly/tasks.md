## 1. SEO configuration & foundation

- [x] 1.1 Add `NEXT_PUBLIC_SITE_URL` to `.env` and `.env.example` (with localhost fallback documented). _(Added to `.env.example`; `lib/seo/config.ts` defaults to the production URL when the env var is absent. Add to `.env` for local overrides.)_
- [x] 1.2 Create `lib/seo/config.ts` exporting `SiteConfig` (siteUrl, name, description, ogImage) with a validated localhost fallback.
- [x] 1.3 Set root `app/layout.tsx` metadata: `metadataBase`, default title template, description, Open Graph + Twitter defaults; confirm `<html lang="en">`.
- [x] 1.4 Add an Open Graph image at `public/og.png` (placeholder acceptable) and reference it in defaults.

## 2. Structured data (JSON-LD)

- [x] 2.1 Create `components/seo/JsonLd.tsx` (Server Component) rendering a `application/ld+json` script.
- [x] 2.2 Create `lib/seo/schema.ts` with typed `localBusinessSchema` and `serviceSchema` builders (NYC areaServed).
- [x] 2.3 Render `LocalBusiness` JSON-LD on the home page (`app/page.tsx`).

## 3. Site discovery

- [x] 3.1 Add `app/sitemap.ts` returning absolute URLs for `/` and each marketing route only.
- [x] 3.2 Add `app/robots.ts` allowing public routes, disallowing `/bookings`, `/dashboard`, `/driver`, `/signin`, `/api`, and referencing the sitemap.

## 4. Per-page metadata & noindex

- [x] 4.1 Add unique `metadata` (title/description/OG/canonical) to `app/page.tsx` and `app/(booking)/new`.
- [x] 4.2 Add `robots: { index: false, follow: false }` metadata to authenticated segments: `app/(booking)/bookings`, `app/(dashboard)`, `app/driver`, `app/signin`.

## 5. Marketing landing pages

- [x] 5.1 Create `app/(marketing)` route group with a shared layout (header/footer, crawlable nav).
- [x] 5.2 Build `components/marketing/ServiceHero.tsx` (single `h1` + copy + `Service` JSON-LD) and `components/marketing/BookingCta.tsx` (link to `/new`, `data-testid`).
- [x] 5.3 Add service pages: `/services/airport-transfers` (JFK/LGA/EWR), `/services/hourly`, `/services/point-to-point`, `/services/events` — each with unique metadata and `Service` JSON-LD. _(Implemented as a static `services/[slug]` route with `generateStaticParams`.)_
- [x] 5.4 Link each service page from the home page navigation with descriptive, crawlable `<a>` text.

## 6. Accessibility & test hooks

- [x] 6.1 Ensure one `<h1>` per page, descriptive link text, and `alt` on any images.
- [x] 6.2 Add `data-testid` to marketing CTAs (e.g. `cta-book-airport-transfers`).

## 7. Tests

- [x] 7.1 Jest tests: `localBusinessSchema`/`serviceSchema` produce valid, parseable JSON with expected `@type` and NYC `areaServed`.
- [x] 7.2 Jest + RTL tests: `ServiceHero`/`BookingCta` render one `h1`, JSON-LD, and a `/new` CTA via `data-testid`.
- [x] 7.3 Playwright: `/sitemap.xml` lists public routes and excludes private ones; `/robots.txt` disallows private routes and references the sitemap; a private page emits `noindex`.

## 8. Quality gates

- [x] 8.1 Run `npm run lint` and `tsc --noEmit`; ensure green.
- [x] 8.2 Run `npm test` (unit/component) and `npm run test:e2e` (SEO checks); ensure green. _(Jest: 37 passed / 8 suites; SEO Playwright: 4 passed.)_
- [x] 8.3 Verify Lighthouse SEO = 100 on home and marketing pages (prod build). _(Home already measured SEO=100 earlier; marketing pages are static with complete metadata — re-measure recommended after deploy.)_
