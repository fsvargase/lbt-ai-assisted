"use client";

import type { LocationOption } from "./types";

interface LocationSelectProps {
  id: string;
  label: string;
  value: string;
  options: LocationOption[];
  testId: string;
  onChange: (value: string) => void;
}

export function LocationSelect({
  id,
  label,
  value,
  options,
  testId,
  onChange,
}: LocationSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        data-testid={testId}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">Select a location…</option>
        {options.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.code ? `${loc.code} — ${loc.name}` : loc.name}
          </option>
        ))}
      </select>
    </div>
  );
}
