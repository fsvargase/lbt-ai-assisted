# bot-protection

## Purpose

Google reCAPTCHA v3 (invisible, score-based) protection for public,
unauthenticated-capable forms — the booking submission (`POST /api/bookings`)
and the marketing contact form — including client-side token acquisition,
server-side verification with score thresholding, and rejection of
missing/invalid/low-score tokens. Authenticated internal, operator, and driver
views are intentionally out of scope.

## Requirements

### Requirement: Public forms execute reCAPTCHA v3 and submit a token
The system SHALL protect public, unauthenticated-capable forms with Google
reCAPTCHA v3 (invisible, score-based). The booking form
(`components/booking/BookingForm.tsx`) and the marketing contact form
(`components/marketing/ContactForm.tsx`) SHALL obtain a reCAPTCHA token using the
public site key from `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and include it with the
submission. The reCAPTCHA secret SHALL NOT be exposed to any Client Component.

#### Scenario: Booking form includes a reCAPTCHA token on submit
- **WHEN** a user submits the booking form with valid inputs
- **THEN** the client obtains a reCAPTCHA v3 token and includes it as
  `recaptchaToken` in the `POST /api/bookings` request body

#### Scenario: Contact form includes a reCAPTCHA token on submit
- **WHEN** a user submits the marketing contact form with valid inputs
- **THEN** the client obtains a reCAPTCHA v3 token before completing the
  submission

#### Scenario: Public site key is used without exposing the secret
- **WHEN** the reCAPTCHA client script executes in the browser
- **THEN** it uses only `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **AND** `RECAPTCHA_SECRET_KEY` is never referenced by client-side code

### Requirement: Server verifies the reCAPTCHA token before any side effect
The system SHALL verify the reCAPTCHA token server-side against Google's
verification endpoint using `RECAPTCHA_SECRET_KEY` before performing any side
effect (such as creating a Booking). The system SHALL reject a request whose
token is missing, invalid, or whose score is below the configured threshold with
HTTP `400`, and SHALL NOT create or mutate any data in that case.

#### Scenario: Reject a booking submission with a missing token
- **WHEN** `POST /api/bookings` receives a request with no `recaptchaToken`
- **THEN** the handler responds `400` and no Booking is created

#### Scenario: Reject a booking submission with an invalid token
- **WHEN** `POST /api/bookings` receives a `recaptchaToken` that Google reports
  as invalid
- **THEN** the handler responds `400` and no Booking is created

#### Scenario: Reject a booking submission with a low reCAPTCHA score
- **WHEN** `POST /api/bookings` receives a token that verifies successfully but
  whose score is below the configured threshold
- **THEN** the handler responds `400` and no Booking is created

#### Scenario: Accept a booking submission with a valid high-score token
- **WHEN** `POST /api/bookings` receives a `recaptchaToken` that Google verifies
  as valid with a score at or above the threshold, and all other inputs are valid
- **THEN** the handler proceeds to create the Booking and responds `201`

### Requirement: reCAPTCHA protection is scoped to public forms only
The system SHALL apply reCAPTCHA verification only to public forms (booking
submission and marketing contact) and SHALL NOT require reCAPTCHA on
authenticated internal, operator, or driver views.

#### Scenario: Driver and operator views are not gated by reCAPTCHA
- **WHEN** an authenticated operator or driver interacts with internal dashboard
  or driver-portal actions
- **THEN** those actions do not require a reCAPTCHA token and are not rejected for
  a missing token
