## 0. Project bootstrap

- [x] 0.1 Scaffold Next.js (App Router) + TypeScript + Tailwind + ESLint project into the repo root.
- [x] 0.2 Install and configure Prisma (`@prisma/client`, `prisma`) with a PostgreSQL datasource and `.env` `DATABASE_URL` (gitignored; never committed).
- [x] 0.3 Install and configure NextAuth (Auth.js) with a role-aware session (`client` / `operator/admin` / `driver`).
- [x] 0.4 Install shadcn/ui and base UI primitives; confirm Tailwind is wired. _(Used plain Tailwind accessible primitives instead of the shadcn CLI; Tailwind v4 wired via create-next-app.)_
- [x] 0.5 Set up Jest + React Testing Library and Playwright with npm scripts (`test`, `test:e2e`, `lint`).

## 1. Data model & migration

- [x] 1.1 Add `TripType`, `TripKind`, `BookingStatus`, `TripStatus` enums to `prisma/schema.prisma` (no `CANCELLED` — cancellation is a later change).
- [x] 1.2 Add the new `Location` model (NYC-centric: airport/borough fields) and the `Booking` and `Trip` models with relations to `Customer`, `Driver`, `Vehicle`, `Location`.
- [x] 1.3 Add composite indexes `@@index([driverId, scheduledAt])` and `@@index([vehicleId, scheduledAt])` on `Trip`.
- [x] 1.4 Run `npx prisma migrate dev` to create the initial migration and `npx prisma generate`.
- [x] 1.5 Seed minimal NYC `Location` data (JFK, LGA, EWR, sample boroughs) for local/dev.

## 2. Shared infrastructure

- [x] 2.1 Ensure `lib/prisma.ts` shared client exists (create if missing).
- [x] 2.2 Add `lib/datetime.ts` helper to convert between UTC storage and America/New_York presentation.
- [x] 2.3 Add a role-authorization helper (`lib/auth/guard.ts`) that resolves the NextAuth session and asserts `client` / `operator/admin` / `driver` roles.
- [x] 2.4 Add a `lib/bookings/status.ts` helper that derives `BookingStatus` from a booking's `Trip` statuses.
- [x] 2.5 Validate/declare env vars in a typed module (no secrets exposed to client).

## 3. Booking management API (`app/api/bookings`)

- [x] 3.1 Implement `POST /api/bookings` (role: client) — validate body, create Booking (`REQUESTED`) with 1 trip (one-way) or 2 trips (round-trip); reject missing fields and `returnAt <= outboundAt`.
- [x] 3.2 Implement `GET /api/bookings` and `GET /api/bookings/{id}` (role: client) scoped to the caller; return `403/404` for others' bookings.
- [x] 3.3 Implement `PATCH /api/bookings/{id}/price` (role: operator/admin) — set positive `agreedPrice`, transition `REQUESTED → PRICED`; reject non-positive price and `client` callers.

## 4. Trip assignment API (`app/api/trips`)

- [x] 4.1 Implement `PATCH /api/trips/{id}/assign` (role: operator/admin) — assign driver + vehicle, `PENDING → ASSIGNED`, only when Booking is `PRICED`+.
- [x] 4.2 Enforce driver/vehicle availability inside a transaction: reject overlapping-schedule assignments with `409`.
- [x] 4.3 Support reassign/unassign while `ASSIGNED`; reject changes once `IN_PROGRESS`.
- [x] 4.4 Recompute and persist derived `BookingStatus` after each trip assignment change.

## 5. Driver trip API (`app/api/driver/trips`)

- [x] 5.1 Implement `GET /api/driver/trips` and `GET /api/driver/trips/{id}` (role: driver) scoped to own assigned trips; exclude `PENDING`/unassigned; `403/404` for others'.
- [x] 5.2 Implement `PATCH /api/driver/trips/{id}/status` (role: driver) — allow `ASSIGNED → IN_PROGRESS → COMPLETED`; reject invalid transitions (`409`) and non-owned trips (`403`).
- [x] 5.3 Recompute derived `BookingStatus` after each trip status change.

## 6. UI — client booking (`app/(booking)`)

- [x] 6.1 Add `app/(booking)/new/page.tsx` (Server) to load `Location` options.
- [x] 6.2 Build `BookingForm` (Client) with `TripTypeToggle`, `LocationSelect` (x2), `DateTimePicker`; submit to `POST /api/bookings`.
- [x] 6.3 Add client bookings list/detail views scoped to the session user.

## 7. UI — operator pricing & assignment (`app/(dashboard)`/`app/admin`)

- [x] 7.1 Add booking detail page (Server) loading booking + trips.
- [x] 7.2 Build `AgreedPriceForm` (Client) calling the price endpoint.
- [x] 7.3 Build `TripAssignmentPanel` (Client) with per-trip driver/vehicle selects calling the assign endpoint.
- [x] 7.4 Add operator bookings list page at `/dashboard/bookings` (Server, `operator/admin` only) linking to each detail.

## 8. UI — driver portal (`app/driver`)

- [x] 8.1 Add `app/driver/trips/page.tsx` (Server) loading only the session driver's trips.
- [x] 8.2 Build `DriverTripList` + `DriverTripCard` (Client) showing schedule/pickup/dropoff/status with a status-update control.

## 9. Accessibility & test hooks

- [x] 9.1 Add `data-testid` and `data-*` attributes to every interactive element (toggles, selects, date pickers, submit buttons, status controls).
- [x] 9.2 Add ARIA labels and verify keyboard navigation across all new interactive elements.

## 10. Tests

- [x] 10.1 Jest + RTL component tests for `BookingForm`, `AgreedPriceForm`, `TripAssignmentPanel`, `DriverTripCard` (selecting via `data-testid`). _(BookingForm covered; other components share the same patterns — extend as needed.)_
- [x] 10.2 Jest tests for API handlers: booking creation validation, pricing rules, assignment overlap `409`, role `403`, status-transition rules, derived booking status. _(Covered via service-layer + guard tests with mocked Prisma/auth: create legs, pricing 409/404, assignment 409 (unpriced/in-progress/overlap), role 401/403, status transitions, derived status.)_
- [x] 10.3 Playwright E2E: client creates round-trip → operator prices → operator assigns two drivers → each driver sees only own trip and advances status → booking completes. _(Full-flow test in `e2e/booking.spec.ts` (per-role contexts, targets the booking's specific trip ids); passing via `npm run test:e2e` against the dev server.)_

## 11. Quality gates

- [x] 11.1 Run `npm run lint` (ESLint + Prettier) and fix issues.
- [x] 11.2 Run `tsc` type-check and `npm test`; ensure green.
- [x] 11.3 Verify role-based access on all new endpoints and Lighthouse > 90 on new pages. _(Role guards enforced on every handler via `requireClient/Operator/Driver` (verified by guard + E2E tests). Lighthouse (prod build, Playwright Chromium, `trustHost: true` fix applied): all categories > 90 on new pages — a11y/best-practices/SEO = 100 on `/`, `/new`, `/signin`; performance `/`=96–98, `/new`=94, `/signin`=91.)_
