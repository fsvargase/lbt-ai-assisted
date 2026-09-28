## Why

The platform's public surface (home + booking entry) is functional but not
discoverable: pages lack per-page metadata, social previews, canonical URLs, a
sitemap/robots, and structured data, and there are no indexable marketing pages
for the core NYC services. Making the app SEO-friendly improves organic reach
for high-intent searches (e.g., "JFK black car service", "NYC chauffeur hourly")
while keeping authenticated areas out of the index.

## What Changes

- Add **per-page metadata** across public routes: unique `title`/`description`,
  Open Graph + Twitter cards, `canonical` URLs, `lang`, and a shared
  `metadataBase`. Set `robots: noindex` on authenticated routes
  (`/bookings`, `/dashboard/**`, `/driver/**`, `/signin`).
- Add **site discovery**: a dynamic `app/sitemap.ts` (indexable routes only) and
  `app/robots.ts` referencing the sitemap.
- Add **structured data (JSON-LD)**: Schema.org `LocalBusiness` (NYC luxury
  ground transport) on the home page and `Service` markup on each marketing page.
- Add **indexable marketing pages** for core services under `app/(marketing)`:
  airport transfers (JFK/LGA/EWR), hourly hire, point-to-point, events — each
  with SEO copy, semantic headings, and a CTA into the booking flow (`/new`).
- Improve **semantic HTML & accessibility for crawlability**: single `h1` per
  page, descriptive link text, image `alt`, targeting Lighthouse SEO = 100.

## Capabilities

### New Capabilities
- `seo-metadata`: per-page metadata, Open Graph/Twitter, canonical, `metadataBase`,
  `lang`, and `noindex` policy for authenticated routes.
- `site-discovery`: dynamic `sitemap.xml` and `robots.txt` exposing only
  indexable routes.
- `structured-data`: Schema.org JSON-LD (`LocalBusiness`, `Service`) on public
  pages.
- `marketing-pages`: indexable service landing pages that funnel into the booking
  flow.

### Modified Capabilities
<!-- None — SEO is additive and does not change existing booking/trip requirements. -->

## Impact

- **Routes (UI)**: `app/layout.tsx` (metadataBase, defaults), `app/page.tsx`
  (home metadata + JSON-LD), new `app/(marketing)/**` landing pages, new
  `app/sitemap.ts` and `app/robots.ts`. Add `robots: { index: false }` metadata
  to `app/(booking)/bookings/**`, `app/(dashboard)/**`, `app/driver/**`,
  `app/signin`.
- **Config**: add a public site URL env var (e.g. `NEXT_PUBLIC_SITE_URL`) for
  `metadataBase`, canonicals, and sitemap absolute URLs.
- **Assets**: add Open Graph image(s) under `public/` (e.g. `public/og.png`).
- **No API/Prisma/auth changes** — this change is presentation/metadata only.
- **NYC domain**: marketing copy and structured data reference NYC service areas
  and airports (JFK/LGA/EWR); times/pricing remain handled elsewhere.

## Non-goals

- No changes to booking, trip, pricing, or auth behavior.
- No blog/CMS or dynamic content system.
- No internationalization/multi-language SEO (English only for now).
- No paid-search/analytics/tag-manager integration.
- No server performance rework (Lighthouse performance already > 90).
