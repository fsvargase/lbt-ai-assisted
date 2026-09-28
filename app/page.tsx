import Link from "next/link";
import { Role } from "@prisma/client";
import { getSafeSession } from "@/lib/auth/session";

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
      <header>
        <h1 className="text-3xl font-semibold">LBT — Luxury Transport NYC</h1>
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
    </main>
  );
}
