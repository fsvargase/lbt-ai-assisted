/**
 * @jest-environment node
 */
import { NextResponse } from "next/server";

jest.mock("@/lib/recaptcha", () => ({ verifyRecaptcha: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({ getSafeSession: jest.fn() }));
jest.mock("@/lib/auth/guard", () => ({ requireClient: jest.fn() }));
jest.mock("@/lib/bookings/service", () => ({
  createBooking: jest.fn(),
  listBookingsForCustomer: jest.fn(),
}));

import { POST } from "@/app/api/bookings/route";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { getSafeSession } from "@/lib/auth/session";
import { createBooking } from "@/lib/bookings/service";

const mockVerify = verifyRecaptcha as jest.Mock;
const mockSession = getSafeSession as jest.Mock;
const mockCreate = createBooking as jest.Mock;

const validBody = {
  tripType: "ONE_WAY",
  originId: "loc-a",
  destinationId: "loc-b",
  outboundAt: "2026-01-15T13:00:00.000Z",
  contactEmail: "rider@example.com",
  contactPhone: "(212) 555-0123",
  recaptchaToken: "token-123",
};

function req(body: unknown) {
  return { json: async () => body } as unknown as Parameters<typeof POST>[0];
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/bookings", () => {
  it("rejects a missing reCAPTCHA token with 400 and no creation", async () => {
    mockVerify.mockResolvedValue(false);
    mockSession.mockResolvedValue(null);
    const res = (await POST(req({ ...validBody, recaptchaToken: "" }))) as NextResponse;
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("rejects an invalid/low-score token with 400 and no creation", async () => {
    mockVerify.mockResolvedValue(false);
    mockSession.mockResolvedValue(null);
    const res = (await POST(req(validBody))) as NextResponse;
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("creates a guest booking (no session) with a valid token", async () => {
    mockVerify.mockResolvedValue(true);
    mockSession.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "b-guest" });

    const res = (await POST(req(validBody))) as NextResponse;
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ contactPhone: "+12125550123" }),
    );
  });

  it("links the customer when a client session exists", async () => {
    mockVerify.mockResolvedValue(true);
    mockSession.mockResolvedValue({ user: { customerId: "cust-1" } });
    mockCreate.mockResolvedValue({ id: "b-client" });

    const res = (await POST(req(validBody))) as NextResponse;
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith(
      "cust-1",
      expect.objectContaining({ contactEmail: "rider@example.com" }),
    );
  });
});
