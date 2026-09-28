## ADDED Requirements

### Requirement: Driver views only their own assigned trips
The system SHALL allow an authenticated `driver` to list and view only the Trips
assigned to them, showing schedule, pickup/dropoff locations, and current status.
The system SHALL prevent a driver from viewing Trips assigned to other drivers or
any client's private booking data.

#### Scenario: Driver lists own assigned trips
- **WHEN** a driver requests `GET /api/driver/trips` from the `app/driver` portal
- **THEN** the response contains only Trips whose assigned driver is the
  requesting driver, each including scheduled date/time, origin, destination, and
  status

#### Scenario: Driver cannot view another driver's trip
- **WHEN** a driver requests `GET /api/driver/trips/{id}` for a Trip assigned to a
  different driver
- **THEN** the handler responds `403` or `404` and returns no trip data

#### Scenario: Unassigned trips are not shown to drivers
- **WHEN** a driver lists their trips and a Trip is still in status `PENDING`
  (unassigned)
- **THEN** that Trip does not appear in the driver's list

### Requirement: Driver updates the status of their own trip
The system SHALL allow an assigned `driver` to advance the status of their own
Trip along the allowed transitions `ASSIGNED → IN_PROGRESS → COMPLETED`. Invalid
transitions SHALL be rejected.

#### Scenario: Driver starts an assigned trip
- **WHEN** an assigned driver marks their `ASSIGNED` Trip as started via
  `PATCH /api/driver/trips/{id}/status` with `IN_PROGRESS`
- **THEN** the Trip transitions to `IN_PROGRESS`

#### Scenario: Driver completes an in-progress trip
- **WHEN** an assigned driver marks their `IN_PROGRESS` Trip as `COMPLETED`
- **THEN** the Trip transitions to `COMPLETED`

#### Scenario: Reject an invalid status transition
- **WHEN** a driver attempts to mark a `PENDING` or `ASSIGNED` Trip directly as
  `COMPLETED`
- **THEN** the handler responds `409` and the Trip status is unchanged

#### Scenario: Driver cannot update a trip they are not assigned to
- **WHEN** a driver calls `PATCH /api/driver/trips/{id}/status` for a Trip
  assigned to another driver
- **THEN** the handler responds `403` and the Trip status is unchanged

### Requirement: Driver trip view is accessible
The driver trip list and detail views SHALL meet accessibility requirements: all
interactive elements SHALL expose a `data-testid` attribute, provide ARIA labels,
and support keyboard navigation.

#### Scenario: Interactive elements expose test ids and ARIA labels
- **WHEN** the driver trip list renders in `app/driver`
- **THEN** each interactive element (e.g., status update control, trip row) has a
  `data-testid` attribute and an accessible ARIA label, and is reachable via
  keyboard
