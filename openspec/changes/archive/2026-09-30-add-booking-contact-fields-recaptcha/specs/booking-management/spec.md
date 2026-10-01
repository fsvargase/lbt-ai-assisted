## ADDED Requirements

### Requirement: Booking carries its own contact email and phone
The system SHALL store a `contactEmail` and a `contactPhone` on each `Booking`,
independent of the owning `Customer` profile, so that the actual rider for a
booking can be reached even when the booking is placed by a guest, by a
registered client who does not want to reuse their profile data, or by an
operator/admin on behalf of an unregistered caller. `contactPhone` SHALL be
stored normalized as a US/E.164 value (e.g. `+12125550123`). Both fields SHALL be
required when creating a booking.

#### Scenario: Booking is created with contact email and normalized phone
- **WHEN** a client submits the booking form at `app/(booking)` with a valid
  `contactEmail` and a valid US `contactPhone`
- **THEN** the `POST /api/bookings` handler creates the Booking storing the
  `contactEmail` and the `contactPhone` normalized to US/E.164 format
- **AND** the stored phone value begins with `+1` followed by 10 digits

#### Scenario: Reject a booking with a missing or invalid contact email
- **WHEN** a client submits a booking whose `contactEmail` is missing or not a
  valid email address
- **THEN** the `POST /api/bookings` handler responds `400` with a validation
  error and does not create a Booking

#### Scenario: Reject a booking with an invalid US contact phone
- **WHEN** a client submits a booking whose `contactPhone` is missing or is not a
  valid US phone number
- **THEN** the `POST /api/bookings` handler responds `400` with a validation
  error and does not create a Booking

#### Scenario: Booking form shows inline accessible contact errors
- **WHEN** a user submits the booking form with an empty or invalid contact email
  or phone
- **THEN** the form displays an inline, accessible error message associated with
  the offending field and does not submit the request
- **AND** each contact input and its error node exposes a stable `data-testid`

### Requirement: Guest can create a booking without authentication
The system SHALL allow `POST /api/bookings` to create a Booking without an
authenticated session (a guest booking), identified solely by its
`contactEmail` and `contactPhone`. A guest Booking SHALL NOT require an
associated `Customer`; the `customer` relation SHALL be optional. When a `client`
session is present, the Booking SHALL be linked to that client's `Customer`. All
booking submissions (guest or client) SHALL still pass validation and reCAPTCHA
verification before any Booking is created.

#### Scenario: Guest creates a booking with no session
- **WHEN** an unauthenticated visitor submits the booking form with valid trip
  details, a valid `contactEmail`, a valid `contactPhone`, and a valid reCAPTCHA
  token
- **THEN** the `POST /api/bookings` handler creates a Booking in status
  `REQUESTED` with no associated `Customer` and stores the contact fields
- **AND** the handler responds `201` with the created Booking

#### Scenario: Authenticated client booking is linked to their customer
- **WHEN** an authenticated `client` submits a valid booking
- **THEN** the created Booking is linked to that client's `Customer`
- **AND** the contact fields are stored on the Booking regardless of the client's
  profile data

#### Scenario: Guest booking still enforces validation and reCAPTCHA
- **WHEN** a guest submits a booking with invalid contact fields or a
  missing/invalid/low-score reCAPTCHA token
- **THEN** the handler responds `400` and no Booking is created
