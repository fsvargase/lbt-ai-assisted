"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nyLocalToIso } from "@/lib/datetime";
import { TripTypeToggle } from "./TripTypeToggle";
import { LocationSelect } from "./LocationSelect";
import { DateTimePicker } from "./DateTimePicker";
import type { LocationOption, TripTypeValue } from "./types";

interface BookingFormProps {
  locations: LocationOption[];
}

export function BookingForm({ locations }: BookingFormProps) {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripTypeValue>("ONE_WAY");
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [outboundLocal, setOutboundLocal] = useState("");
  const [returnLocal, setReturnLocal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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

    const payload = {
      tripType,
      originId,
      destinationId,
      outboundAt: nyLocalToIso(outboundLocal),
      ...(tripType === "ROUND_TRIP"
        ? { returnAt: nyLocalToIso(returnLocal) }
        : {}),
    };

    setSubmitting(true);
    try {
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
