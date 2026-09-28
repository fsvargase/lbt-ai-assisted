"use client";

interface DateTimePickerProps {
  id: string;
  label: string;
  value: string;
  testId: string;
  onChange: (value: string) => void;
}

export function DateTimePicker({
  id,
  label,
  value,
  testId,
  onChange,
}: DateTimePickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="datetime-local"
        data-testid={testId}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <span className="text-xs text-gray-500">Times are in New York (ET).</span>
    </div>
  );
}
