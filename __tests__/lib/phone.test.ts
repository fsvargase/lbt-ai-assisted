import { normalizeUsPhone, isValidUsPhone } from "@/lib/phone";

describe("normalizeUsPhone", () => {
  it("normalizes a 10-digit number to E.164", () => {
    expect(normalizeUsPhone("2125550123")).toBe("+12125550123");
  });

  it("normalizes an 11-digit 1-prefixed number", () => {
    expect(normalizeUsPhone("12125550123")).toBe("+12125550123");
  });

  it("strips formatting characters", () => {
    expect(normalizeUsPhone("(212) 555-0123")).toBe("+12125550123");
    expect(normalizeUsPhone("+1 212.555.0123")).toBe("+12125550123");
  });

  it("rejects numbers with too few or too many digits", () => {
    expect(normalizeUsPhone("12345")).toBeNull();
    expect(normalizeUsPhone("212555012345")).toBeNull();
  });

  it("rejects an area or exchange code starting with 0 or 1", () => {
    expect(normalizeUsPhone("1125550123")).toBeNull();
    expect(normalizeUsPhone("2121550123")).toBeNull();
  });

  it("rejects empty input", () => {
    expect(normalizeUsPhone("")).toBeNull();
  });
});

describe("isValidUsPhone", () => {
  it("returns true for a valid US phone", () => {
    expect(isValidUsPhone("212-555-0123")).toBe(true);
  });

  it("returns false for an invalid phone", () => {
    expect(isValidUsPhone("abc")).toBe(false);
  });
});
