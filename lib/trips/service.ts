import { BookingStatus, Prisma, TripStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { conflict, notFound } from "@/lib/api/errors";
import { isWithinBuffer } from "@/lib/datetime";
import { recomputeBookingStatus } from "@/lib/bookings/service";
import type { AssignTripInput } from "@/lib/trips/schemas";

const tripInclude = {
  origin: true,
  destination: true,
  driver: { include: { user: true } },
  vehicle: true,
  booking: true,
} satisfies Prisma.TripInclude;

/** Statuses at or beyond which a booking may have its trips assigned. */
const ASSIGNABLE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.PRICED,
  BookingStatus.PARTIALLY_ASSIGNED,
  BookingStatus.ASSIGNED,
  BookingStatus.IN_PROGRESS,
];

export async function assignTrip(tripId: string, input: AssignTripInput) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: { booking: true },
    });
    if (!trip) throw notFound("Trip not found");

    if (!ASSIGNABLE_BOOKING_STATUSES.includes(trip.booking.status)) {
      throw conflict("Booking must be priced before assigning trips");
    }
    if (
      trip.status === TripStatus.IN_PROGRESS ||
      trip.status === TripStatus.COMPLETED
    ) {
      throw conflict("Cannot reassign a trip that has already started");
    }

    await ensureNoOverlap(tx, {
      tripId,
      driverId: input.driverId,
      vehicleId: input.vehicleId,
      scheduledAt: trip.scheduledAt,
    });

    const updated = await tx.trip.update({
      where: { id: tripId },
      data: {
        driverId: input.driverId,
        vehicleId: input.vehicleId,
        status: TripStatus.ASSIGNED,
      },
    });

    await recomputeBookingStatus(tx, trip.bookingId);
    return updated;
  });
}

async function ensureNoOverlap(
  tx: Prisma.TransactionClient,
  args: {
    tripId: string;
    driverId: string;
    vehicleId: string;
    scheduledAt: Date;
  },
) {
  const candidates = await tx.trip.findMany({
    where: {
      id: { not: args.tripId },
      status: { in: [TripStatus.ASSIGNED, TripStatus.IN_PROGRESS] },
      OR: [{ driverId: args.driverId }, { vehicleId: args.vehicleId }],
    },
    select: { driverId: true, vehicleId: true, scheduledAt: true },
  });

  for (const c of candidates) {
    if (!isWithinBuffer(c.scheduledAt, args.scheduledAt)) continue;
    if (c.driverId === args.driverId) {
      throw conflict("Driver is already assigned to an overlapping trip");
    }
    if (c.vehicleId === args.vehicleId) {
      throw conflict("Vehicle is already assigned to an overlapping trip");
    }
  }
}

const VALID_STATUS_TRANSITIONS: Record<string, TripStatus[]> = {
  [TripStatus.ASSIGNED]: [TripStatus.IN_PROGRESS],
  [TripStatus.IN_PROGRESS]: [TripStatus.COMPLETED],
};

export async function updateTripStatusForDriver(
  driverId: string,
  tripId: string,
  next: TripStatus,
) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.driverId !== driverId) throw notFound("Trip not found");

    const allowed = VALID_STATUS_TRANSITIONS[trip.status] ?? [];
    if (!allowed.includes(next)) {
      throw conflict(`Cannot transition trip from ${trip.status} to ${next}`);
    }

    const updated = await tx.trip.update({
      where: { id: tripId },
      data: { status: next },
    });

    await recomputeBookingStatus(tx, trip.bookingId);
    return updated;
  });
}

export function listTripsForDriver(driverId: string) {
  return prisma.trip.findMany({
    where: {
      driverId,
      status: { in: [TripStatus.ASSIGNED, TripStatus.IN_PROGRESS, TripStatus.COMPLETED] },
    },
    include: tripInclude,
    orderBy: { scheduledAt: "asc" },
  });
}

export async function getTripForDriver(driverId: string, tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: tripInclude,
  });
  if (!trip || trip.driverId !== driverId) throw notFound("Trip not found");
  return trip;
}
