"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AgreedPriceFormProps {
  bookingId: string;
  currentPrice: string | null;
  disabled?: boolean;
}

export function AgreedPriceForm({
  bookingId,
  currentPrice,
  disabled,
}: AgreedPriceFormProps) {
  const router = useRouter();
  const [price, setPrice] = useState(currentPrice ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(price);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a price greater than 0.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agreedPrice: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not set the price.");
        return;
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="agreed-price-form"
      aria-label="Set agreed price"
      className="flex items-end gap-3"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="agreedPrice" className="text-sm font-medium text-gray-700">
          Agreed price (USD)
        </label>
        <input
          id="agreedPrice"
          type="number"
          min="0"
          step="0.01"
          data-testid="agreed-price-input"
          aria-label="Agreed price in US dollars"
          value={price}
          disabled={disabled}
          onChange={(e) => setPrice(e.target.value)}
          className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        data-testid="agreed-price-submit"
        disabled={disabled || saving}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save price"}
      </button>
      {error && (
        <p role="alert" data-testid="agreed-price-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
