# seo-metadata

## Purpose

Per-page SEO metadata for public routes (title, description, Open Graph, Twitter,
canonical, `metadataBase`, `lang`) and a `noindex` policy that excludes
authenticated routes from search indexing.

## Requirements

### Requirement: Public pages expose unique SEO metadata
The system SHALL provide, for every public (indexable) route, a unique `title`
and `description`, Open Graph and Twitter Card tags, and a `canonical` URL. A
shared `metadataBase` derived from `NEXT_PUBLIC_SITE_URL` SHALL be configured so
relative Open Graph/canonical URLs resolve to absolute URLs. The root `<html>`
SHALL declare `lang="en"`.

#### Scenario: Home page has unique title and description
- **WHEN** the `/` page is rendered
- **THEN** the document head contains a non-empty `<title>` and
  `<meta name="description">` specific to the home page
- **AND** it includes `og:title`, `og:description`, `og:image`, and
  `twitter:card` tags

#### Scenario: Canonical URL is absolute
- **WHEN** any public page is rendered
- **THEN** it emits a `<link rel="canonical">` whose href is an absolute URL
  built from `NEXT_PUBLIC_SITE_URL`

#### Scenario: HTML declares language
- **WHEN** any page is rendered
- **THEN** the root `<html>` element has `lang="en"`

### Requirement: Authenticated routes are excluded from indexing
The system SHALL mark authenticated/private routes as non-indexable via
`robots: { index: false, follow: false }` metadata. This applies to
`/signin`, `/bookings` and its details, `/dashboard/**`, and `/driver/**`.

#### Scenario: Private route emits noindex
- **WHEN** the `/dashboard/bookings` (or `/driver/trips`, `/bookings`, `/signin`)
  page is rendered
- **THEN** the document head contains `<meta name="robots" content="noindex, nofollow">`

#### Scenario: Public route remains indexable
- **WHEN** the `/` or a marketing page is rendered
- **THEN** it does NOT emit a `noindex` robots meta tag
