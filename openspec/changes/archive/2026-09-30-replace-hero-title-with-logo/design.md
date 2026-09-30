## Context

The landing page of the platform currently uses a plain-text heading for the brand: "Luxury Budget Transportation — NYC Premium Chauffeur Service". To deliver a more premium brand-aligned visual identity, this text will be replaced with the graphical logo available on the official website. In addition, to foster community growth and direct users to LBT's social media, a new Instagram follow button will be added to the Hero component.

## Goals / Non-Goals

**Goals:**
- Replace the raw text `h1` in the Hero with the official graphical logo asset `logo_lbt.png`.
- Remove the subtitle "Experience unparalleled luxury ground transportation..." to provide a cleaner layout.
- Ensure strong SEO and accessibility by using an `sr-only` text wrapper inside the `h1` element and a detailed `alt` attribute on the `Image` component.
- Add a highly visible, responsive, and styled "FOLLOW US AT INSTAGRAM" button linking to `https://www.instagram.com/luxurybudgettransport/`.
- Ensure all interactive elements expose correct `data-testid` attributes and follow ARIA design/accessibility requirements.

**Non-Goals:**
- Modifying the navigation menu logo/header context at this stage.
- Changing the background video behavior or other sections of the homepage.

## Decisions

### Component Hierarchy and React components

The modification will be isolated within `components/marketing/Hero.tsx`.
- Keep `Hero` as a React Server Component (no state or core interactivity is required other than standard navigation hyperlinks).
- Use Next.js `<Image />` component with `priority` set to true for the logo since it is above-the-fold and a critical LCP (Largest Contentful Paint) element.

### HTML Structure and SEO Strategy

```tsx
<h1 className="flex justify-center select-none pointer-events-none mb-6">
  <span className="sr-only">Luxury Budget Transportation — NYC Premium Chauffeur Service</span>
  <Image
    src="/logo_lbt.png"
    alt="Luxury Budget Transportation Logo"
    width={500}
    height={150}
    priority
    className="h-auto max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[600px] object-contain"
  />
</h1>
```

### CTA Layout Strategy

Currently:
```tsx
<div className="mt-10 flex justify-center">
  <Link href="/new" ...>Book Now</Link>
</div>
```
To be modified to:
```tsx
<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
  <Link
    href="/new"
    data-testid="hero-cta-book"
    className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-accent-gold px-8 text-sm font-semibold uppercase tracking-wider text-background shadow-lg shadow-accent-gold/20 hover:bg-accent-gold/90 transition-all hover:scale-105 active:scale-95"
  >
    Book Now
  </Link>
  <a
    href="https://www.instagram.com/luxurybudgettransport/"
    target="_blank"
    rel="noopener noreferrer"
    data-testid="hero-cta-instagram"
    className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border-2 border-accent-gold bg-transparent px-8 text-sm font-semibold uppercase tracking-wider text-accent-gold hover:bg-accent-gold/10 transition-all hover:scale-105 active:scale-95"
  >
    Follow Us At Instagram
  </a>
</div>
```

## Risks / Trade-offs

- **[Risk] LCP and Layout Shift**: Introducing an image in the Hero section could lead to Layout Shifts (CLS) or slow Largest Contentful Paint (LCP).
  - *Mitigation*: Use Next.js `<Image />` component with pre-defined dimensions, CSS containment, and the `priority` attribute to trigger prefetching and instant load.
- **[Risk] Broken Linkage**: Social links might break if URLs change.
  - *Mitigation*: Hardcode the verified LBT Instagram URL `https://www.instagram.com/luxurybudgettransport/` in the CTA routing.
- **[Risk] Existing Tests break**: If a Jest or Playwright test expects the exact text "Luxury Budget Transportation — NYC Premium Chauffeur Service" to be a visible `h1` element, it might fail.
  - *Mitigation*: Re-verify screen readers and heading role selectors.
