"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nyLocalToIso } from "@/lib/datetime";
import { isValidUsPhone } from "@/lib/phone";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { TripTypeToggle } from "./TripTypeToggle";
import { LocationSelect } from "./LocationSelect";
import { DateTimePicker } from "./DateTimePicker";
import type { LocationOption, TripTypeValue } from "./types";

interface BookingFormProps {
  locations: LocationOption[];
}

const EMAIL_RE = /\S+@\S+\.\S+/;

export function BookingForm({ locations }: BookingFormProps) {
  const router = useRouter();
  const { execute } = useRecaptcha();
  const [tripType, setTripType] = useState<TripTypeValue>("ONE_WAY");
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [outboundLocal, setOutboundLocal] = useState("");
  const [returnLocal, setReturnLocal] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setPhoneError(null);

    if (!originId || !destinationId || !outboundLocal) {
      setError("Please choose origin, destination, and outbound time.");
      return;
    }
    if (originId === destinationId) {
      setError("Origin and destination must be different.");
      return;
    }
    if (tripType === "ROUND_TRIP" && !returnLocal) {
      setError("Please choose a return time for a round trip.");
      return;
    }

    let hasContactError = false;
    if (!EMAIL_RE.test(contactEmail)) {
      setEmailError("Please enter a valid email address.");
      hasContactError = true;
    }
    if (!isValidUsPhone(contactPhone)) {
      setPhoneError("Please enter a valid US phone number.");
      hasContactError = true;
    }
    if (hasContactError) return;

    setSubmitting(true);
    try {
      const recaptchaToken = await execute("booking");
      const payload = {
        tripType,
        originId,
        destinationId,
        outboundAt: nyLocalToIso(outboundLocal),
        contactEmail,
        contactPhone,
        recaptchaToken: recaptchaToken ?? "",
        ...(tripType === "ROUND_TRIP"
          ? { returnAt: nyLocalToIso(returnLocal) }
          : {}),
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/signin?callbackUrl=/new");
          return;
        }
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not create the booking.");
        return;
      }
      const booking = await res.json();
      router.push(`/bookings/${booking.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-testid="booking-form"
      aria-label="Create a booking"
      className="flex max-w-xl flex-col gap-5"
    >
      <TripTypeToggle value={tripType} onChange={setTripType} />

      <LocationSelect
        id="origin"
        label="Pickup location"
        testId="origin-select"
        value={originId}
        options={locations}
        onChange={setOriginId}
      />
      <LocationSelect
        id="destination"
        label="Drop-off location"
        testId="destination-select"
        value={destinationId}
        options={locations}
        onChange={setDestinationId}
      />

      <DateTimePicker
        id="outbound"
        label="Outbound date & time"
        testId="outbound-datetime"
        value={outboundLocal}
        onChange={setOutboundLocal}
      />

      {tripType === "ROUND_TRIP" && (
        <DateTimePicker
          id="return"
          label="Return date & time"
          testId="return-datetime"
          value={returnLocal}
          onChange={setReturnLocal}
        />
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-email"
          className="text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Contact email
        </label>
        <input
          id="contact-email"
          name="contactEmail"
          type="email"
          autoComplete="email"
          data-testid="contact-email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "contact-email-error" : undefined}
          className="rounded-md border border-gray-700 bg-background px-3 py-2 text-sm text-foreground"
        />
        {emailError && (
          <p
            id="contact-email-error"
            role="alert"
            data-testid="contact-email-error"
            className="text-sm text-red-600"
          >
            {emailError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="contact-phone"
          className="text-xs font-semibold text-muted uppercase tracking-wider"
        >
          Contact phone (US)
        </label>
        <input
          id="contact-phone"
          name="contactPhone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+1 212 555 0123"
          data-testid="contact-phone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          aria-invalid={Boolean(phoneError)}
          aria-describedby={phoneError ? "contact-phone-error" : undefined}
          className="rounded-md border border-gray-700 bg-background px-3 py-2 text-sm text-foreground"
        />
        {phoneError && (
          <p
            id="contact-phone-error"
            role="alert"
            data-testid="contact-phone-error"
            className="text-sm text-red-600"
          >
            {phoneError}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" data-testid="booking-error" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-testid="booking-submit"
        disabled={submitting}
        className="rounded-md bg-accent-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-background hover:bg-accent-gold/90 transition-all disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Request booking"}
      </button>
    </form>
  );
}
