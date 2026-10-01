import { BookingStatus } from "@prisma/client";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { createBooking, setAgreedPrice } from "@/lib/bookings/service";

const mockPrisma = prisma as unknown as {
  booking: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createBooking", () => {
  const base = {
    originId: "loc-a",
    destinationId: "loc-b",
    outboundAt: "2026-01-15T13:00:00.000Z",
    contactEmail: "rider@example.com",
    contactPhone: "+12125550123",
    recaptchaToken: "token-123",
  };

  it("creates a single trip for a one-way booking", async () => {
    mockPrisma.booking.create.mockResolvedValue({ id: "b1" });
    await createBooking("cust-1", { ...base, tripType: "ONE_WAY" });

    const arg = mockPrisma.booking.create.mock.calls[0][0];
    expect(arg.data.tripType).toBe("ONE_WAY");
    expect(arg.data.status).toBe(BookingStatus.REQUESTED);
    expect(arg.data.trips.create).toHaveLength(1);
    expect(arg.data.trips.create[0].kind).toBe("OUTBOUND");
  });

  it("creates outbound and return trips for a round-trip booking", async () => {
    mockPrisma.booking.create.mockResolvedValue({ id: "b2" });
    await createBooking("cust-1", {
      ...base,
      tripType: "ROUND_TRIP",
      returnAt: "2026-01-16T13:00:00.000Z",
    });

    const arg = mockPrisma.booking.create.mock.calls[0][0];
    expect(arg.data.trips.create).toHaveLength(2);
    expect(arg.data.trips.create[1].kind).toBe("RETURN");
    // Return leg reverses origin/destination.
    expect(arg.data.trips.create[1].origin.connect.id).toBe("loc-b");
    expect(arg.data.trips.create[1].destination.connect.id).toBe("loc-a");
  });
});

describe("setAgreedPrice", () => {
  it("prices a REQUESTED booking and transitions it to PRICED", async () => {
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: "b1",
      status: BookingStatus.REQUESTED,
    });
    mockPrisma.booking.update.mockResolvedValue({ id: "b1" });

    await setAgreedPrice("b1", 150);

    const arg = mockPrisma.booking.update.mock.calls[0][0];
    expect(arg.data.status).toBe(BookingStatus.PRICED);
    expect(arg.data.agreedPrice.toString()).toBe("150");
  });

  it("rejects pricing a booking that is not REQUESTED (409)", async () => {
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: "b1",
      status: BookingStatus.PRICED,
    });

    await expect(setAgreedPrice("b1", 150)).rejects.toMatchObject({
      status: 409,
    });
    expect(mockPrisma.booking.update).not.toHaveBeenCalled();
  });

  it("rejects when the booking does not exist (404)", async () => {
    mockPrisma.booking.findUnique.mockResolvedValue(null);
    await expect(setAgreedPrice("missing", 150)).rejects.toMatchObject({
      status: 404,
    });
  });
});
