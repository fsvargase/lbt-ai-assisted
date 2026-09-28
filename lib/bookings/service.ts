import {
  BookingStatus,
  Prisma,
  TripKind,
  TripStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, notFound } from "@/lib/api/errors";
import { deriveBookingStatus } from "@/lib/bookings/status";
import type { CreateBookingInput } from "@/lib/bookings/schemas";

const bookingInclude = {
  trips: { include: { origin: true, destination: true }, orderBy: { kind: "asc" } },
} satisfies Prisma.BookingInclude;

export async function createBooking(
  customerId: string,
  input: CreateBookingInput,
) {
  const outboundAt = new Date(input.outboundAt);

  const trips: Prisma.TripCreateWithoutBookingInput[] = [
    {
      kind: TripKind.OUTBOUND,
      origin: { connect: { id: input.originId } },
      destination: { connect: { id: input.destinationId } },
      scheduledAt: outboundAt,
      status: TripStatus.PENDING,
    },
  ];

  if (input.tripType === "ROUND_TRIP") {
    if (!input.returnAt) throw badRequest("returnAt is required for a round trip");
    trips.push({
      kind: TripKind.RETURN,
      origin: { connect: { id: input.destinationId } },
      destination: { connect: { id: input.originId } },
      scheduledAt: new Date(input.returnAt),
      status: TripStatus.PENDING,
    });
  }

  return prisma.booking.create({
    data: {
      customer: { connect: { id: customerId } },
      tripType: input.tripType,
      status: BookingStatus.REQUESTED,
      trips: { create: trips },
    },
    include: bookingInclude,
  });
}

export function listBookingsForCustomer(customerId: string) {
  return prisma.booking.findMany({
    where: { customerId },
    include: bookingInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingForCustomer(customerId: string, id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  });
  if (!booking || booking.customerId !== customerId) throw notFound("Booking not found");
  return booking;
}

export async function setAgreedPrice(bookingId: string, agreedPrice: number) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw notFound("Booking not found");
  if (booking.status !== BookingStatus.REQUESTED) {
    throw conflict("Only a REQUESTED booking can be priced");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      agreedPrice: new Prisma.Decimal(agreedPrice),
      status: BookingStatus.PRICED,
    },
    include: bookingInclude,
  });
}

/**
 * Recompute and persist the derived Booking status from its trips.
 * Runs inside the provided transaction client.
 */
export async function recomputeBookingStatus(
  tx: Prisma.TransactionClient,
  bookingId: string,
) {
  const booking = await tx.booking.findUnique({
    where: { id: bookingId },
    include: { trips: true },
  });
  if (!booking) return;

  const fallback = booking.agreedPrice
    ? BookingStatus.PRICED
    : BookingStatus.REQUESTED;
  const next = deriveBookingStatus(
    booking.trips.map((t) => t.status),
    fallback,
  );

  if (next !== booking.status) {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: next },
    });
  }
}
