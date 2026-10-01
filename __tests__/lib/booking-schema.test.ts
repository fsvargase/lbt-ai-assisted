import { createBookingSchema } from "@/lib/bookings/schemas";

const base = {
  tripType: "ONE_WAY" as const,
  originId: "loc-a",
  destinationId: "loc-b",
  outboundAt: "2026-01-15T13:00:00.000Z",
  contactEmail: "rider@example.com",
  contactPhone: "(212) 555-0123",
  recaptchaToken: "token-123",
};

describe("createBookingSchema contact + reCAPTCHA", () => {
  it("accepts valid input and normalizes the phone to E.164", () => {
    const parsed = createBookingSchema.parse(base);
    expect(parsed.contactPhone).toBe("+12125550123");
    expect(parsed.contactEmail).toBe("rider@example.com");
    expect(parsed.recaptchaToken).toBe("token-123");
  });

  it("rejects an invalid email", () => {
    expect(() =>
      createBookingSchema.parse({ ...base, contactEmail: "not-an-email" }),
    ).toThrow();
  });

  it("rejects an invalid US phone", () => {
    expect(() =>
      createBookingSchema.parse({ ...base, contactPhone: "12345" }),
    ).toThrow();
  });

  it("requires the recaptchaToken field to be present", () => {
    const { recaptchaToken: _omit, ...noToken } = base;
    void _omit;
    expect(() => createBookingSchema.parse(noToken)).toThrow();
  });
});
