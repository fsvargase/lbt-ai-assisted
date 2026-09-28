## ADDED Requirements

### Requirement: Operator manually assigns a driver and vehicle per trip
The system SHALL allow an authenticated `operator/admin` to manually assign a
driver and a vehicle to each Trip individually. Each Trip of a Booking MAY be
assigned a different driver and vehicle. Assignment SHALL only be permitted once
the Booking is in status `PRICED` (or later). A successful assignment SHALL move
the Trip from `PENDING` to `ASSIGNED`.

#### Scenario: Assign a driver and vehicle to a trip
- **WHEN** an operator submits a driver id and vehicle id for a `PENDING` Trip
  whose Booking is `PRICED`, via `PATCH /api/trips/{id}/assign`
- **THEN** the Trip stores the driver and vehicle and transitions to status
  `ASSIGNED`

#### Scenario: Assign different drivers to outbound and return trips
- **WHEN** an operator assigns driver A to the outbound Trip and driver B to the
  return Trip of the same round-trip Booking
- **THEN** both assignments succeed and each Trip references its own driver

#### Scenario: Reject assignment before the booking is priced
- **WHEN** an operator attempts to assign a driver to a Trip whose Booking is
  still in status `REQUESTED`
- **THEN** the handler responds `409` and the Trip remains `PENDING`

### Requirement: Assignment enforces driver and vehicle availability
The system SHALL prevent assigning a driver or a vehicle that is already assigned
to another Trip whose scheduled time overlaps the target Trip's scheduled time.

#### Scenario: Reject double-booking a driver at an overlapping time
- **WHEN** an operator attempts to assign a driver who is already assigned to
  another Trip that overlaps the target Trip's scheduled window
- **THEN** the handler responds `409` with a conflict error and the Trip is not
  assigned

#### Scenario: Reject double-booking a vehicle at an overlapping time
- **WHEN** an operator attempts to assign a vehicle already assigned to an
  overlapping Trip
- **THEN** the handler responds `409` with a conflict error and the Trip is not
  assigned

### Requirement: Only operators can assign trips
The system SHALL restrict trip assignment to users with the `operator/admin`
role.

#### Scenario: Client cannot assign a trip
- **WHEN** a user with the `client` role calls `PATCH /api/trips/{id}/assign`
- **THEN** the handler responds `403` and no assignment is made

#### Scenario: Driver cannot assign a trip
- **WHEN** a user with the `driver` role calls `PATCH /api/trips/{id}/assign`
- **THEN** the handler responds `403` and no assignment is made

### Requirement: Operator can reassign or unassign a trip
The system SHALL allow an operator to change or remove a Trip's driver/vehicle
assignment while the Trip has not yet started (`ASSIGNED` and not `IN_PROGRESS`).

#### Scenario: Reassign a trip to a different driver
- **WHEN** an operator assigns a new driver to a Trip currently in status
  `ASSIGNED`
- **THEN** the Trip references the new driver and remains `ASSIGNED`

#### Scenario: Reject reassignment of a trip in progress
- **WHEN** an operator attempts to reassign a Trip already in status
  `IN_PROGRESS`
- **THEN** the handler responds `409` and the existing assignment is unchanged
