jest.mock("@/lib/env", () => ({
  env: { RECAPTCHA_SECRET_KEY: "test-secret", RECAPTCHA_MIN_SCORE: 0.5 },
}));

import { verifyRecaptcha } from "@/lib/recaptcha";

function mockFetchJson(body: unknown, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => body,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("verifyRecaptcha", () => {
  it("returns false for an empty token without calling the API", async () => {
    global.fetch = jest.fn();
    expect(await verifyRecaptcha("")).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns true for a successful high-score verification", async () => {
    mockFetchJson({ success: true, score: 0.9 });
    expect(await verifyRecaptcha("token")).toBe(true);
  });

  it("returns false when Google reports the token invalid", async () => {
    mockFetchJson({ success: false, "error-codes": ["invalid-input-response"] });
    expect(await verifyRecaptcha("token")).toBe(false);
  });

  it("returns false when the score is below the threshold", async () => {
    mockFetchJson({ success: true, score: 0.2 });
    expect(await verifyRecaptcha("token")).toBe(false);
  });

  it("fails closed on a network error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network"));
    expect(await verifyRecaptcha("token")).toBe(false);
  });

  it("rejects an action mismatch", async () => {
    mockFetchJson({ success: true, score: 0.9, action: "other" });
    expect(await verifyRecaptcha("token", { action: "booking" })).toBe(false);
  });
});
