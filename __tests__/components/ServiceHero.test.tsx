import { render, screen } from "@testing-library/react";
import { ServiceHero } from "@/components/marketing/ServiceHero";
import type { ServiceDef } from "@/lib/seo/services";

const service: ServiceDef = {
  slug: "airport-transfers",
  title: "Airport Transfers",
  short: "JFK, LGA & EWR transfers",
  description: "Reliable luxury airport transfers to and from JFK, LGA, and EWR.",
};

describe("ServiceHero", () => {
  it("renders a single h1 with the service title", () => {
    render(<ServiceHero service={service} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Airport Transfers");
  });

  it("renders a booking CTA linking to /new", () => {
    render(<ServiceHero service={service} />);
    const cta = screen.getByTestId("cta-book-airport-transfers");
    expect(cta).toHaveAttribute("href", "/new");
  });

  it("emits valid Service JSON-LD", () => {
    const { container } = render(<ServiceHero service={service} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script!.textContent ?? "{}");
    expect(parsed["@type"]).toBe("Service");
    expect(parsed.provider["@type"]).toBe("LocalBusiness");
  });
});
