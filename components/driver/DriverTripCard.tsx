"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface DriverTrip {
  id: string;
  kind: string;
  status: string;
  originName: string;
  destinationName: string;
  scheduledLabel: string;
}

const NEXT_STATUS: Record<string, { next: string; label: string } | null> = {
  ASSIGNED: { next: "IN_PROGRESS", label: "Start trip" },
  IN_PROGRESS: { next: "COMPLETED", label: "Complete trip" },
  COMPLETED: null,
};

export function DriverTripCard({ trip }: { trip: DriverTrip }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const action = NEXT_STATUS[trip.status];

  async function advance() {
    if (!action) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/driver/trips/${trip.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action.next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not update the trip.");
        return;
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      data-testid={`driver-trip-${trip.id}`}
      className="rounded-lg border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {trip.kind === "OUTBOUND" ? "Outbound" : "Return"}
        </span>
        <span
          data-testid={`driver-trip-status-${trip.id}`}
          className="text-xs uppercase tracking-wide text-gray-500"
        >
          {trip.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {trip.originName} → {trip.destinationName}
      </p>
      <p className="mt-1 text-sm text-gray-600">{trip.scheduledLabel}</p>

      {action && (
        <button
          type="button"
          data-testid={`driver-trip-advance-${trip.id}`}
          onClick={advance}
          disabled={saving}
          className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Updating…" : action.label}
        </button>
      )}

      {error && (
        <p
          role="alert"
          data-testid={`driver-trip-error-${trip.id}`}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
