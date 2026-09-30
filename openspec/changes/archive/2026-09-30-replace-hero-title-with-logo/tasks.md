## 1. Asset Setup

- [x] 1.1 Verify presence and integrity of downloaded `public/logo_lbt.png`

## 2. Component Modification

- [x] 2.1 Integrate Next.js Image component in `components/marketing/Hero.tsx` inside the semantic `h1` with an `sr-only` accessibility text wrapper
- [x] 2.2 Add the "FOLLOW US AT INSTAGRAM" button next to "Book Now" CTA with the official link and `data-testid="hero-cta-instagram"`
- [x] 2.3 Remove the subtitle "Experience unparalleled luxury ground transportation..." from `components/marketing/Hero.tsx` for a clean layout
- [x] 2.4 Restyle primary buttons (Book Now, Send Inquiry, Request Booking) to use premium gold color `#e0b655` by updating `--accent-gold` variable and button backgrounds
- [x] 2.5 Scale up the hero logo to max width 600px for enhanced brand recognition
- [x] 2.6 Replaced raw text "Luxury Budget Transportation" brand mark in `components/layout/SiteHeader.tsx` with the official header logo image `/logo_lbt_header.png` downloaded from the live landing page

## 3. Testing and Verification

- [x] 3.1 Add a unit test in `__tests__/components/Hero.test.tsx` to verify the presence and properties of the Instagram CTA and Logo Image
- [x] 3.2 Run unit tests and linting to ensure zero regressions
- [x] 3.3 Run Playwright E2E tests to verify flow compatibility
