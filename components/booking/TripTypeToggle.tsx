"use client";

import type { TripTypeValue } from "./types";

interface TripTypeToggleProps {
  value: TripTypeValue;
  onChange: (value: TripTypeValue) => void;
}

const OPTIONS: { value: TripTypeValue; label: string }[] = [
  { value: "ONE_WAY", label: "One-way" },
  { value: "ROUND_TRIP", label: "Round-trip" },
];

export function TripTypeToggle({ value, onChange }: TripTypeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Trip type"
      data-testid="trip-type-toggle"
      className="inline-flex rounded-lg border border-gray-300 p-1"
    >
      {OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            data-testid={`trip-type-${opt.value}`}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              selected
                ? "bg-black text-white"
                : "bg-transparent text-gray-700 hover:bg-gray-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
