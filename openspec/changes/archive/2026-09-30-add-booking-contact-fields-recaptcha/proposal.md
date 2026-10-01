## Why

A booking is frequently placed for a caller who is not the logged-in account
holder — a guest, a registered client who does not want to reuse their profile
data, or an operator/admin booking on behalf of an unregistered caller. Today
the only contact details live on `Customer`, so we cannot reliably reach the
actual rider for a given booking. At the same time, our public-facing forms have
no bot protection and are exposed to spam and abuse.

## What Changes

- Store per-booking contact details on the `Booking` model: `contactEmail` and
  `contactPhone` (phone normalized to US/E.164, e.g. `+12125550123`).
- Allow `POST /api/bookings` to accept **unauthenticated guest submissions**: a
  booking may be created with no signed-in session, identified solely by its
  contact fields. When a client session is present, the booking is still linked
  to that `Customer`.
- Make `Booking.customerId` **optional** so a guest booking can exist without a
  `Customer`, while the contact fields remain the required rider identity.
- Add a Prisma migration introducing the two contact columns and relaxing the
  `customer` relation to optional on `Booking`.
- Extend `createBookingSchema` with `contactEmail` (valid email), `contactPhone`
  (valid US phone, validated + normalized), and `recaptchaToken`.
- Update `BookingForm.tsx` with accessible email and phone inputs, client-side
  validation, inline errors, and `data-testid` on each new input and error node.
- Validate the US phone format on both client and server; persist the normalized
  E.164 value.
- Protect public forms with **Google reCAPTCHA v3** (invisible, score-based):
  the booking form (`POST /api/bookings`) and the marketing contact form
  (`ContactForm.tsx`). Tokens are verified server-side before any side effect;
  missing / invalid / low-score tokens are rejected with `400`.
- Add env vars `RECAPTCHA_SECRET_KEY` (server-only) and
  `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (public); the secret never reaches a Client
  Component.
- Persist the new contact fields in `createBooking()`.

## Capabilities

### New Capabilities
- `bot-protection`: Google reCAPTCHA v3 verification for public, unauthenticated
  forms (booking submission and marketing contact), including server-side token
  verification, score thresholding, and rejection of missing/invalid/low-score
  tokens.

### Modified Capabilities
- `booking-management`: A Booking now carries its own `contactEmail` and
  `contactPhone` (normalized US/E.164), captured and validated at creation time,
  independent of the owning `Customer` profile. The booking-creation endpoint
  accepts unauthenticated guest submissions, and a Booking may exist without an
  associated `Customer`.

## Impact

- **Prisma / DB**: `Booking` model gains `contactEmail` and `contactPhone`, and
  `customerId`/`customer` become optional; requires a new migration. No NextAuth
  role changes.
- **Validation**: `lib/bookings/schemas.ts` (`createBookingSchema`) adds
  contact + reCAPTCHA fields; new shared US-phone normalization helper.
- **API**: `app/api/bookings/route.ts` (`POST`) no longer requires an
  authenticated client — it verifies the reCAPTCHA token, then creates a guest
  booking (no customer) or a client-linked booking when a session exists;
  `lib/bookings/service.ts` persists the new fields with an optional customer.
  `GET /api/bookings` remains authenticated (clients see only their own).
- **UI**: `components/booking/BookingForm.tsx` and
  `components/marketing/ContactForm.tsx` gain reCAPTCHA v3 execution and (for the
  booking form) email/phone inputs with inline accessible errors.
- **Config**: `lib/env.ts` adds `RECAPTCHA_SECRET_KEY` and
  `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`; a new server-only reCAPTCHA verification
  module.
- **NYC domain**: Contact phone is constrained to US numbering (E.164),
  consistent with NYC-centric operations; no change to locations, airports, or
  time-zone handling.
- **Tests**: Jest + RTL for `BookingForm` validation, Jest for schema + the
  reCAPTCHA-rejection path on `POST /api/bookings`, Playwright for the booking
  flow.

## Non-goals

- No dedicated operator/guest booking-creation **UI** — the public `POST
  /api/bookings` endpoint accepts guest submissions, but no new guest/operator
  screens are added (the existing `BookingForm` is reused).
- No SMS or email delivery to the captured contact details (separate change).
- No OTP / phone-ownership verification.
- No captcha on authenticated internal, operator, or driver views.
- No reCAPTCHA v2 (checkbox/challenge) support.
