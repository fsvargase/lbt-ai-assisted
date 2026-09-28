## ADDED Requirements

### Requirement: Indexable service landing pages exist
The system SHALL provide indexable marketing pages under `app/(marketing)` for
the core services: airport transfers (JFK/LGA/EWR), hourly hire, point-to-point,
and events. Each page SHALL have a single `h1`, SEO-focused copy, unique
metadata, and be reachable from the home page navigation.

#### Scenario: Airport transfers page renders with SEO content
- **WHEN** the `/services/airport-transfers` page is rendered
- **THEN** it contains exactly one `<h1>`, descriptive body copy referencing
  JFK, LGA, and EWR, and unique page metadata

#### Scenario: Each service page is linked from the home page
- **WHEN** the `/` page is rendered
- **THEN** it contains crawlable `<a>` links to each service landing page

### Requirement: Service pages funnel into the booking flow
Each marketing page SHALL include a clear call-to-action linking to the booking
flow at `/new`, exposing a `data-testid` for testing.

#### Scenario: Service page has a booking CTA
- **WHEN** a marketing service page is rendered
- **THEN** it contains a link to `/new` with a `data-testid` (e.g.
  `cta-book-<service>`) and an accessible label
