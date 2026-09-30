import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/marketing/Hero";

describe("Hero Component", () => {
  it("renders exactly one h1 with the luxury title", () => {
    render(<Hero />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Luxury Budget Transportation — NYC Premium Chauffeur Service");
  });

  it("renders the brand logo image inside the heading", () => {
    render(<Hero />);
    const logo = screen.getByAltText(
      "Luxury Budget Transportation — NYC Premium Chauffeur Service"
    );
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", expect.stringContaining("logo_lbt.png"));
  });

  it("renders a prominent CTA linking to /new with hook data-testid", () => {
    render(<Hero />);
    const cta = screen.getByTestId("hero-cta-book");
    expect(cta).toHaveAttribute("href", "/new");
  });

  it("renders a Follow Us At Instagram CTA linking to the official profile", () => {
    render(<Hero />);
    const instagram = screen.getByTestId("hero-cta-instagram");
    expect(instagram).toHaveAttribute(
      "href",
      "https://www.instagram.com/luxurybudgettransport/"
    );
    expect(instagram).toHaveTextContent(/follow us at instagram/i);
  });
});
