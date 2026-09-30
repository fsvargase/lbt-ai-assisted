## ADDED Requirements

### Requirement: Homepage Hero features brand logo and Instagram link
The system SHALL display the official graphical brand logo on the homepage Hero section, and SHALL provide a prominent, accessible "FOLLOW US AT INSTAGRAM" call-to-action button linking directly to the LBT Instagram page.

#### Scenario: Visual brand representation in Hero
- **WHEN** the homepage (`/`) is rendered
- **THEN** it SHALL render the brand logo image `/logo_lbt.png`
- **AND** it SHALL contain alternative text "Luxury Budget Transportation — NYC Premium Chauffeur Service" inside the image or via appropriate accessible labels to preserve SEO context
- **AND** it SHALL not render the raw plain-text title "Luxury Budget Transportation — NYC Premium Chauffeur Service"
- **AND** it SHALL NOT render the text description "Experience unparalleled luxury ground transportation at a price that fits your budget."

#### Scenario: Instagram integration in Hero
- **WHEN** the homepage (`/`) is rendered
- **THEN** it SHALL render a button or link with the text "FOLLOW US AT INSTAGRAM"
- **AND** it SHALL link to "https://www.instagram.com/luxurybudgettransport/"
- **AND** it SHALL expose a `data-testid` attribute for E2E testing

### Requirement: SiteHeader brand mark uses official graphical logo
The SiteHeader SHALL display the official header logo image representing the brand instead of raw plain-text.

#### Scenario: SiteHeader displays brand logo
- **WHEN** the header is rendered on any page
- **THEN** it SHALL render the logo image `/logo_lbt_header.png` inside the home link
- **AND** contain alternative text "Luxury Budget Transportation" to preserve navigation clarity and accessibility
