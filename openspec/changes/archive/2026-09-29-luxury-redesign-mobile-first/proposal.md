## Why

The current home page and marketing flow use a plain, light-themed layout that
does not communicate the premium positioning of Luxury Budget Transportation
("Premium chauffeur service at reasonable cost"). To convert high-intent NYC
clients, the landing experience needs a mobile-first, high-end redesign that
looks and feels like a top-tier luxury brand while remaining fully responsive,
accessible, and fast.

## What Changes

- Introduce a luxury dark-theme brand system (obsidian backgrounds, brass/gold
  accent, high-contrast typography, elegant whitespace) via Tailwind CSS v4
  theme tokens in `app/globals.css`.
- Add a persistent premium **Navigation Header** with an accessible mobile
  hamburger menu (smooth transitions) and a cohesive **Footer** with useful
  section links, wired into `app/layout.tsx`.
- Redesign the home page (`app/page.tsx`) as a mobile-first, single-column-scaling
  experience with four sections:
  - **Hero**: high-impact title/subtitle, a dynamic local premium looping background
    video (`/videos/service-video-bg.mp4`), and a primary CTA
    (`data-testid="hero-cta-book"`) linking to `/new`.
  - **Services**: touch-friendly cards mapped dynamically from the `SERVICES`
    array in `lib/seo/services.ts`, each linking to its service page with a
    `data-testid`.
  - **Our Fleet**: showcase of seeded vehicles (Mercedes S-Class, Cadillac
    Escalade) with capacity/luggage/comfort badges, a swipeable mobile carousel
    that scales to a multi-column desktop grid, and a "Reserve this vehicle" CTA.
  - **Contact**: two-column desktop / single-column mobile layout with NYC
    contact info (phone, email, JFK/LGA/EWR + 5 boroughs coverage) and an
    accessible, gold-focus contact form (Name, Email, Phone, Message).
- Restyle existing marketing components (`components/marketing/ServiceHero.tsx`,
  `components/marketing/BookingCta.tsx`) for aesthetic consistency with the new
  brand system.
- Preserve role-aware home navigation (operator link) and existing session
  behavior; no database schema or auth changes.

## Capabilities

### New Capabilities
- `luxury-brand-system`: Dark luxury theme tokens (palette, typography,
  whitespace scale) in `app/globals.css`, plus a persistent premium header with
  accessible mobile hamburger menu and a cohesive site footer applied globally
  via `app/layout.tsx`.
- `home-landing-experience`: Mobile-first redesigned home page with Hero (featuring a high-definition local background video loop),
  Services, Our Fleet, and Contact sections, including a customer-facing contact
  form and fleet showcase, all built with touch-first, accessible, `data-testid`
  instrumented interactive elements.

### Modified Capabilities
<!-- No spec-level requirement changes to existing capabilities; ServiceHero
     restyle is implementation-only. The existing marketing-pages requirement
     "each service page is linked from the home page" continues to hold. -->

## Impact

- **Code**: `app/globals.css` (theme tokens), `app/layout.tsx` (header/footer),
  `app/page.tsx` (redesign), `components/marketing/ServiceHero.tsx` and
  `components/marketing/BookingCta.tsx` (restyle); new components under
  `components/layout/` (header, footer, mobile menu) and `components/marketing/`
  (hero, services grid, fleet showcase, contact form/section).
- **Assets**: Downloaded and hosted the luxury driving mp4 video in `public/videos/service-video-bg.mp4` on-disk.
- **Data**: Reads existing `SERVICES` (`lib/seo/services.ts`) and mirrors seeded
  fleet data (`prisma/seed.ts`); no Prisma model or migration changes.
- **Auth**: No NextAuth role or session changes; role-aware home links preserved.
- **NYC domain**: Surfaces JFK/LGA/EWR airports and the five boroughs in the
  contact/coverage content.
- **Testing**: New/updated Jest + RTL component tests and Playwright E2E for the
  home page, header/menu, fleet, and contact form; all interactive elements
  expose unique `data-testid` attributes.
- **Quality**: Mobile-first, ≥44×44px touch targets, ARIA labels/keyboard
  navigation, and Lighthouse > 90 target maintained.

## Non-goals

- No backend contact-form submission pipeline (email/CRM) — the form is a
  client-facing UI with local validation only in this change.
- No changes to booking, quoting, driver portal, or dashboard flows.
- No database schema, Prisma migration, or NextAuth/session changes.
- No new service offerings or fleet inventory beyond existing seeded data.
- No changes to individual `/services/[slug]` page content/copy beyond visual
  restyling for brand consistency.
