import { isWithinBuffer, nyLocalToIso, parseIso } from "@/lib/datetime";

describe("nyLocalToIso", () => {
  it("converts a winter (EST, UTC-5) wall-clock time to UTC", () => {
    // 2026-01-15 08:00 ET => 13:00 UTC
    expect(nyLocalToIso("2026-01-15T08:00")).toBe("2026-01-15T13:00:00.000Z");
  });

  it("converts a summer (EDT, UTC-4) wall-clock time to UTC", () => {
    // 2026-07-15 08:00 ET => 12:00 UTC
    expect(nyLocalToIso("2026-07-15T08:00")).toBe("2026-07-15T12:00:00.000Z");
  });
});

describe("parseIso", () => {
  it("parses a valid ISO string", () => {
    expect(parseIso("2026-01-15T13:00:00.000Z")).toBeInstanceOf(Date);
  });

  it("returns null for invalid input", () => {
    expect(parseIso("not-a-date")).toBeNull();
  });
});

describe("isWithinBuffer", () => {
  it("flags instants within the buffer window", () => {
    const a = new Date("2026-01-15T13:00:00Z");
    const b = new Date("2026-01-15T14:00:00Z");
    expect(isWithinBuffer(a, b, 120)).toBe(true);
  });

  it("allows instants outside the buffer window", () => {
    const a = new Date("2026-01-15T13:00:00Z");
    const b = new Date("2026-01-15T18:00:00Z");
    expect(isWithinBuffer(a, b, 120)).toBe(false);
  });
});
