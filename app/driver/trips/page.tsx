import { getSafeSession } from "@/lib/auth/session";
import { formatInNY } from "@/lib/datetime";
import { listTripsForDriver } from "@/lib/trips/service";
import { DriverTripList } from "@/components/driver/DriverTripList";

export default async function DriverTripsPage() {
  const session = await getSafeSession();
  const driverId = session?.user?.driverId;

  if (!driverId) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-semibold">My trips</h1>
        <p className="mt-4 text-sm text-gray-600" data-testid="driver-signin">
          Please sign in as a driver to view your assigned trips.
        </p>
      </main>
    );
  }

  const trips = await listTripsForDriver(driverId);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">My trips</h1>
      <DriverTripList
        trips={trips.map((t) => ({
          id: t.id,
          kind: t.kind,
          status: t.status,
          originName: t.origin.name,
          destinationName: t.destination.name,
          scheduledLabel: formatInNY(t.scheduledAt),
        }))}
      />
    </main>
  );
}
