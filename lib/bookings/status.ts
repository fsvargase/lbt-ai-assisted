import { BookingStatus, TripStatus } from "@prisma/client";

/**
 * Derive the Booking status from the aggregate status of its trips.
 * Booking-core rules (cancellation out of scope):
 * - all trips COMPLETED            -> COMPLETED
 * - any trip IN_PROGRESS           -> IN_PROGRESS
 * - all trips ASSIGNED (or better) -> ASSIGNED
 * - some assigned, some pending    -> PARTIALLY_ASSIGNED
 * - none assigned                  -> keep the pre-assignment status (fallback)
 */
export function deriveBookingStatus(
  tripStatuses: TripStatus[],
  fallback: BookingStatus,
): BookingStatus {
  if (tripStatuses.length === 0) return fallback;

  const all = (s: TripStatus) => tripStatuses.every((t) => t === s);
  const some = (s: TripStatus) => tripStatuses.some((t) => t === s);

  if (all(TripStatus.COMPLETED)) return BookingStatus.COMPLETED;
  if (some(TripStatus.IN_PROGRESS) || some(TripStatus.COMPLETED)) {
    return BookingStatus.IN_PROGRESS;
  }

  const assignedCount = tripStatuses.filter(
    (t) => t === TripStatus.ASSIGNED,
  ).length;

  if (assignedCount === tripStatuses.length) return BookingStatus.ASSIGNED;
  if (assignedCount > 0) return BookingStatus.PARTIALLY_ASSIGNED;

  return fallback;
}
