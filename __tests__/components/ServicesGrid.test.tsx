import { render, screen } from "@testing-library/react";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { SERVICES } from "@/lib/seo/services";

describe("ServicesGrid Component", () => {
  it("renders a dynamic list of services from SERVICES array", () => {
    render(<ServicesGrid />);
    
    // Assert all SERVICES are rendered in the navigation grid
    SERVICES.forEach((service) => {
      const card = screen.getByTestId(`home-service-${service.slug}`);
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("href", `/services/${service.slug}`);
      expect(screen.getByText(service.title)).toBeInTheDocument();
    });
  });
});
