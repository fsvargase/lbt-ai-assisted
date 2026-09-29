## ADDED Requirements

### Requirement: Mobile-first hero section
The home page (`app/page.tsx`) SHALL present a mobile-first hero as a single
clean column that scales to a multi-column layout on desktop. The hero SHALL
display the title "Luxury Budget Transportation — NYC Premium Chauffeur Service"
and the subtitle "Experience unparalleled luxury ground transportation at a
price that fits your budget." It SHALL include a prominent, touch-friendly
primary CTA with `data-testid="hero-cta-book"` linking to `/new`. The page SHALL
contain exactly one `<h1>`.

#### Scenario: Hero renders with title, subtitle, and booking CTA
- **WHEN** the `/` page is rendered
- **THEN** it contains exactly one `<h1>` with the luxury title, the specified
  subtitle text, and a CTA `data-testid="hero-cta-book"` linking to `/new`

#### Scenario: Hero scales responsively
- **WHEN** the hero renders on a mobile viewport
- **THEN** it displays as a single clean column
- **AND** on a desktop viewport it scales to a multi-column layout

### Requirement: Premium Hero Background Video Loop
The Hero section (`components/marketing/Hero.tsx`) SHALL load a high-definition,
silenced background loop of a premium driving vehicle. To optimize page speed
and ensure reliability, the video file SHALL be loaded locally from the project's
assets structure. The page content layer SHALL remain completely accessible, legible,
and centered over this looping video with flawless contrast.

#### Scenario: Hero background video loads locally
- **WHEN** the Hero section is rendered on any viewport
- **THEN** it initiates a `<video>` element loading `/videos/service-video-bg.mp4`
- **AND** the video is configured to automatically play, loop, stay muted, and bypass keyboard focus

#### Scenario: Text labels are perfectly readable over the video loop
- **WHEN** the local video loop plays underneath the Hero headings
- **THEN** the overlay filters provide sufficient contrast so headings and buttons are always highly readable without being obscured by the video's bright regions

### Requirement: Dynamic services section
The home page SHALL render a services section that dynamically maps the
`SERVICES` array exported from `lib/seo/services.ts`. Each service SHALL render
as a touch-friendly card with premium rounded borders and a subtle hover effect,
linking to `/services/<slug>` and exposing a unique `data-testid`
(e.g. `home-service-<slug>`) with an accessible label.

#### Scenario: Services are mapped from the SERVICES data
- **WHEN** the `/` page is rendered
- **THEN** it renders one card per entry in `SERVICES`, each linking to
  `/services/<slug>` with a `data-testid` of `home-service-<slug>`

#### Scenario: Adding a service requires no home page markup change
- **WHEN** a new entry is added to the `SERVICES` array
- **THEN** a corresponding service card appears on the home page without editing
  the section's markup

### Requirement: Our Fleet showcase
The home page SHALL render an "Our Fleet" section showcasing the seeded flagship
vehicles — Mercedes S-Class (luxury sedan, 3 passengers/bags) and Cadillac
Escalade (premium SUV, 6 passengers/bags). Each vehicle SHALL display technical
badges (passengers, luggage, comfort level) and a "Reserve this vehicle" CTA
linking to the booking flow. The layout SHALL present a swipeable horizontal
carousel or single-column stack on mobile and a multi-column grid on desktop.
Each interactive element SHALL expose a unique `data-testid` and accessible
label.

#### Scenario: Fleet vehicles render with badges and reserve CTA
- **WHEN** the `/` page is rendered
- **THEN** it displays the Mercedes S-Class and Cadillac Escalade with passenger,
  luggage, and comfort badges
- **AND** each vehicle has a "Reserve this vehicle" CTA with a unique
  `data-testid` linking to the booking flow

#### Scenario: Fleet layout adapts to viewport
- **WHEN** the fleet section renders on a mobile viewport
- **THEN** it presents a swipeable horizontal carousel or single-column stack
- **AND** on a desktop viewport it presents a multi-column grid

### Requirement: Customer contact section
The home page SHALL render a contact section using a two-column layout on
desktop and a single column on mobile. One column SHALL present key NYC contact
information (phone, email, and coverage areas including JFK/LGA/EWR airports and
the five boroughs). The other column SHALL present an accessible contact form
with well-spaced responsive fields for Name, Email, Phone, and Message, with a
gold accent focus style. All form fields and the submit control SHALL expose
unique `data-testid` attributes and accessible labels, and validate required
fields on the client before a submit attempt.

#### Scenario: Contact info lists NYC coverage
- **WHEN** the contact section is rendered
- **THEN** it displays a phone number, an email, and coverage referencing
  JFK, LGA, and EWR plus the five NYC boroughs

#### Scenario: Contact form fields are present and labelled
- **WHEN** the contact form is rendered
- **THEN** it contains Name, Email, Phone, and Message fields plus a submit
  control, each with a unique `data-testid` and an associated accessible label

#### Scenario: Submitting with missing required fields is blocked
- **WHEN** a user submits the contact form with a required field empty
- **THEN** the form does not proceed and surfaces an accessible validation
  message for the invalid field

### Requirement: Role-aware home navigation preserved
The redesigned home page SHALL preserve role-aware navigation, continuing to
surface the operator dashboard link for users with `OPERATOR` or `ADMIN` roles
while never exposing role-restricted links to unauthorized users.

#### Scenario: Operator sees dashboard link
- **WHEN** a user with `OPERATOR` or `ADMIN` role loads the `/` page
- **THEN** the home page surfaces a link to `/dashboard/bookings` with a
  `data-testid`

#### Scenario: Non-operator does not see dashboard link
- **WHEN** a client or unauthenticated visitor loads the `/` page
- **THEN** no operator dashboard link is rendered
