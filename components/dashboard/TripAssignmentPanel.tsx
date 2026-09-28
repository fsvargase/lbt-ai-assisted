"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface AssignableTrip {
  id: string;
  kind: string;
  status: string;
  originName: string;
  destinationName: string;
  scheduledLabel: string;
  driverId: string | null;
  vehicleId: string | null;
}

export interface DriverOption {
  id: string;
  name: string;
}

export interface VehicleOption {
  id: string;
  label: string;
}

interface TripAssignmentPanelProps {
  trips: AssignableTrip[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
  canAssign: boolean;
}

export function TripAssignmentPanel({
  trips,
  drivers,
  vehicles,
  canAssign,
}: TripAssignmentPanelProps) {
  return (
    <div className="flex flex-col gap-4" data-testid="trip-assignment-panel">
      {trips.map((trip) => (
        <TripAssignmentRow
          key={trip.id}
          trip={trip}
          drivers={drivers}
          vehicles={vehicles}
          canAssign={canAssign}
        />
      ))}
    </div>
  );
}

function TripAssignmentRow({
  trip,
  drivers,
  vehicles,
  canAssign,
}: {
  trip: AssignableTrip;
  drivers: DriverOption[];
  vehicles: VehicleOption[];
  canAssign: boolean;
}) {
  const router = useRouter();
  const [driverId, setDriverId] = useState(trip.driverId ?? "");
  const [vehicleId, setVehicleId] = useState(trip.vehicleId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const locked = trip.status === "IN_PROGRESS" || trip.status === "COMPLETED";

  async function assign() {
    setError(null);
    if (!driverId || !vehicleId) {
      setError("Select both a driver and a vehicle.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${trip.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId, vehicleId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not assign the trip.");
        return;
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      data-testid={`assignment-row-${trip.id}`}
      className="rounded-lg border border-gray-200 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium">
          {trip.kind === "OUTBOUND" ? "Outbound" : "Return"} · {trip.originName} →{" "}
          {trip.destinationName}
        </span>
        <span className="text-xs uppercase tracking-wide text-gray-500">
          {trip.status}
        </span>
      </div>
      <p className="mb-3 text-sm text-gray-600">{trip.scheduledLabel}</p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Driver</span>
          <select
            data-testid={`driver-select-${trip.id}`}
            aria-label={`Driver for ${trip.kind} trip`}
            value={driverId}
            disabled={!canAssign || locked}
            onChange={(e) => setDriverId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select…</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Vehicle</span>
          <select
            data-testid={`vehicle-select-${trip.id}`}
            aria-label={`Vehicle for ${trip.kind} trip`}
            value={vehicleId}
            disabled={!canAssign || locked}
            onChange={(e) => setVehicleId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          data-testid={`assign-submit-${trip.id}`}
          onClick={assign}
          disabled={!canAssign || locked || saving}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Assigning…" : "Assign"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          data-testid={`assign-error-${trip.id}`}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
