import { DriverTripCard, type DriverTrip } from "./DriverTripCard";

export function DriverTripList({ trips }: { trips: DriverTrip[] }) {
  if (trips.length === 0) {
    return (
      <p className="text-sm text-gray-600" data-testid="driver-trips-empty">
        You have no assigned trips.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3" data-testid="driver-trips-list">
      {trips.map((trip) => (
        <li key={trip.id}>
          <DriverTripCard trip={trip} />
        </li>
      ))}
    </ul>
  );
}
