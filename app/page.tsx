import Link from "next/link";
import type { Metadata } from "next";
import { Role } from "@prisma/client";
import { getSafeSession } from "@/lib/auth/session";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/seo/schema";
import { SERVICES } from "@/lib/seo/services";

export const metadata: Metadata = {
  title: "Luxury NYC Ground Transportation & Chauffeur Service",
  description:
    "Book premium chauffeured ground transportation in New York City — airport transfers (JFK/LGA/EWR), hourly hire, point-to-point, and events.",
  alternates: { canonical: "/" },
};

const sections = [
  { href: "/new", title: "Book a ride", desc: "Request a one-way or round-trip transfer.", testId: "home-book" },
  { href: "/bookings", title: "My bookings", desc: "View your reservations and prices.", testId: "home-bookings" },
  { href: "/driver/trips", title: "Driver portal", desc: "See and track your assigned trips.", testId: "home-driver" },
];

export default async function Home() {
  const session = await getSafeSession();
  const isOperator =
    session?.user?.role === Role.OPERATOR || session?.user?.role === Role.ADMIN;

  const links = isOperator
    ? [
        ...sections,
        {
          href: "/dashboard/bookings",
          title: "Operator dashboard",
          desc: "Price bookings and assign drivers.",
          testId: "home-operator",
        },
      ]
    : sections;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <JsonLd data={localBusinessSchema()} />
      <header>
        <h1 className="text-3xl font-semibold">
          Luxury Budget Transport — NYC Chauffeur Service
        </h1>
        <p className="mt-2 text-gray-600">
          Premium chauffeured ground transportation across New York City.
        </p>
      </header>

      <nav aria-label="Primary" className="grid gap-4 sm:grid-cols-3">
        {links.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            data-testid={s.testId}
            className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"
          >
            <h2 className="font-medium">{s.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
          </Link>
        ))}
      </nav>

      <section aria-labelledby="services-heading">
        <h2 id="services-heading" className="text-xl font-semibold">
          Our services
        </h2>
        <nav aria-label="Services" className="mt-4 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              data-testid={`home-service-${s.slug}`}
              className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"
            >
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.short}</p>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}

