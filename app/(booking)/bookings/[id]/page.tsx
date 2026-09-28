import { notFound } from "next/navigation";
import { getSafeSession } from "@/lib/auth/session";
import { formatInNY } from "@/lib/datetime";
import { getBookingForCustomer } from "@/lib/bookings/service";

type Props = { params: Promise<{ id: string }> };

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSafeSession();
  const customerId = session?.user?.customerId;

  if (!customerId) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <p className="text-sm text-gray-600" data-testid="booking-signin">
          Please sign in as a client to view this booking.
        </p>
      </main>
    );
  }

  const booking = await getBookingForCustomer(customerId, id).catch(() => null);
  if (!booking) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold" data-testid="booking-detail-heading">
        Booking · {booking.tripType === "ROUND_TRIP" ? "Round-trip" : "One-way"}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Status: <span data-testid="booking-status">{booking.status}</span>
      </p>
      <p className="mt-1 text-lg font-medium" data-testid="booking-price">
        {booking.agreedPrice
          ? `$${booking.agreedPrice.toString()}`
          : "Awaiting agreed price"}
      </p>

      <ul className="mt-6 flex flex-col gap-4" data-testid="booking-trips">
        {booking.trips.map((t) => (
          <li
            key={t.id}
            data-testid={`trip-${t.id}`}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {t.kind === "OUTBOUND" ? "Outbound" : "Return"}
              </span>
              <span className="text-xs uppercase tracking-wide text-gray-500">
                {t.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {t.origin.name} → {t.destination.name}
            </p>
            <p className="mt-1 text-sm text-gray-600">{formatInNY(t.scheduledAt)}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
