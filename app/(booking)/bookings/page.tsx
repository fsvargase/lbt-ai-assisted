import Link from "next/link";
import { getSafeSession } from "@/lib/auth/session";
import { formatInNY } from "@/lib/datetime";
import { listBookingsForCustomer } from "@/lib/bookings/service";

export default async function BookingsPage() {
  const session = await getSafeSession();
  const customerId = session?.user?.customerId;

  if (!customerId) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Your bookings</h1>
        <p className="mt-4 text-sm text-gray-600" data-testid="bookings-signin">
          Please sign in as a client to view your bookings.
        </p>
      </main>
    );
  }

  const bookings = await listBookingsForCustomer(customerId);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your bookings</h1>
        <Link
          href="/new"
          data-testid="new-booking-link"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          New booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-600" data-testid="bookings-empty">
          You have no bookings yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3" data-testid="bookings-list">
          {bookings.map((b) => (
            <li key={b.id}>
              <Link
                href={`/bookings/${b.id}`}
                data-testid={`booking-row-${b.id}`}
                className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {b.tripType === "ROUND_TRIP" ? "Round-trip" : "One-way"}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {b.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
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
