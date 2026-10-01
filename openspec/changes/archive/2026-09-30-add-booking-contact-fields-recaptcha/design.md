## Context

Bookings currently connect to a `Customer` (derived from the authenticated
`User`) and store no independent contact details. Contact data lives only on
`Customer.phone`, which is optional and tied to the account holder — not
necessarily the rider. `POST /api/bookings` requires an authenticated client
(`requireClient()`), parses the body with `createBookingSchema`, and calls
`createBooking(customerId, input)`, which persists a `Booking` plus one or two
`Trip` rows.

Public forms (`BookingForm.tsx`, marketing `ContactForm.tsx`) have no bot
protection. `lib/env.ts` validates a small server-only env schema with Zod. The
project is a Next.js App Router monolith with Server Components by default and
Client Components only where interactivity is needed.

This change adds per-booking contact fields and Google reCAPTCHA v3 verification
on public forms, without introducing a new guest/operator booking UI.

## Goals / Non-Goals

**Goals:**
- Persist `contactEmail` and `contactPhone` on `Booking`, with phone normalized
  to US/E.164 (`+1XXXXXXXXXX`).
- Allow `POST /api/bookings` to accept unauthenticated guest submissions, with
  `Booking.customerId` optional; link to the `Customer` only when a client
  session is present.
- Validate email and US phone on both client (inline accessible errors) and
  server (Zod), sharing a single normalization helper.
- Add invisible, score-based reCAPTCHA v3 to the booking form and marketing
  contact form; verify tokens server-side before any side effect.
- Keep the reCAPTCHA secret server-only; expose only the public site key to the
  browser.
- Reject missing/invalid/low-score tokens with `400` and no data mutation.

**Non-Goals:**
- No guest/operator booking-creation UI (fields only).
- No SMS/email delivery, OTP verification, or reCAPTCHA v2.
- No reCAPTCHA on authenticated internal/driver/operator views.

## Decisions

### Prisma: add contact columns and make the customer relation optional
Add two columns to the `Booking` model and relax the `customer` relation so a
guest booking can exist without a `Customer`:

```prisma
model Booking {
  // ...existing fields...
  customer     Customer? @relation(fields: [customerId], references: [id])
  customerId   String?
  contactEmail String
  contactPhone String // normalized US/E.164, e.g. +12125550123
}
```

`contactEmail`/`contactPhone` are modeled as required (`String`); `customerId`
becomes nullable. Because existing rows would violate the new non-null contact
constraint, the migration will add the contact columns with a **temporary
backfill default** for existing rows, then the application always writes real
values going forward. Making `customerId` nullable is non-destructive for
existing rows. Rationale: a booking can be for a non-account rider (guest), so
contact fields—not the customer link—are the required rider identity.

**Alternative considered:** auto-create a placeholder `Customer` for every guest
— rejected because it pollutes the customer table with non-account records and
complicates client-owned listing/access checks.

### Validation: single US-phone normalization helper
Add `lib/phone.ts` exporting `normalizeUsPhone(raw: string): string | null`
that strips non-digits, accepts 10-digit or `1`-prefixed 11-digit US numbers,
and returns E.164 (`+1XXXXXXXXXX`) or `null` when invalid. Used by:
- `createBookingSchema` (server) via a Zod `superRefine`/`transform` so the
  parsed value is already normalized.
- `BookingForm.tsx` (client) for inline validation before submit.

Rationale: one source of truth prevents client/server drift. Avoids adding a
heavy dependency (e.g. `libphonenumber-js`) for a US-only constraint; a focused
regex/normalizer is sufficient and testable.

**Alternative considered:** `libphonenumber-js` — more robust internationally but
unnecessary weight for a US/E.164-only requirement.

### Schema changes (`createBookingSchema`)

```ts
contactEmail: z.string().email(),
contactPhone: z.string().transform(normalize).refine(isValid), // -> +1XXXXXXXXXX
recaptchaToken: z.string().min(1),
```

`recaptchaToken` is part of the request body but is NOT persisted; the route
consumes it for verification and passes the remaining validated fields to
`createBooking()`.

### reCAPTCHA v3 verification module (server-only)
Add `lib/recaptcha.ts` (server-only) exporting
`verifyRecaptcha(token: string, opts?: { action?: string; minScore?: number }): Promise<boolean>`.
It POSTs to `https://www.google.com/recaptcha/api/siteverify` with
`RECAPTCHA_SECRET_KEY`, and returns `true` only when `success === true` and
`score >= minScore` (default threshold, e.g. `0.5`). On any network/parse error
it returns `false` (fail-closed).

- `app/api/bookings/route.ts` calls `verifyRecaptcha(input.recaptchaToken)`
  immediately after schema parse and before `createBooking`; on `false` it
  throws `badRequest(...)` → `400`.
- Booking is created only after successful verification.

### Route auth: `POST` accepts guests, `GET` stays authenticated
`POST /api/bookings` drops the unconditional `requireClient()` gate so guests can
submit. It resolves the optional session with a non-throwing helper
(`getSafeSession()`): when a `client` session exists, the booking is linked to
`user.customerId`; otherwise it is created as a guest booking with
`customerId = null`. Order of operations in the handler: parse body → verify
reCAPTCHA → resolve optional session → `createBooking(customerId | null, input)`.
`GET /api/bookings` keeps `requireClient()` and continues to scope results to the
caller's own bookings.

**Alternative considered:** a separate public `/api/bookings/guest` endpoint —
rejected to avoid duplicating validation/verification logic; a single endpoint
with optional session is simpler and keeps one contract.

### Client reCAPTCHA execution
Add a small client hook `hooks/useRecaptcha.ts` (or inline helper) that loads the
reCAPTCHA v3 script with `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and calls
`grecaptcha.execute(siteKey, { action })` to produce a token on submit. The site
key is read via `process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (inlined at build,
public by design). The secret is never imported into any `"use client"` module.

- `BookingForm.tsx`: obtains a token in `handleSubmit`, includes it in the POST
  body as `recaptchaToken`.
- `ContactForm.tsx`: obtains a token before its client-side success state (no
  backend exists yet for contact, per non-goals; the design keeps a single
  verification helper so a future contact endpoint can reuse it).

### Env additions (`lib/env.ts`)

```ts
RECAPTCHA_SECRET_KEY: z.string().min(1),          // server-only
```
Plus a separate public accessor for `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (validated
where used on the client). The existing `env` object remains server-only and must
never be imported by a Client Component.

### Component contracts / types

```ts
// BookingForm submit payload (client -> POST /api/bookings)
interface CreateBookingBody {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  originId: string;
  destinationId: string;
  outboundAt: string;      // ISO
  returnAt?: string;       // ISO
  contactEmail: string;
  contactPhone: string;    // raw on wire; server normalizes
  recaptchaToken: string;
}
```

New Client Component inputs in `BookingForm.tsx`:
- Email input: `data-testid="contact-email"`, error node
  `data-testid="contact-email-error"`, `aria-invalid`, `aria-describedby`.
- Phone input: `data-testid="contact-phone"`, error node
  `data-testid="contact-phone-error"`, same ARIA wiring.

`createBooking()` signature extends to persist the two fields and accept an
optional customer:
```ts
createBooking(customerId: string | null, input) // input includes contactEmail, contactPhone
```
When `customerId` is `null`, the Booking is created without a `customer`
connection (guest booking).

### Server vs Client split
- Client: `BookingForm.tsx`, `ContactForm.tsx`, `useRecaptcha` hook (script load
  + token execution), inline validation.
- Server: `route.ts` (verification + creation), `lib/recaptcha.ts`,
  `lib/bookings/schemas.ts`, `lib/bookings/service.ts`, `lib/env.ts`,
  `lib/phone.ts`.

## Risks / Trade-offs

- **Required columns on existing rows break the migration** → Use a two-step or
  defaulted backfill migration; verify against seed data before applying.
- **Third-party reCAPTCHA availability / latency** → `verifyRecaptcha` fails
  closed (rejects on error) to preserve protection; keep a single timeout-guarded
  fetch so a slow Google response does not hang the request indefinitely.
- **US-only phone normalizer rejects valid intl numbers** → Acceptable per NYC
  US-centric scope; documented in `lib/phone.ts`. Revisit if international riders
  are added.
- **Score threshold too strict blocks real users / too loose lets bots in** →
  Make `minScore` configurable with a sensible default (`0.5`); tune post-launch.
- **Secret key leakage** → Enforced by keeping `RECAPTCHA_SECRET_KEY` only in
  `lib/env.ts`/`lib/recaptcha.ts` (server) and never importing `env` from a
  client module; lint/review gate.
- **Tests depend on live Google endpoint** → Mock `verifyRecaptcha` / global
  `fetch` in Jest; Playwright uses a test key or mocked verification.
- **Unauthenticated endpoint invites spam/abuse** → reCAPTCHA v3 verification is
  mandatory on `POST /api/bookings` (fails closed); guest bookings are only
  created after a passing score.
- **Guest bookings have no owner and are invisible to client listings** →
  Accepted: `GET /api/bookings` stays client-scoped, so guest bookings
  (`customerId = null`) are reachable only by operators; documented for the
  future operator dashboard.

## Migration Plan

1. Add `contactEmail`/`contactPhone` to `schema.prisma` and make `customerId`
   optional; generate a migration that adds the contact columns (with a
   transitional default/backfill for existing rows) and drops the `customerId`
   non-null constraint, then `npx prisma migrate dev`.
2. Regenerate Prisma client (`npx prisma generate`).
3. Ship schema + service + route + env changes together so the API always
   writes and reads the new fields.
4. Rollback: revert the migration (drop the two columns) and the code changes;
   no data other than the new columns is affected.

## Open Questions

- Final reCAPTCHA score threshold (default `0.5` unless product specifies).
- Whether the marketing contact form should gain a real backend endpoint now or
  remain client-only (current non-goal) — the verification helper is built to be
  reused when that endpoint is added.
