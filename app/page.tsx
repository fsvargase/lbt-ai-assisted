import Link from "next/link";
import type { Metadata } from "next";
import { Role } from "@prisma/client";
import { getSafeSession } from "@/lib/auth/session";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/seo/schema";

import { Hero } from "@/components/marketing/Hero";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { FleetShowcase } from "@/components/marketing/FleetShowcase";
import { ContactSection } from "@/components/marketing/ContactSection";

export const metadata: Metadata = {
  title: "Luxury NYC Ground Transportation & Chauffeur Service",
  description:
    "Book premium chauffeured ground transportation in New York City — airport transfers (JFK/LGA/EWR), hourly hire, point-to-point, and events.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const session = await getSafeSession();
  const isOperator =
    session?.user?.role === Role.OPERATOR || session?.user?.role === Role.ADMIN;
  const isDriver = session?.user?.role === Role.DRIVER;

  return (
    <div className="w-full flex flex-col gap-4">
      <JsonLd data={localBusinessSchema()} />

      <Hero />

      <div className="mx-auto w-full max-w-5xl flex flex-col gap-4">
        {/* Role-aware / Shortcut Session Banner to preserve original nav testids & routes */}
        <section className="px-6 pb-8">
        <div className="mx-auto max-w-md md:max-w-2xl rounded-2xl border border-gray-800 bg-surface/40 p-4 md:p-6 shadow-md backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-gold">
                Quick Portal Access
              </p>
              <h2 className="text-sm text-muted mt-1">
                {session ? (
                  <span>
                    Welcome back, <strong className="text-foreground">{session.user?.name || session.user?.email}</strong>
                  </span>
                ) : (
                  "Access dynamic booking management and driver portals."
                )}
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/new"
                data-testid="home-book"
                className="rounded-lg bg-accent-gold/10 border border-accent-gold/20 px-3 py-2 text-xs font-semibold text-accent-gold hover:bg-accent-gold hover:text-background transition"
              >
                Book a ride
              </Link>

              {session ? (
                <>
                  <Link
                    href="/bookings"
                    data-testid="home-bookings"
                    className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-xs font-semibold text-foreground hover:bg-gray-900 transition"
                  >
                    My bookings
                  </Link>

                  {isDriver && (
                    <Link
                      href="/driver/trips"
                      data-testid="home-driver"
                      className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-xs font-semibold text-foreground hover:bg-gray-900 transition"
                    >
                      Driver portal
                    </Link>
                  )}

                  {isOperator && (
                    <Link
                      href="/dashboard/bookings"
                      data-testid="home-operator"
                      className="rounded-lg bg-accent-gold/20 border border-accent-gold/40 px-3 py-2 text-xs font-semibold text-accent-gold hover:bg-accent-gold/30 transition"
                    >
                      Operator dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/bookings"
                    data-testid="home-bookings"
                    className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-xs font-semibold text-foreground hover:bg-gray-900 transition"
                  >
                    My bookings
                  </Link>
                  <Link
                    href="/driver/trips"
                    data-testid="home-driver"
                    className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-xs font-semibold text-foreground hover:bg-gray-900 transition"
                  >
                    Driver portal
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <ServicesGrid />

      <FleetShowcase />

      <ContactSection />
    </div>
  </div>
  );
}

