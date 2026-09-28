# site-discovery

## Purpose

Search-engine discovery surfaces: a dynamic `sitemap.xml` exposing only public
routes, and a `robots.txt` that disallows authenticated routes and references the
sitemap.

## Requirements

### Requirement: Dynamic sitemap lists indexable routes
The system SHALL expose `/sitemap.xml` via `app/sitemap.ts` containing only
public, indexable routes (home and marketing pages) with absolute URLs derived
from `NEXT_PUBLIC_SITE_URL`. Authenticated routes SHALL NOT appear in the
sitemap.

#### Scenario: Sitemap includes public routes
- **WHEN** `/sitemap.xml` is requested
- **THEN** the response lists `/` and each marketing page URL as absolute URLs

#### Scenario: Sitemap excludes private routes
- **WHEN** `/sitemap.xml` is requested
- **THEN** it does NOT contain `/bookings`, `/dashboard`, `/driver`, or `/signin`
  URLs

### Requirement: Robots file references the sitemap
The system SHALL expose `/robots.txt` via `app/robots.ts` that allows crawling of
public routes, disallows authenticated routes, and references the sitemap URL.

#### Scenario: Robots disallows private routes and points to sitemap
- **WHEN** `/robots.txt` is requested
- **THEN** it contains `Disallow` entries for `/dashboard`, `/driver`,
  `/bookings`, and `/signin`
- **AND** it contains a `Sitemap:` line with the absolute sitemap URL
