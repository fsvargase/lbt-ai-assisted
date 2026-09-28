import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookingForm } from "@/components/booking/BookingForm";
import type { LocationOption } from "@/components/booking/types";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

const locations: LocationOption[] = [
  { id: "loc-jfk", name: "JFK", code: "JFK" },
  { id: "loc-man", name: "Manhattan", code: null },
];

describe("BookingForm", () => {
  beforeEach(() => {
    push.mockReset();
    global.fetch = jest.fn();
  });

  it("shows a validation error when required fields are missing", async () => {
    render(<BookingForm locations={locations} />);
    fireEvent.click(screen.getByTestId("booking-submit"));
    expect(await screen.findByTestId("booking-error")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows the return picker only for round trips", () => {
    render(<BookingForm locations={locations} />);
    expect(screen.queryByTestId("return-datetime")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("trip-type-ROUND_TRIP"));
    expect(screen.getByTestId("return-datetime")).toBeInTheDocument();
  });

  it("submits a valid one-way booking and redirects", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "booking-1" }),
    });

    render(<BookingForm locations={locations} />);
    fireEvent.change(screen.getByTestId("origin-select"), {
      target: { value: "loc-jfk" },
    });
    fireEvent.change(screen.getByTestId("destination-select"), {
      target: { value: "loc-man" },
    });
    fireEvent.change(screen.getByTestId("outbound-datetime"), {
      target: { value: "2026-01-15T08:00" },
    });

    fireEvent.click(screen.getByTestId("booking-submit"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      "/api/bookings",
      expect.objectContaining({ method: "POST" }),
    ));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/bookings/booking-1"));
  });
});
