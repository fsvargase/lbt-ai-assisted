import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@/components/marketing/ContactForm";

describe("ContactForm Component", () => {
  it("renders all form elements with their respective accessible names and labels", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
    expect(screen.getByTestId("contact-submit")).toBeInTheDocument();
  });

  it("validates required fields on client and surfaces validation errors", async () => {
    render(<ContactForm />);

    // Click submit with empty form fields
    const submitBtn = screen.getByTestId("contact-submit");
    fireEvent.click(submitBtn);

    // Errors should render
    expect(screen.getByTestId("error-name")).toHaveTextContent("Name is required.");
    expect(screen.getByTestId("error-email")).toHaveTextContent("Email is required.");
    expect(screen.getByTestId("error-message")).toHaveTextContent("Message is required.");
  });

  it("submits successfully with valid data and renders success feedback", async () => {
    render(<ContactForm />);

    // Populate inputs
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Felipe Vargas" } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "felipe@example.com" } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: "Hello, looking for an airport transfer booking." } });

    // Click submit
    const submitBtn = screen.getByTestId("contact-submit");
    fireEvent.click(submitBtn);

    // Form should handle submit and render success component
    await waitFor(() => {
      expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      expect(screen.getByText("Message Sent")).toBeInTheDocument();
    });
  });
});
