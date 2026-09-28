import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { getSafeSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatInNY } from "@/lib/datetime";
import { AgreedPriceForm } from "@/components/dashboard/AgreedPriceForm";
import {
  TripAssignmentPanel,
  type AssignableTrip,
} from "@/components/dashboard/TripAssignmentPanel";

type Props = { params: Promise<{ id: string }> };

const OPERATOR_ROLES: Role[] = [Role.OPERATOR, Role.ADMIN];

export default async function OperatorBookingPage({ params }: Props) {
  const { id } = await params;
  const session = await getSafeSession();
  const role = session?.user?.role;

  if (!role || !OPERATOR_ROLES.includes(role)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="text-sm text-gray-600" data-testid="operator-forbidden">
          Operator access required.
        </p>
      </main>
    );
  }

  const [booking, drivers, vehicles] = await Promise.all([
    prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { include: { user: true } },
        trips: { include: { origin: true, destination: true }, orderBy: { kind: "asc" } },
      },
    }),
    prisma.driver.findMany({ include: { user: true } }),
    prisma.vehicle.findMany(),
  ]);

  if (!booking) notFound();

  const canAssign = booking.status !== "REQUESTED";

  const assignableTrips: AssignableTrip[] = booking.trips.map((t) => ({
    id: t.id,
    kind: t.kind,
    status: t.status,
    originName: t.origin.name,
    destinationName: t.destination.name,
    scheduledLabel: formatInNY(t.scheduledAt),
    driverId: t.driverId,
    vehicleId: t.vehicleId,
  }));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">
        Booking · {booking.customer.user.name ?? booking.customer.user.email}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Status: <span data-testid="operator-booking-status">{booking.status}</span>
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-medium">Agreed price</h2>
        <AgreedPriceForm
          bookingId={booking.id}
          currentPrice={booking.agreedPrice ? booking.agreedPrice.toString() : null}
          disabled={booking.status !== "REQUESTED"}
        />
        {booking.status !== "REQUESTED" && (
          <p className="mt-2 text-xs text-gray-500">
            Price is locked once the booking has been priced.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-medium">Assign drivers & vehicles</h2>
        {!canAssign && (
          <p className="mb-3 text-sm text-gray-600" data-testid="assignment-locked">
            Set the agreed price before assigning trips.
          </p>
        )}
        <TripAssignmentPanel
          trips={assignableTrips}
          drivers={drivers.map((d) => ({
            id: d.id,
            name: d.user.name ?? d.user.email,
          }))}
          vehicles={vehicles.map((v) => ({ id: v.id, label: v.label }))}
          canAssign={canAssign}
        />
      </section>
    </main>
  );
}
