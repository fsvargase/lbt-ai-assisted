import { localBusinessSchema, serviceSchema } from "@/lib/seo/schema";

describe("localBusinessSchema", () => {
  it("produces valid LocalBusiness JSON-LD for NYC", () => {
    const data = localBusinessSchema();
    // Round-trips through JSON without errors.
    const parsed = JSON.parse(JSON.stringify(data));
    expect(parsed["@type"]).toBe("LocalBusiness");
    expect(parsed.areaServed.name).toBe("New York City");
    expect(typeof parsed.url).toBe("string");
  });
});

describe("serviceSchema", () => {
  it("produces valid Service JSON-LD with a provider", () => {
    const data = serviceSchema({
      name: "Airport Transfers",
      description: "JFK/LGA/EWR transfers",
      url: "https://example.com/services/airport-transfers",
    });
    const parsed = JSON.parse(JSON.stringify(data));
    expect(parsed["@type"]).toBe("Service");
    expect(parsed.name).toBe("Airport Transfers");
    expect(parsed.provider["@type"]).toBe("LocalBusiness");
    expect(parsed.areaServed.name).toBe("New York City");
  });
});
