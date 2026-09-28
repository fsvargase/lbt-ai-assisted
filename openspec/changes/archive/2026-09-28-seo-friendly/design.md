## Context

lbt-ai-assisted is a Next.js (App Router) + TypeScript monolith. Public surface
today: `/` (home), `/new` (booking form), `/signin`. Booking/dashboard/driver
routes are authenticated. Only the root layout sets (generic) metadata; there is
no sitemap, robots, structured data, or marketing content. This change adds SEO
primitives and indexable marketing pages without touching booking/auth logic.

## Goals / Non-Goals

**Goals:**
- Per-page metadata (title/description/OG/Twitter/canonical) via the App Router
  Metadata API; shared `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
- `noindex` on all authenticated routes.
- `app/sitemap.ts` and `app/robots.ts` (indexable routes only).
- JSON-LD (`LocalBusiness`, `Service`) on public pages.
- Indexable marketing landing pages funneling to `/new`.
- Lighthouse SEO = 100 on public pages.

**Non-Goals:**
- No booking/trip/pricing/auth behavior changes.
- No CMS/blog, no i18n, no analytics/tag manager.

## Decisions

### D1: Use the App Router Metadata API (static + `generateMetadata`)
Each route segment exports a `metadata` object (or `generateMetadata` when
dynamic). A shared default lives in `app/layout.tsx` with `metadataBase`, default
OG/Twitter, and title template. Chosen over manual `<head>` tags for type-safety
and automatic canonical/OG resolution.
- **Alternative**: hand-rolled `<head>` — rejected (error-prone, no metadataBase).

### D2: Centralize site config
Add `lib/seo/config.ts` exposing `siteUrl` (from `NEXT_PUBLIC_SITE_URL`, with a
localhost fallback), site name, default description, and the OG image path. Used
by layout metadata, sitemap, robots, and JSON-LD to avoid drift.

### D3: `noindex` for private routes
Authenticated route segments export `metadata = { robots: { index: false,
follow: false } }`. Applied at `app/(booking)/bookings`, `app/(dashboard)`,
`app/driver`, and `app/signin` (segment-level so children inherit).

### D4: sitemap.ts / robots.ts
`app/sitemap.ts` returns `MetadataRoute.Sitemap` for `/` + marketing routes
(absolute URLs from `siteUrl`). `app/robots.ts` returns `MetadataRoute.Robots`
allowing `/` and `/services/*`, disallowing `/bookings`, `/dashboard`, `/driver`,
`/signin`, `/api`, and referencing `${siteUrl}/sitemap.xml`.

### D5: JSON-LD component
A small Server Component `components/seo/JsonLd.tsx`:

```ts
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Home renders a `LocalBusiness` object; each marketing page renders a `Service`
object. Builders live in `lib/seo/schema.ts` (typed factory functions).

### D6: Marketing route group + shared layout
New `app/(marketing)/` group with a shared header/footer and one page per service:

```
app/(marketing)/services/
  airport-transfers/page.tsx     -> /services/airport-transfers  [Server]
  hourly/page.tsx                -> /services/hourly
  point-to-point/page.tsx        -> /services/point-to-point
  events/page.tsx                -> /services/events
components/marketing/
  ServiceHero.tsx                [Server] h1 + copy + JSON-LD
  BookingCta.tsx                 [Client-optional] link to /new (data-testid)
```

Each page: one `<h1>`, semantic sections, unique metadata, `Service` JSON-LD, and
a `BookingCta` linking to `/new`. Home nav links to each service (crawlable `<a>`).

### D7: Types / interfaces

```ts
// lib/seo/config.ts
export interface SiteConfig {
  siteUrl: string;
  name: string;
  description: string;
  ogImage: string; // e.g. "/og.png"
}

// lib/seo/schema.ts
export function localBusinessSchema(cfg: SiteConfig): Record<string, unknown>;
export function serviceSchema(args: {
  name: string; description: string; url: string; cfg: SiteConfig;
}): Record<string, unknown>;
```

### D8: Accessibility & test hooks
One `<h1>` per page; descriptive link text; `alt` on images; CTAs expose
`data-testid`. Tests assert metadata/JSON-LD/sitemap/robots.

## Risks / Trade-offs

- **Missing `NEXT_PUBLIC_SITE_URL` in prod** → canonicals/sitemap use localhost →
  mitigate with a validated fallback and a build-time warning; document in
  `.env.example`.
- **Duplicate/inconsistent metadata** → centralize in `lib/seo/config.ts` and a
  title template in the root layout.
- **JSON-LD invalid** → use typed factory functions + a unit test that
  `JSON.parse`s the emitted markup.
- **Marketing pages accidentally gated** → keep them in a public route group with
  no auth calls.

## Migration Plan

1. Add `NEXT_PUBLIC_SITE_URL` to `.env`/`.env.example`; add `lib/seo/config.ts`.
2. Set root-layout metadata (metadataBase, defaults, title template) + `lang`.
3. Add `JsonLd` component + schema builders; wire into home.
4. Add `app/sitemap.ts` and `app/robots.ts`.
5. Add marketing route group + service pages + home nav links.
6. Add `noindex` metadata to authenticated segments.
7. Tests + Lighthouse SEO check. Rollback: remove added files/exports (no data or
   auth impact).

## Resolved Decisions

- **`NEXT_PUBLIC_SITE_URL`** = `https://www.luxurybudgettransport.com` (used as the
  production canonical host; `lib/seo/config.ts` also defaults to it).
- **OG image**: a branded placeholder `public/og.png` (1200×630) was generated;
  replace with the official brand asset when available.
