## Why

To enhance brand consistency and provide a more premium visual experience, the homepage's text-based title will be replaced with the official graphical logo of Luxury Budget Transportation. Additionally, an Instagram call-to-action button will be added to connect visitors directly to the official LBT social media presence, driving engagement and brand loyalty.

## What Changes

- **Replace Title with Logo**: Substitute the text-only standard title `<h1>uxury Budget Transportation — NYC Premium Chauffeur Service</h1>` in the Hero component with the graphical logo image (`/logo_lbt.png`). Maintain accessibility by providing descriptive `alt` text. Enlarge the logo image (max width 600px) to maximize visual appeal.
- **Remove Subtitle**: Remove the redundant text-based subtitle sentence "Experience unparalleled luxury ground transportation at a price that fits your budget." from the Hero card visual container to keep visual focus clean, uncluttered, and premium.
- **Update Primary Button Colors**: Restyle the critical call-to-action buttons ("Book Now", "Send Inquiry", "Request booking") to utilize the refined gold color `#e0b655` by updating the `--accent-gold` global token and modifying button classes to ensure visually premium background alignment.
- **Add Instagram CTA**: Add a brand-aligned button reading "FOLLOW US AT INSTAGRAM" that links directly to the official Instagram profile: `https://www.instagram.com/luxurybudgettransport/`.
- **Responsive Layout Adjustments**: Ensure the logo image is appropriately scaled and responsive across desktop, tablet, and mobile layouts.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `marketing-pages`: The main landing page requirement is modified to feature the official graphical brand logo instead of a plain-text H1 title while maintaining visual hierarchy, semantic SEO relevance, and introducing an Instagram-focused integration.

## Impact

- **Affected Components**:
  - `components/marketing/Hero.tsx` (replaces `h1` text with `Image` from Next.js, adds Instagram button next to existing Book Now CTA or in a key visual location).
- **Assets**:
  - `public/logo_lbt.png` (newly downloaded asset).
- **SEO/Metadata/Tests**:
  - Review how tests verify the heading structure of the landing page. If any component tests search specifically for the exact string of the replaced H1 text, they will need updating.
