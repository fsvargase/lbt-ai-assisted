import Link from "next/link";

interface BookingCtaProps {
  serviceSlug: string;
  label?: string;
}

export function BookingCta({ serviceSlug, label = "Book this service" }: BookingCtaProps) {
  return (
    <Link
      href="/new"
      data-testid={`cta-book-${serviceSlug}`}
      aria-label={`${label} — go to booking`}
      className="inline-flex items-center rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
    >
      {label}
    </Link>
  );
}
