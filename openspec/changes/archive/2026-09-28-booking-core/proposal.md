## Why

Booking is the core of lbt-ai-assisted, but the platform currently has no way to
capture a reservation, agree on a price, or assign a chauffeur. Clients need to
request premium NYC transport (one-way or round-trip), operators need to set the
agreed price and manually assign a driver + vehicle per trip, and drivers need to
see their assigned trips. This change establishes that end-to-end booking core.

## What Changes

- Introduce a **client-initiated booking flow**: the client creates a reservation
  indicating the **service date**, **trip type** (one-way / round-trip), and the
  **origin and destination** for each leg.
- Model each reservation as a **Booking** (commercial agreement) that owns one or
  more **Trips** (operational legs):
  - One-way → 1 Trip; round-trip → 2 Trips.
  - Each Trip has its **own date/time** and can be assigned a **different driver**
    and vehicle.
- **No Quote entity**: the operator quotes **offline** (phone/email) and records a
  single **`agreedPrice` for the whole booking**. Price is not computed by the
  system.
- Add an **operator manual assignment** action: assign a driver + vehicle to each
  Trip individually.
- Add a **driver trip view**: drivers see and track **only their own** assigned
  trips (schedule, pickup/dropoff, status).
- Add an **operator dashboard list** at `/dashboard/bookings` that shows all
  bookings (operator/admin only), each linking to its detail for pricing and
  assignment.
- Define the **Booking ↔ Trip status coordination** (booking status derives from
  its trips' statuses).

## Capabilities

### New Capabilities
- `booking-management`: client-created bookings with one or more trip legs,
  operator-set `agreedPrice`, and the Booking/Trip status lifecycle and
  coordination rules.
- `trip-assignment`: operator manually assigns a driver and vehicle to each trip,
  enforcing availability and role-based access.
- `driver-trip-view`: driver portal capability to list and track a driver's own
  assigned trips and update trip status.

### Modified Capabilities
<!-- None — this is the first change; no existing specs to modify. -->

## Impact

- **Routes (UI)**: `app/(booking)` (client create/list), `app/(dashboard)`
  (operator bookings list at `/dashboard/bookings` + detail at
  `/dashboard/bookings/{id}` for pricing + assignment), `app/driver` (driver trip
  view).
- **API (Route Handlers)**: `app/api/bookings/**` (create/list/price),
  `app/api/trips/**` (assign/status), `app/api/driver/trips/**` (driver's trips).
- **Prisma models/migrations**: new `Booking`, `Trip`, and **new `Location`**
  (NYC airports/boroughs, with seed data), plus relations to `Customer`,
  `Driver`, `Vehicle`; new enums for `TripType` and booking/trip status. Initial
  migration required.
- **Auth / roles (NextAuth)**: enforce `client`, `operator/admin`, and `driver`
  access; drivers restricted to their own trips.
- **NYC domain**: locations reference NYC geography (airports JFK/LGA/EWR,
  boroughs); all trip date/times handled in **America/New_York**.

## Non-goals

- No automated pricing/quote engine — pricing stays **offline/manual**.
- No online payment capture or pre-authorization in this change.
- No automatic driver assignment or availability optimization — assignment is
  **manual**.
- No real-time GPS live tracking/maps — the driver view shows trip status and
  details, not a live map.
- No vehicle/driver CRUD management screens (assumed to exist or seeded
  separately).
- **No cancellation flow** — the `CANCELLED` status and cancellation behavior are
  deferred to a later change.
- No explicit "client accepts price" step — reaching `PRICED` is enough to begin
  assignment.
