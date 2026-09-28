import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Request a Booking",
  description:
    "Request a luxury chauffeured transfer in New York City — one-way or round-trip, airport, hourly, or point-to-point.",
  alternates: { canonical: "/new" },
};

export default async function NewBookingPage() {
  const locations = await prisma.location.findMany({
    orderBy: [{ kind: "asc" }, { name: "asc" }],
    select: { id: true, name: true, code: true },
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Request a booking</h1>
      <p className="mb-8 text-sm text-gray-600">
        Tell us where and when. Our team will confirm the agreed price with you.
      </p>
      <BookingForm locations={locations} />
    </main>
  );
}
