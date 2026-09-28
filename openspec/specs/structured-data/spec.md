# structured-data

## Purpose

Schema.org JSON-LD structured data on public pages so search engines can render
rich results: `LocalBusiness` for the company and `Service` for each marketing
page.

## Requirements

### Requirement: Home page emits LocalBusiness structured data
The system SHALL render Schema.org JSON-LD of type `LocalBusiness` (or a more
specific transport subtype) on the home page, including business name, service
area (New York City), and URL, using a `<script type="application/ld+json">`
tag.

#### Scenario: Home page includes valid LocalBusiness JSON-LD
- **WHEN** the `/` page is rendered
- **THEN** the DOM contains a `<script type="application/ld+json">` whose parsed
  JSON has `@type` of `LocalBusiness` (or transport subtype) and an `areaServed`
  referencing New York City

### Requirement: Marketing pages emit Service structured data
The system SHALL render Schema.org JSON-LD of type `Service` on each marketing
page, describing the specific service (e.g., airport transfer) and its provider.

#### Scenario: Marketing page includes valid Service JSON-LD
- **WHEN** a marketing service page is rendered
- **THEN** the DOM contains a `<script type="application/ld+json">` whose parsed
  JSON has `@type` of `Service` with a `name` and a `provider`

#### Scenario: JSON-LD is well-formed
- **WHEN** any JSON-LD script is rendered
- **THEN** its text content parses as valid JSON without errors
