import { render, screen } from "@testing-library/react";
import { FleetShowcase } from "@/components/marketing/FleetShowcase";
import { FLEET } from "@/lib/fleet/vehicles";

describe("FleetShowcase Component", () => {
  it("renders seeded flagship vehicles with technical passenger and luggage badges", () => {
    render(<FleetShowcase />);

    // Check header info
    expect(screen.getByText("Our Premium Fleet")).toBeInTheDocument();

    // Check each vehicle in FLEET
    FLEET.forEach((vehicle) => {
      expect(screen.getByText(vehicle.label)).toBeInTheDocument();
      expect(screen.getByText(vehicle.comfort)).toBeInTheDocument();
      expect(screen.getByText(`${vehicle.capacity} Passengers`)).toBeInTheDocument();
      expect(screen.getByText(`${vehicle.luggage} Bags`)).toBeInTheDocument();

      const reserveCta = screen.getByTestId(`fleet-reserve-${vehicle.slug}`);
      expect(reserveCta).toBeInTheDocument();
      expect(reserveCta).toHaveAttribute("href", "/new");
    });
  });
});
