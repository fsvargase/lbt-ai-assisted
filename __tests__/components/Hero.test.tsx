import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/marketing/Hero";

describe("Hero Component", () => {
  it("renders exactly one h1 with the luxury title", () => {
    render(<Hero />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Luxury Budget Transportation — NYC Premium Chauffeur Service");
  });

  it("renders a prominent CTA linking to /new with hook data-testid", () => {
    render(<Hero />);
    const cta = screen.getByTestId("hero-cta-book");
    expect(cta).toHaveAttribute("href", "/new");
  });
});
