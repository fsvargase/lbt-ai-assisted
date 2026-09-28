# booking-management

## Purpose

Client-created bookings composed of one or more trip legs, operator-set
`agreedPrice` (negotiated offline; no system-computed quote), the Booking/Trip
status lifecycle and its derived-status coordination, and the role-scoped views
for clients and operators.

## Requirements

### Requirement: Client creates a booking with trip legs
The system SHALL allow an authenticated `client` to create a Booking by
specifying the service date, the trip type (one-way or round-trip), and the
origin and destination for each leg. A one-way booking SHALL create exactly one
Trip; a round-trip booking SHALL create exactly two Trips (outbound and return),
each with its own scheduled date/time. All trip date/times SHALL be handled in
the America/New_York time zone.

#### Scenario: Create a one-way booking
- **WHEN** a client submits the booking form at `app/(booking)` with trip type
  one-way, an origin, a destination, and a service date/time
- **THEN** the `POST /api/bookings` handler creates a Booking in status
  `REQUESTED` with exactly one Trip in status `PENDING`
- **AND** the response returns the created Booking id and its Trip

#### Scenario: Create a round-trip booking with distinct return date/time
- **WHEN** a client submits a booking with trip type round-trip, providing an
  origin, a destination, an outbound date/time, and a return date/time that
  differs from the outbound
- **THEN** the system creates one Booking with two Trips: an outbound
  (origin → destination) and a return (destination → origin), each storing its
  own scheduled date/time

#### Scenario: Reject a booking with missing required fields
- **WHEN** a client submits a booking without an origin, destination, or service
  date
- **THEN** the `POST /api/bookings` handler responds `400` with a validation
  error and does not create a Booking

#### Scenario: Reject a round-trip return earlier than outbound
- **WHEN** a client submits a round-trip booking whose return date/time is before
  the outbound date/time
- **THEN** the system responds `400` with a validation error and does not create
  a Booking

### Requirement: Operator sets the agreed price for a booking
The system SHALL allow an authenticated `operator/admin` to record a single
`agreedPrice` for an entire Booking after quoting the client offline. There SHALL
be no system-computed quote. Setting the agreed price SHALL move the Booking from
`REQUESTED` to `PRICED`.

#### Scenario: Operator prices a requested booking
- **WHEN** an operator submits an `agreedPrice` for a Booking in status
  `REQUESTED` via `PATCH /api/bookings/{id}/price`
- **THEN** the Booking stores the `agreedPrice` and transitions to status
  `PRICED`

#### Scenario: Reject a non-positive agreed price
- **WHEN** an operator submits an `agreedPrice` that is zero or negative
- **THEN** the handler responds `400` and the Booking price and status are
  unchanged

#### Scenario: Client cannot set the agreed price
- **WHEN** a user with the `client` role calls `PATCH /api/bookings/{id}/price`
- **THEN** the handler responds `403` and no price is recorded

### Requirement: Booking status derives from its trips
The system SHALL derive the Booking status from the aggregated status of its
Trips: a Booking is `COMPLETED` only when all its Trips are `COMPLETED`, and
`IN_PROGRESS` when at least one Trip is `IN_PROGRESS` and not all are completed.

#### Scenario: Booking completes when all trips complete
- **WHEN** every Trip belonging to a Booking reaches status `COMPLETED`
- **THEN** the Booking status is `COMPLETED`

#### Scenario: Booking is in progress when any trip is in progress
- **WHEN** at least one Trip of a Booking is `IN_PROGRESS` and not all Trips are
  `COMPLETED`
- **THEN** the Booking status is `IN_PROGRESS`

### Requirement: Client views only their own bookings
The system SHALL allow a `client` to list and view only the Bookings they own,
and SHALL prevent access to other clients' bookings.

#### Scenario: Client lists own bookings
- **WHEN** a client requests `GET /api/bookings`
- **THEN** the response contains only Bookings whose customer is the requesting
  client

#### Scenario: Client cannot read another client's booking
- **WHEN** a client requests `GET /api/bookings/{id}` for a Booking owned by a
  different client
- **THEN** the handler responds `403` or `404` and returns no booking data

### Requirement: Operator lists all bookings
The system SHALL provide an operator dashboard at `/dashboard/bookings` that
lists every Booking (across all customers) for users with the `operator/admin`
role, each linking to its detail at `/dashboard/bookings/{id}`. Users without
the `operator/admin` role SHALL NOT be able to view this list.

#### Scenario: Operator sees all bookings
- **WHEN** an operator opens `/dashboard/bookings`
- **THEN** the page lists all Bookings with customer, trip summary, status, and
  agreed price, each linking to `/dashboard/bookings/{id}`

#### Scenario: Non-operator cannot access the operator dashboard
- **WHEN** a user with the `client` or `driver` role opens `/dashboard/bookings`
- **THEN** the page shows an "Operator access required" message and no booking
  data
