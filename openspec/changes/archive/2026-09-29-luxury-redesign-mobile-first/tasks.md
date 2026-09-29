## 1. Brand theme tokens

- [x] 1.1 Define luxury tokens in `app/globals.css` `:root` (obsidian
  `--background`, `--surface`, `--foreground`, `--muted`, gold `--accent-gold`)
- [x] 1.2 Map tokens under `@theme inline` (`--color-background`,
  `--color-surface`, `--color-foreground`, `--color-muted`,
  `--color-accent-gold`) and set the sans font token
- [x] 1.3 Apply the dark obsidian surface as the default `body` background/text
  and remove the light/dark `prefers-color-scheme` swap for the marketing surface
- [x] 1.4 Audit booking/dashboard/driver pages for hard-coded light-background
  assumptions and adjust text/border utilities so they remain legible

## 2. Global layout: header & footer

- [x] 2.1 Create `components/layout/SiteHeader.tsx` (Client) with brand mark,
  inline `md:` nav links, and a hamburger toggle button
- [x] 2.2 Create `components/layout/MobileMenu.tsx` (Client) navigation panel with
  smooth open/close transitions
- [x] 2.3 Wire header toggle state with `aria-expanded`, `aria-controls`,
  `aria-label`; ensure keyboard focus and ≥44×44px touch targets
- [x] 2.4 Create `components/layout/SiteFooter.tsx` (Server) with brand identity
  and links to home sections (services, fleet, contact) and core flows
- [x] 2.5 Mount `SiteHeader` and `SiteFooter` in `app/layout.tsx` around
  `{children}`
- [x] 2.6 Add `data-testid` to all header/footer interactive elements
  (`nav-menu-toggle`, `nav-menu-panel`, `nav-link-<key>`, `footer-link-<key>`)

## 3. Fleet data

- [x] 3.1 Create `lib/fleet/vehicles.ts` with `FleetVehicle` interface and
  `FLEET` array mirroring seeded vehicles (Mercedes S-Class 3 pax/bags, Cadillac
  Escalade 6 pax/bags) with a comment referencing `prisma/seed.ts`

## 4. Home page sections

- [x] 4.1 Create `components/marketing/Hero.tsx` (Server) with the luxury `<h1>`
  title, subtitle, and primary CTA `data-testid="hero-cta-book"` linking to `/new`
- [x] 4.2 Create `components/marketing/ServicesGrid.tsx` (Server) mapping
  `SERVICES` into premium rounded touch cards linking to `/services/<slug>` with
  `data-testid="home-service-<slug>"`
- [x] 4.3 Create `components/marketing/FleetShowcase.tsx` (Server) +
  `components/marketing/FleetCarousel.tsx` (Client) rendering `FLEET` with
  passenger/luggage/comfort badges and `data-testid="fleet-reserve-<slug>"` CTAs
- [x] 4.4 Implement responsive fleet layout: swipeable horizontal scroll-snap /
  single-column on mobile, multi-column grid on desktop
- [x] 4.5 Create `components/marketing/ContactSection.tsx` (Server) with NYC
  contact info (phone, email, JFK/LGA/EWR + five boroughs coverage) in a
  two-column desktop / single-column mobile layout
- [x] 4.6 Create `components/marketing/ContactForm.tsx` (Client) with Name, Email,
  Phone, Message fields + submit, gold focus styles, client-side required
  validation, `aria-invalid`/`aria-describedby`, and testids (`contact-name`,
  `contact-email`, `contact-phone`, `contact-message`, `contact-submit`)
- [x] 4.7 Rebuild `app/page.tsx` to compose Hero, Services, Fleet, Contact while
  preserving `getSafeSession()` role-aware operator dashboard link

## 5. Restyle existing marketing components

- [x] 5.1 Restyle `components/marketing/ServiceHero.tsx` for the dark luxury
  brand system (surfaces, gold accent, whitespace hierarchy)
- [x] 5.2 Restyle `components/marketing/BookingCta.tsx` to the new premium button
  style while keeping its existing `data-testid`

## 6. Accessibility & responsiveness pass

- [x] 6.1 Verify all new interactive elements have unique `data-testid`,
  ARIA labels/roles, and keyboard operability
- [x] 6.2 Verify ≥44×44px touch targets and mobile-first breakpoints across all
  sections and the header menu

## 7. Tests

- [x] 7.1 Add/update Jest + RTL tests for Hero, ServicesGrid (maps SERVICES),
  FleetShowcase (badges + reserve CTAs), and ContactForm (renders fields,
  blocks submit on missing required field)
- [x] 7.2 Add RTL test for `SiteHeader` mobile menu toggle (`aria-expanded`
  toggling, links reachable)
- [x] 7.3 Add RTL test asserting the operator dashboard link renders only for
  OPERATOR/ADMIN sessions on the home page
- [x] 7.4 Add/update Playwright E2E for the home page: hero CTA navigates to
  `/new`, service links resolve, fleet reserve CTA works, mobile menu opens
- [x] 7.5 Run `npm run lint` and `npx tsc --noEmit`; fix ESLint/Prettier/type
  issues
- [x] 7.6 Run `npm test` and `npm run test:e2e`; ensure all pass

## 8. Premium background video integration

- [x] 8.1 Create directory `public/videos/` and download the background video file `service-video-bg.mp4` locally to prevent network CORS/DNS latencies
- [x] 8.2 Incorporate `<video>` loop inside `Hero.tsx` with attributes `autoPlay`, `loop`, `muted`, `playsInline`
- [x] 8.3 Wire layers with explicit z-index (`z-0` video, `z-10` overlay, `z-20` content) to guarantee standard stacking context above custom layout page backgrounds
- [x] 8.4 Reduce block layer opacity to `35%` black level to retain maximum video brightness without disrupting primary white and gold visual contrasts
