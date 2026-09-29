## ADDED Requirements

### Requirement: Luxury dark theme tokens
The system SHALL define luxury brand theme tokens in `app/globals.css` using
Tailwind CSS v4 `@theme inline`, including an obsidian primary background
(`#0B0B0C` or `#0F0F10`), a secondary/card surface (`#161618` or `#1E1E21`), a
metallic brass/gold accent (`--color-accent-gold`, `#BDA376` or `#D4AF37`), a
high-contrast primary text color (`#FFFFFF`), and an elegant secondary text
color (`#9CA3AF`). These tokens SHALL be applied globally so the marketing
experience renders on the dark luxury surface by default.

#### Scenario: Dark luxury surface applied globally
- **WHEN** the root layout (`app/layout.tsx`) renders any page using the brand
  system
- **THEN** the document body uses the obsidian background token and
  high-contrast foreground token
- **AND** the gold accent token (`--color-accent-gold`) is available to
  components via Tailwind utilities or CSS variables

#### Scenario: Typography maximizes elegant whitespace hierarchy
- **WHEN** a page rendered with the brand system displays headings and body text
- **THEN** it uses the defined clean modern sans-serif font tokens with a
  consistent type scale that establishes clear visual hierarchy

### Requirement: Persistent premium navigation header
The system SHALL render a persistent navigation header from `app/layout.tsx`
across pages. On mobile the header SHALL expose an accessible hamburger menu
button that toggles a navigation panel with smooth transitions; on desktop the
navigation links SHALL be visible inline. Every interactive element in the
header SHALL carry a unique `data-testid` and an accessible label, and touch
targets SHALL be at least 44×44px.

#### Scenario: Mobile hamburger menu toggles navigation
- **WHEN** a user on a mobile viewport activates the header menu button
  (`data-testid="nav-menu-toggle"`)
- **THEN** the navigation panel opens with a transition and exposes navigation
  links each with their own `data-testid`
- **AND** activating the toggle again closes the panel

#### Scenario: Header menu is keyboard and screen-reader accessible
- **WHEN** a user navigates the header using the keyboard
- **THEN** the menu toggle is focusable, has an `aria-expanded` state reflecting
  open/closed, and the navigation links are reachable via keyboard
- **AND** the toggle exposes an `aria-label` describing its action

#### Scenario: Desktop shows inline navigation
- **WHEN** the header renders on a desktop viewport
- **THEN** the primary navigation links are visible inline without requiring the
  hamburger toggle

### Requirement: Cohesive site footer
The system SHALL render a cohesive footer from `app/layout.tsx` containing brand
identity and useful links to the home page sections (services, fleet, contact)
and core flows. Footer links SHALL each expose a unique `data-testid` and an
accessible label.

#### Scenario: Footer exposes navigable links
- **WHEN** the footer renders on any page
- **THEN** it contains crawlable `<a>` links to the home page sections and core
  flows, each with a `data-testid` and accessible label
