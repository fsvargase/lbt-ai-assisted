import { render, screen, fireEvent } from "@testing-library/react";
import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader Component", () => {
  it("renders desktop navigation links inline", () => {
    // Unauthenticated user
    render(<SiteHeader user={null} />);

    // Brand link is visible
    const brand = screen.getByTestId("nav-link-home");
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute("href", "/");

    // Book Now button is visible
    const bookBtn = screen.getByTestId("nav-link-book");
    expect(bookBtn).toBeInTheDocument();
    expect(bookBtn).toHaveAttribute("href", "/new");

    // Sign in link is visible
    expect(screen.getByTestId("nav-link-signin")).toBeInTheDocument();
  });

  it("handles mobile menu toggling and panel visibility", () => {
    render(<SiteHeader user={null} />);

    // Toggle button exists
    const toggle = screen.getByTestId("nav-menu-toggle");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    // Panel is NOT in the document initially
    expect(screen.queryByTestId("nav-menu-panel")).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(toggle);

    // Toggle button should be set to expanded
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Panel should now be in the document
    const panel = screen.getByTestId("nav-menu-panel");
    expect(panel).toBeInTheDocument();

    // Inside mobile menu, we have our items
    expect(screen.getByTestId("nav-link-mobile-services")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-mobile-book")).toBeInTheDocument();

    // Click to close
    fireEvent.click(toggle);

    // Expanded should revert to false
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("nav-menu-panel")).not.toBeInTheDocument();
  });

  it("renders custom role-based links depending on authenticated role", () => {
    // Unauthenticated: shows signin, no dashboard/driver links
    const { rerender } = render(<SiteHeader user={null} />);
    expect(screen.getByTestId("nav-link-signin")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-link-operator")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav-link-driver")).not.toBeInTheDocument();

    // Authenticated Operator: shows dashboard link
    rerender(<SiteHeader user={{ name: "Olivia", email: "operator@example.com", role: "OPERATOR" }} />);
    expect(screen.getByTestId("nav-link-operator")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-link-signin")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-link-bookings")).toBeInTheDocument();

    // Authenticated Driver: shows driver portal link
    rerender(<SiteHeader user={{ name: "Dana", email: "driver.a@example.com", role: "DRIVER" }} />);
    expect(screen.getByTestId("nav-link-driver")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-link-operator")).not.toBeInTheDocument();
  });
});
