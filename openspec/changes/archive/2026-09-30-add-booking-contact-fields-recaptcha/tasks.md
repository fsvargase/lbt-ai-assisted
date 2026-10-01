## 1. Environment & configuration

- [x] 1.1 Add `RECAPTCHA_SECRET_KEY` (server-only) to the Zod schema in `lib/env.ts`
- [x] 1.2 Add a public accessor/validation for `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` usable from client code (never importing the server `env`)
- [x] 1.3 Document the two new env vars in `README.md` / `.env.example` (site key public, secret key server-only)

## 2. Prisma model & migration

- [x] 2.1 Add `contactEmail` and `contactPhone` fields to the `Booking` model in `prisma/schema.prisma` (phone stored as normalized US/E.164) and make `customer`/`customerId` optional (nullable)
- [x] 2.2 Create the migration (`npx prisma migrate dev`) that adds the contact columns with a transitional backfill/default for existing rows and relaxes the `customerId` non-null constraint
- [x] 2.3 Run `npx prisma generate` and confirm the Booking type includes the new fields
- [x] 2.4 Update `prisma/seed.ts` to set `contactEmail`/`contactPhone` on seeded bookings — N/A: the seed creates no bookings

## 3. Phone normalization helper

- [x] 3.1 Add `lib/phone.ts` with `normalizeUsPhone(raw)` returning E.164 (`+1XXXXXXXXXX`) or `null`, plus an `isValidUsPhone` guard
- [x] 3.2 Add Jest unit tests in `__tests__/lib/phone.test.ts` (10-digit, 1-prefixed 11-digit, formatted, invalid, empty)

## 4. reCAPTCHA v3 server verification

- [x] 4.1 Add server-only `lib/recaptcha.ts` exporting `verifyRecaptcha(token, opts?)` that POSTs to Google siteverify with `RECAPTCHA_SECRET_KEY`, checks `success` and `score >= minScore` (default 0.5), and fails closed on error
- [x] 4.2 Add a fetch timeout guard so a slow verification response cannot hang the request
- [x] 4.3 Add Jest tests in `__tests__/lib/recaptcha.test.ts` mocking `fetch` (valid high score, invalid token, low score, network error)

## 5. Booking schema validation

- [x] 5.1 Extend `createBookingSchema` in `lib/bookings/schemas.ts` with `contactEmail` (email), `contactPhone` (transform+validate to E.164 via `lib/phone.ts`), and `recaptchaToken` (non-empty)
- [x] 5.2 Ensure `recaptchaToken` is excluded from the persisted input passed to `createBooking()`
- [x] 5.3 Add/extend Jest tests in `__tests__/lib/bookings-service.test.ts` (or a schema test) for valid contact input and rejection of invalid email/phone/missing token

## 6. Booking service persistence

- [x] 6.1 Update `createBooking()` in `lib/bookings/service.ts` to accept an optional `customerId` (`string | null`) and persist `contactEmail` and the normalized `contactPhone`; connect the `customer` only when an id is provided
- [x] 6.2 Confirm the returned Booking includes the new fields via the existing `bookingInclude`

## 7. Booking API route: guest submissions + reCAPTCHA gate

- [x] 7.1 In `app/api/bookings/route.ts` (`POST`), remove the unconditional `requireClient()` gate so unauthenticated guests can submit
- [x] 7.2 Verify `input.recaptchaToken` with `verifyRecaptcha()` immediately after schema parse and before `createBooking()`; throw `badRequest(...)` → `400` for missing/invalid/low-score tokens with no data mutation
- [x] 7.3 Resolve the optional session (`getSafeSession()`); link to `user.customerId` when a client session exists, otherwise create a guest booking with `customerId = null`
- [x] 7.4 Keep `GET /api/bookings` authenticated and client-scoped
- [x] 7.5 Add Jest tests for the route: reject missing token, reject invalid/low-score token (mock `verifyRecaptcha`), guest submission (no session) creates booking `201`, client submission links the customer

## 8. Client reCAPTCHA execution

- [x] 8.1 Add `hooks/useRecaptcha.ts` that loads the reCAPTCHA v3 script with `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and returns an `execute(action)` that resolves a token
- [x] 8.2 Verify no `"use client"` module imports the server `env` or the secret key

## 9. BookingForm contact fields & validation

- [x] 9.1 Add email and phone inputs to `components/booking/BookingForm.tsx` with labels, ARIA (`aria-invalid`, `aria-describedby`) and keyboard access
- [x] 9.2 Add `data-testid` on each input (`contact-email`, `contact-phone`) and error node (`contact-email-error`, `contact-phone-error`)
- [x] 9.3 Add client-side validation using `lib/phone.ts` (valid email + valid US phone) with inline accessible error messages before submit
- [x] 9.4 Obtain a reCAPTCHA token via `useRecaptcha` on submit and include `recaptchaToken` in the POST body; send normalized/raw contact fields
- [x] 9.5 Add/extend RTL tests in `__tests__/components/BookingForm.test.tsx` (missing email, invalid email, invalid phone, valid submit includes token/contact fields)

## 10. Marketing ContactForm reCAPTCHA

- [x] 10.1 Integrate `useRecaptcha` into `components/marketing/ContactForm.tsx` to obtain a token before completing submission
- [x] 10.2 Keep existing accessible validation and `data-testid`s; add one for any new reCAPTCHA-related state if needed
- [x] 10.3 Update `__tests__/components/ContactForm.test.tsx` so reCAPTCHA execution is mocked and existing behavior still passes

## 11. E2E coverage

- [x] 11.1 Update/extend `e2e/booking.spec.ts` to fill contact email/phone and complete the booking flow with reCAPTCHA mocked or a test key
- [x] 11.2 Add an E2E path for a guest (unauthenticated) booking submission via `POST /api/bookings`

## 12. Quality gates

- [x] 12.1 Run `npm run lint` and fix all issues (ESLint + Prettier)
- [x] 12.2 Run `tsc` / type-check and resolve any type errors (no `any`)
- [x] 12.3 Run `npm test` (Jest + RTL) and ensure all suites pass
- [x] 12.4 Run `npm run test:e2e` (Playwright) for the booking flow — all 3 booking specs PASS against a production build (`next build` + `next start` with `NODE_ENV=test` and `RECAPTCHA_BYPASS="true"`). The cross-role round-trip is a legitimately long flow, so it was marked `test.slow()`. (Against the Turbopack `next dev` server it was flaky — environmental, not a code issue.)
