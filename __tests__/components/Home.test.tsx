import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { getSafeSession } from "@/lib/auth/session";

jest.mock("@/lib/auth/session", () => ({
  getSafeSession: jest.fn(),
}));

const mockGetSafeSession = getSafeSession as jest.Mock;

describe("Home Page Server Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a layout with Hero, Services, Fleet, and Contact options", async () => {
    mockGetSafeSession.mockResolvedValue(null);

    const result = await Home();
    render(result);

    // Hero title
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Luxury Budget Transportation — NYC Premium Chauffeur Service"
    );

    // Services card list
    expect(screen.getByTestId("home-service-airport-transfers")).toBeInTheDocument();
    expect(screen.getByTestId("home-service-hourly")).toBeInTheDocument();

    // Fleet vehicles
    expect(screen.getByTestId("fleet-reserve-mercedes-s-class")).toBeInTheDocument();
    expect(screen.getByTestId("fleet-reserve-cadillac-escalade")).toBeInTheDocument();

    // Contact info
    expect(screen.getByText("John F. Kennedy International Airport", { exact: false })).toBeInTheDocument();

    // Not logged in: does NOT display operator dashboard link
    expect(screen.queryByTestId("home-operator")).not.toBeInTheDocument();
  });

  it("displays operator dashboard link only when user has OPERATOR or ADMIN role", async () => {
    // 1. Mock OPERATOR role session
    mockGetSafeSession.mockResolvedValue({
      user: { name: "Olivia", email: "operator@example.com", role: "OPERATOR" },
    });

    let result = await Home();
    const { rerender } = render(result);

    expect(screen.getByTestId("home-operator")).toBeInTheDocument();
    expect(screen.getByTestId("home-operator")).toHaveAttribute("href", "/dashboard/bookings");

    // 2. Mock regular CLIENT role session which should not display the link
    mockGetSafeSession.mockResolvedValue({
      user: { name: "Casey", email: "client@example.com", role: "CLIENT" },
    });

    result = await Home();
    rerender(result);

    expect(screen.queryByTestId("home-operator")).not.toBeInTheDocument();
  });
});
