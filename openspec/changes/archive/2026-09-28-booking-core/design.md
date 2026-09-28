## Context

lbt-ai-assisted is a greenfield Next.js (App Router) + TypeScript monolith with
PostgreSQL via Prisma and NextAuth for role-aware auth. This is the first change
and establishes the booking core: clients create reservations, operators price
them offline and assign drivers, and drivers view/track their trips.

The exploration settled the model: a **Booking** is the commercial agreement
(customer + single `agreedPrice` + type) and owns one or more **Trips** (the
operational legs). One-way → 1 Trip; round-trip → 2 Trips, each with its own
schedule and potentially a different driver/vehicle. There is no Quote entity —
pricing is negotiated offline and recorded by the operator. Assignment is manual.

## Goals / Non-Goals

**Goals:**
- Persist Booking → Trip[] with correct roles and lifecycle.
- Client-initiated booking creation (date, one-way/round-trip, origin,
  destination per leg) in America/New_York.
- Operator sets a single `agreedPrice` per Booking (offline pricing).
- Operator manually assigns driver + vehicle per Trip, with overlap checks.
- Driver portal: list/track only own assigned trips and update trip status.
- Enforce role-based access on every Route Handler.

**Non-Goals:**
- No pricing/quote engine, no payments, no automatic assignment.
- No real-time GPS/map tracking (status + details only).
- No driver/vehicle admin CRUD (assumed seeded/managed separately).
- No cancellation flow — deferred to a later change.
- No explicit "client accepts price" step — `PRICED` is sufficient to begin
  assignment.

## Decisions

### D1: Booking owns Trips (two entities) instead of a single flat booking
A Booking holds commercial data; each Trip is an independently schedulable,
assignable unit. Chosen over a single row with a `isRoundTrip` flag because
round-trip legs can have distinct date/times and **different drivers/vehicles**,
which a flat model handles poorly.
- **Alternative considered**: single Booking row with `returnAt` + second driver
  columns — rejected as it does not generalize and duplicates trip fields.

### D2: No Quote entity; `agreedPrice` lives on Booking
Pricing is negotiated offline. A nullable `agreedPrice` on Booking, set by the
operator, avoids an unused quote lifecycle. Booking moves `REQUESTED → PRICED`
when priced.
- **Alternative considered**: a persisted Quote with expiry — rejected; pricing is
  manual and single, so it adds complexity with no benefit now.

### D3: Booking status is derived from Trip statuses
Trip is the source of truth for operational progress; Booking status is computed
(all Trips `COMPLETED` → Booking `COMPLETED`; any `IN_PROGRESS` → Booking
`IN_PROGRESS`). Keeps the two levels consistent without manual dual updates.

### D4: Data model (Prisma)

```prisma
enum TripType { ONE_WAY ROUND_TRIP }
enum TripKind { OUTBOUND RETURN }
// CANCELLED intentionally omitted — cancellation is a later change.
enum BookingStatus { REQUESTED PRICED PARTIALLY_ASSIGNED ASSIGNED IN_PROGRESS COMPLETED }
enum TripStatus { PENDING ASSIGNED IN_PROGRESS COMPLETED }

model Booking {
  id          String        @id @default(cuid())
  customer    Customer      @relation(fields: [customerId], references: [id])
  customerId  String
  tripType    TripType
  agreedPrice Decimal?      @db.Decimal(10, 2)
  status      BookingStatus @default(REQUESTED)
  trips       Trip[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Trip {
  id            String     @id @default(cuid())
  booking       Booking    @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  bookingId     String
  kind          TripKind
  origin        Location   @relation("TripOrigin", fields: [originId], references: [id])
  originId      String
  destination   Location   @relation("TripDestination", fields: [destinationId], references: [id])
  destinationId String
  scheduledAt   DateTime               // stored UTC; presented in America/New_York
  driver        Driver?    @relation(fields: [driverId], references: [id])
  driverId      String?
  vehicle       Vehicle?   @relation(fields: [vehicleId], references: [id])
  vehicleId     String?
  status        TripStatus @default(PENDING)

  @@index([driverId, scheduledAt])
  @@index([vehicleId, scheduledAt])
}
```

This change **introduces `Location`** (NYC-centric: airports JFK/LGA/EWR and
boroughs) with seed data; `Customer`, `Driver`, and `Vehicle` are assumed to
exist (or are added minimally). Overlap checks use the
`driverId/vehicleId + scheduledAt` indexes.

### D5: API contracts (Route Handlers under `app/api/`)

```ts
// POST /api/bookings  (role: client)
interface CreateBookingBody {
  tripType: "ONE_WAY" | "ROUND_TRIP";
  originId: string;
  destinationId: string;
  outboundAt: string;   // ISO, America/New_York
  returnAt?: string;    // required when ROUND_TRIP, must be after outboundAt
}

// PATCH /api/bookings/{id}/price  (role: operator/admin)
interface SetAgreedPriceBody { agreedPrice: number } // > 0

// PATCH /api/trips/{id}/assign  (role: operator/admin)
interface AssignTripBody { driverId: string; vehicleId: string }

// GET /api/driver/trips           (role: driver — own only)
// PATCH /api/driver/trips/{id}/status (role: driver — own only)
interface UpdateTripStatusBody { status: "IN_PROGRESS" | "COMPLETED" }
```

All handlers resolve the session via NextAuth, authorize by role, and scope
queries to the caller (client → own bookings; driver → own trips).

### D6: Component hierarchy (Atomic-ish, Server-first)

```
app/(booking)/new/page.tsx              [Server] load locations
  └─ BookingForm                        [Client] "use client" — form + submit
       ├─ TripTypeToggle                [Client]
       ├─ LocationSelect (x2)           [Client]
       └─ DateTimePicker (x1..2)        [Client]

app/(dashboard)/dashboard/bookings/page.tsx        [Server] list all bookings (operator)
app/(dashboard)/dashboard/bookings/[id]/page.tsx   [Server] load booking + trips
  ├─ AgreedPriceForm                    [Client] operator sets price
  └─ TripAssignmentPanel                [Client] per-trip driver/vehicle select

app/driver/trips/page.tsx               [Server] load own trips (session-scoped)
  └─ DriverTripList                     [Server]
       └─ DriverTripCard                [Client] status update control
```

Server Components fetch via Prisma; Client Components handle interactivity and
call Route Handlers.

### D7: Accessibility & test hooks
Every interactive element (`TripTypeToggle`, `LocationSelect`, `DateTimePicker`,
`AgreedPriceForm` submit, `TripAssignmentPanel` selects/submit, `DriverTripCard`
status control) exposes a `data-testid`, an ARIA label, and full keyboard
support. No CSS-only selectors in tests.

## Risks / Trade-offs

- **Overlap/availability race conditions** → enforce assignment inside a DB
  transaction and re-check overlap before commit; rely on the composite indexes.
- **Time zone bugs (America/New_York vs UTC)** → store `scheduledAt` in UTC,
  convert at the edges only; centralize conversion in a `lib/datetime` helper.
- **Derived Booking status drift** → compute Booking status from Trips in a single
  server helper invoked after every Trip transition; never set it ad hoc.
- **Decimal money handling** → use Prisma `Decimal` (not float) for `agreedPrice`.
- **Round-trip validation** → validate `returnAt > outboundAt` at the API boundary
  and in the form.

## Migration Plan

1. Add Prisma models/enums (Booking, Trip, and **Location**; ensure
   Customer/Driver/Vehicle exist minimally) and run `npx prisma migrate dev`.
2. Seed NYC `Location` data (airports JFK/LGA/EWR and sample boroughs).
3. Ship Route Handlers behind role checks.
4. Add UI routes/components.
5. Rollback: revert the migration (drop Booking/Trip/Location tables/enums) and
   remove the new routes; no external systems affected.

## Resolved Decisions

- **`Location` is introduced by this change**, including seed data for NYC
  airports (JFK/LGA/EWR) and sample boroughs.
- **Cancellation is out of scope** — the `CANCELLED` status and its flow are
  deferred to a later change.
- **No explicit "client accepts price" step** — reaching `PRICED` is sufficient to
  begin driver/vehicle assignment.
