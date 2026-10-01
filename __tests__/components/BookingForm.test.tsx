import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookingForm } from "@/components/booking/BookingForm";
import type { LocationOption } from "@/components/booking/types";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

const execute = jest.fn().mockResolvedValue("test-token");
jest.mock("@/hooks/useRecaptcha", () => ({
  useRecaptcha: () => ({ execute }),
}));

const locations: LocationOption[] = [
  { id: "loc-jfk", name: "JFK", code: "JFK" },
  { id: "loc-man", name: "Manhattan", code: null },
];

function fillTripFields() {
  fireEvent.change(screen.getByTestId("origin-select"), {
    target: { value: "loc-jfk" },
  });
  fireEvent.change(screen.getByTestId("destination-select"), {
    target: { value: "loc-man" },
  });
  fireEvent.change(screen.getByTestId("outbound-datetime"), {
    target: { value: "2026-01-15T08:00" },
  });
}

function fillContactFields(email = "rider@example.com", phone = "212-555-0123") {
  fireEvent.change(screen.getByTestId("contact-email"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByTestId("contact-phone"), {
    target: { value: phone },
  });
}

describe("BookingForm", () => {
  beforeEach(() => {
    push.mockReset();
    execute.mockClear();
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

  it("shows an inline error for an invalid contact email", async () => {
    render(<BookingForm locations={locations} />);
    fillTripFields();
    fillContactFields("not-an-email", "212-555-0123");
    fireEvent.click(screen.getByTestId("booking-submit"));
    expect(await screen.findByTestId("contact-email-error")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows an inline error for an invalid US phone", async () => {
    render(<BookingForm locations={locations} />);
    fillTripFields();
    fillContactFields("rider@example.com", "12345");
    fireEvent.click(screen.getByTestId("booking-submit"));
    expect(await screen.findByTestId("contact-phone-error")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits a valid one-way booking with contact fields and a token", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "booking-1" }),
    });

    render(<BookingForm locations={locations} />);
    fillTripFields();
    fillContactFields();

    fireEvent.click(screen.getByTestId("booking-submit"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      contactEmail: "rider@example.com",
      contactPhone: "212-555-0123",
      recaptchaToken: "test-token",
    });
    expect(execute).toHaveBeenCalledWith("booking");
    await waitFor(() => expect(push).toHaveBeenCalledWith("/bookings/booking-1"));
  });
});
