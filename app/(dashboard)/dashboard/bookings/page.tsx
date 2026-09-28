import Link from "next/link";
import { Role } from "@prisma/client";
import { getSafeSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatInNY } from "@/lib/datetime";

const OPERATOR_ROLES: Role[] = [Role.OPERATOR, Role.ADMIN];

export default async function OperatorBookingsPage() {
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

  const bookings = await prisma.booking.findMany({
    include: {
      customer: { include: { user: true } },
      trips: { include: { origin: true, destination: true }, orderBy: { kind: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Reservations</h1>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-600" data-testid="operator-bookings-empty">
          There are no bookings yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3" data-testid="operator-bookings-list">
          {bookings.map((b) => (
            <li key={b.id}>
              <Link
                href={`/dashboard/bookings/${b.id}`}
                data-testid={`operator-booking-row-${b.id}`}
                className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {b.customer.user.name ?? b.customer.user.email}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {b.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {b.tripType === "ROUND_TRIP" ? "Round-trip" : "One-way"} ·{" "}
                  {b.trips[0]?.origin.name} → {b.trips[0]?.destination.name} ·{" "}
                  {b.trips[0] ? formatInNY(b.trips[0].scheduledAt) : ""}
                </p>
                <p className="mt-1 text-sm text-gray-800">
                  {b.agreedPrice ? `$${b.agreedPrice.toString()}` : "Awaiting price"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
