import { BookingStatus, TripStatus } from "@prisma/client";
import { deriveBookingStatus } from "@/lib/bookings/status";

describe("deriveBookingStatus", () => {
  it("returns COMPLETED when all trips are completed", () => {
    expect(
      deriveBookingStatus(
        [TripStatus.COMPLETED, TripStatus.COMPLETED],
        BookingStatus.IN_PROGRESS,
      ),
    ).toBe(BookingStatus.COMPLETED);
  });

  it("returns IN_PROGRESS when at least one trip is in progress", () => {
    expect(
      deriveBookingStatus(
        [TripStatus.IN_PROGRESS, TripStatus.ASSIGNED],
        BookingStatus.ASSIGNED,
      ),
    ).toBe(BookingStatus.IN_PROGRESS);
  });

  it("returns ASSIGNED when all trips are assigned", () => {
    expect(
      deriveBookingStatus(
        [TripStatus.ASSIGNED, TripStatus.ASSIGNED],
        BookingStatus.PRICED,
      ),
    ).toBe(BookingStatus.ASSIGNED);
  });

  it("returns PARTIALLY_ASSIGNED when some trips are assigned", () => {
    expect(
      deriveBookingStatus(
        [TripStatus.ASSIGNED, TripStatus.PENDING],
        BookingStatus.PRICED,
      ),
    ).toBe(BookingStatus.PARTIALLY_ASSIGNED);
  });

  it("falls back when no trips are assigned", () => {
    expect(
      deriveBookingStatus([TripStatus.PENDING], BookingStatus.PRICED),
    ).toBe(BookingStatus.PRICED);
  });

  it("returns the fallback for an empty trip list", () => {
    expect(deriveBookingStatus([], BookingStatus.REQUESTED)).toBe(
      BookingStatus.REQUESTED,
    );
  });
});
