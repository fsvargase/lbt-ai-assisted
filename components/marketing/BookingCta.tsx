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
      className="inline-flex items-center justify-center rounded-xl bg-accent-gold px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-background hover:bg-accent-gold/90 shadow-lg shadow-accent-gold/10 transition active:scale-95"
    >
      {label}
    </Link>
  );
}
