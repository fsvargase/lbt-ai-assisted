import { BookingStatus, TripStatus } from "@prisma/client";

jest.mock("@/lib/prisma", () => {
  const client = {
    trip: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  // Run the transaction callback with the same mocked client.
  client.$transaction.mockImplementation((cb: (tx: unknown) => unknown) =>
    cb(client),
  );
  return { prisma: client };
});

import { prisma } from "@/lib/prisma";
import { assignTrip, updateTripStatusForDriver } from "@/lib/trips/service";

const m = prisma as unknown as {
  trip: { findUnique: jest.Mock; findMany: jest.Mock; update: jest.Mock };
  booking: { findUnique: jest.Mock; update: jest.Mock };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("assignTrip", () => {
  const input = { driverId: "drv-1", vehicleId: "veh-1" };

  function tripWith(bookingStatus: BookingStatus, tripStatus: TripStatus) {
    return {
      id: "t1",
      bookingId: "b1",
      status: tripStatus,
      scheduledAt: new Date("2026-01-15T13:00:00Z"),
      booking: { id: "b1", status: bookingStatus },
    };
  }

  it("assigns a driver and vehicle to a PENDING trip on a PRICED booking", async () => {
    m.trip.findUnique.mockResolvedValue(
      tripWith(BookingStatus.PRICED, TripStatus.PENDING),
    );
    m.trip.findMany.mockResolvedValue([]);
    m.trip.update.mockResolvedValue({ id: "t1" });
    m.booking.findUnique.mockResolvedValue({
      id: "b1",
      agreedPrice: 150,
      status: BookingStatus.PRICED,
      trips: [{ status: TripStatus.ASSIGNED }],
    });
    m.booking.update.mockResolvedValue({});

    await assignTrip("t1", input);

    const arg = m.trip.update.mock.calls[0][0];
    expect(arg.data.status).toBe(TripStatus.ASSIGNED);
    expect(arg.data.driverId).toBe("drv-1");
  });

  it("rejects assignment before the booking is priced (409)", async () => {
    m.trip.findUnique.mockResolvedValue(
      tripWith(BookingStatus.REQUESTED, TripStatus.PENDING),
    );
    await expect(assignTrip("t1", input)).rejects.toMatchObject({ status: 409 });
    expect(m.trip.update).not.toHaveBeenCalled();
  });

  it("rejects reassigning a trip already in progress (409)", async () => {
    m.trip.findUnique.mockResolvedValue(
      tripWith(BookingStatus.IN_PROGRESS, TripStatus.IN_PROGRESS),
    );
    await expect(assignTrip("t1", input)).rejects.toMatchObject({ status: 409 });
  });

  it("rejects an overlapping driver assignment (409)", async () => {
    m.trip.findUnique.mockResolvedValue(
      tripWith(BookingStatus.PRICED, TripStatus.PENDING),
    );
    m.trip.findMany.mockResolvedValue([
      {
        driverId: "drv-1",
        vehicleId: "veh-9",
        scheduledAt: new Date("2026-01-15T13:30:00Z"),
      },
    ]);
    await expect(assignTrip("t1", input)).rejects.toMatchObject({ status: 409 });
    expect(m.trip.update).not.toHaveBeenCalled();
  });
});

describe("updateTripStatusForDriver", () => {
  it("advances an ASSIGNED trip to IN_PROGRESS for its own driver", async () => {
    m.trip.findUnique.mockResolvedValue({
      id: "t1",
      bookingId: "b1",
      driverId: "drv-1",
      status: TripStatus.ASSIGNED,
    });
    m.trip.update.mockResolvedValue({ id: "t1" });
    m.booking.findUnique.mockResolvedValue({
      id: "b1",
      agreedPrice: 150,
      status: BookingStatus.ASSIGNED,
      trips: [{ status: TripStatus.IN_PROGRESS }],
    });
    m.booking.update.mockResolvedValue({});

    await updateTripStatusForDriver("drv-1", "t1", TripStatus.IN_PROGRESS);
    expect(m.trip.update.mock.calls[0][0].data.status).toBe(
      TripStatus.IN_PROGRESS,
    );
  });

  it("rejects an invalid transition (409)", async () => {
    m.trip.findUnique.mockResolvedValue({
      id: "t1",
      bookingId: "b1",
      driverId: "drv-1",
      status: TripStatus.ASSIGNED,
    });
    await expect(
      updateTripStatusForDriver("drv-1", "t1", TripStatus.COMPLETED),
    ).rejects.toMatchObject({ status: 409 });
  });

  it("rejects updating a trip the driver is not assigned to (404)", async () => {
    m.trip.findUnique.mockResolvedValue({
      id: "t1",
      bookingId: "b1",
      driverId: "other-driver",
      status: TripStatus.ASSIGNED,
    });
    await expect(
      updateTripStatusForDriver("drv-1", "t1", TripStatus.IN_PROGRESS),
    ).rejects.toMatchObject({ status: 404 });
  });
});
