## Context

The current home page (`app/page.tsx`) and marketing components render on a
light theme with plain cards and no persistent chrome. `app/layout.tsx` sets the
Geist fonts and a minimal body, and `app/globals.css` defines only a light/dark
`--background`/`--foreground` pair via Tailwind CSS v4 `@theme inline`.

This change introduces a mobile-first luxury dark brand system and redesigns the
home/marketing surface to emulate a premium chauffeur brand. Constraints:

- Next.js App Router with Server Components by default; add `"use client"` only
  where interactivity is required.
- Tailwind CSS v4 (`@theme inline` tokens in `app/globals.css`); no config file
  theme extension.
- No Prisma schema/migration changes and no NextAuth/session changes.
- Every interactive element needs a unique `data-testid`, ARIA labelling,
  keyboard support, and ≥44×44px touch targets.
- Fleet data is not yet in a queryable shape on the client; it mirrors seeded
  values in `prisma/seed.ts`.

## Goals / Non-Goals

**Goals:**
- Establish reusable luxury theme tokens (obsidian surfaces, brass/gold accent,
  high-contrast typography) in `app/globals.css`.
- Add a persistent premium header (with accessible mobile hamburger menu) and a
  cohesive footer, wired globally through `app/layout.tsx`.
- Redesign `app/page.tsx` into Hero, Services, Our Fleet, and Contact sections
  that are mobile-first and scale to desktop.
- Restyle `ServiceHero`/`BookingCta` for brand consistency.
- Preserve role-aware home navigation and existing session behavior.

**Non-Goals:**
- No backend contact-form submission (email/CRM) — client-side validation only.
- No changes to booking/quoting/driver/dashboard flows or their routes.
- No Prisma model, migration, or auth/role changes.
- No new fleet inventory beyond the two seeded vehicles.

## Decisions

### Theme tokens in `app/globals.css` (Tailwind v4 `@theme inline`)
Define luxury tokens and map them to Tailwind color utilities so components use
`bg-background`, `text-foreground`, `text-muted`, and `text-accent-gold` /
`border-accent-gold` rather than hard-coded hex values.

```css
:root {
  --background: #0b0b0c;        /* obsidian */
  --surface: #161618;           /* cards */
  --foreground: #ffffff;        /* high-contrast text */
  --muted: #9ca3af;             /* elegant secondary text */
  --accent-gold: #bda376;       /* metallic brass/gold */
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-accent-gold: var(--accent-gold);
  --font-sans: var(--font-geist-sans);
}
```

- **Why**: Tailwind v4 reads `@theme inline` tokens to generate utilities; this
  keeps the palette centralized and avoids scattering hex codes. The dark
  surface becomes the default (remove the light/dark `prefers-color-scheme`
  swap for the marketing surface to keep the luxury look consistent).
- **Alternative considered**: A `tailwind.config` extension — rejected because
  the project uses the v4 CSS-first `@theme` approach with no JS theme config.

### Component hierarchy (Server vs Client)
Keep `app/page.tsx` a Server Component (it reads the session via
`getSafeSession()`). Extract interactive pieces into Client Components:

```
app/layout.tsx (Server)
├─ components/layout/SiteHeader.tsx        (Client — hamburger toggle state)
│    └─ components/layout/MobileMenu.tsx    (Client — panel + transitions)
├─ {children}
└─ components/layout/SiteFooter.tsx        (Server)

app/page.tsx (Server — session, role gating)
├─ components/marketing/Hero.tsx           (Server)
├─ components/marketing/ServicesGrid.tsx   (Server — maps SERVICES)
├─ components/marketing/FleetShowcase.tsx  (Server wrapper)
│    └─ components/marketing/FleetCarousel.tsx (Client — swipe/scroll UI)
└─ components/marketing/ContactSection.tsx (Server)
     └─ components/marketing/ContactForm.tsx (Client — validation state)
```

- **Why**: Minimizes client JS (better Lighthouse), isolates interactivity
  (menu toggle, carousel, form validation) to small Client Components, and keeps
  session/role logic server-side.

### Fleet data source
Add a typed constant module `lib/fleet/vehicles.ts` mirroring the seeded
flagship vehicles, so the client showcase has strongly-typed data without a DB
round-trip:

```ts
export interface FleetVehicle {
  slug: string;
  label: string;          // "Mercedes S-Class"
  vehicleClass: "SEDAN" | "SUV";
  passengers: number;     // 3 | 6
  luggage: number;        // 3 | 6
  comfort: string;        // "First Class" | "Premium"
  testId: string;
}
export const FLEET: FleetVehicle[] = [ /* S-Class, Escalade */ ];
```

- **Why**: Avoids introducing a Route Handler/Prisma query for static marketing
  content and keeps the showcase a Server Component. Values stay in sync with
  `prisma/seed.ts` (Mercedes S-Class cap 3, Cadillac Escalade cap 6).
- **Alternative considered**: Query `prisma.vehicle` — rejected as unnecessary
  DB coupling for a static marketing section and it would force runtime data
  fetching on the landing page.

### Mobile hamburger menu behavior
`SiteHeader` holds `open` state; the toggle button exposes `aria-expanded`,
`aria-controls`, and `aria-label`; the panel animates via Tailwind transition
classes. Inline links show at `md:` and up; the toggle shows below `md`.

- Props/testids: `data-testid="nav-menu-toggle"`, panel
  `data-testid="nav-menu-panel"`, each link `data-testid="nav-link-<key>"`.

### Contact form (client validation only)
`ContactForm` is a Client Component using controlled inputs and native
constraint validation (`required`, `type="email"`). On submit it prevents
default, validates, and shows accessible inline messages (`aria-invalid`,
`aria-describedby`). No network call in this change.

```ts
interface ContactFormValues {
  name: string; email: string; phone: string; message: string;
}
```
- Testids: `contact-name`, `contact-email`, `contact-phone`, `contact-message`,
  `contact-submit`.

### Premium background video optimization
We download and serve the background `.mp4` video locally in `/videos/service-video-bg.mp4` rather than referencing the external URL. The video layer sits at `z-0`, followed by a cinematic overlay at `z-10` and the content wrapper at `z-20` to prevent layout masking issues under page backgrounds.

### Accessibility & test instrumentation
- All CTAs/links/inputs carry unique `data-testid` (hero `hero-cta-book`,
  services `home-service-<slug>`, fleet `fleet-reserve-<slug>`, contact fields
  above).
- ARIA: labelled sections (`aria-labelledby`), form labels tied via `htmlFor`,
  gold focus rings via `focus-visible:ring-accent-gold`.
- Touch targets sized with padding to ≥44×44px.

## Risks / Trade-offs

- **Fleet constants drift from `prisma/seed.ts`** → Mitigation: co-locate a
  short comment in `lib/fleet/vehicles.ts` referencing the seed source and cover
  the values with a component test.
- **Removing the light theme could affect other routes that assumed a light
  background** → Mitigation: audit booking/dashboard/driver pages for hard-coded
  light assumptions; scope token changes so existing pages remain legible, or
  keep neutral text utilities where already explicit.
- **Increased client JS from menu/carousel/form** → Mitigation: keep these as
  small, isolated Client Components; everything else stays server-rendered to
  protect the Lighthouse > 90 target.
- **Carousel accessibility on mobile** → Mitigation: use native scroll-snap with
  keyboard-reachable links rather than a custom JS carousel where possible.
- **Network delay/unreliability on external background video** → Mitigation: Host and reference the file locally under Next.js static assets directory `public/videos/`.

## Migration Plan

1. Update `app/globals.css` tokens and `app/layout.tsx` to mount header/footer.
2. Add `lib/fleet/vehicles.ts` and new `components/layout/*` +
   `components/marketing/*` components.
3. Rebuild `app/page.tsx` sections; restyle `ServiceHero`/`BookingCta`.
4. Add/update Jest + RTL tests and Playwright E2E for home, menu, fleet, contact.
5. Rollback: revert the component/layout/CSS commits — no data or schema changes
   are involved, so rollback is purely code-level.

## Open Questions

- Should the contact form eventually POST to a Route Handler (email/CRM), and if
  so under which capability — deferred as a non-goal here.
- Do booking/dashboard/driver routes need their own dark-theme pass, or should
  the luxury tokens be scoped to the marketing surface only?
