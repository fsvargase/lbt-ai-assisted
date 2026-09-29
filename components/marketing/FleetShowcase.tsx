import Link from "next/link";
import { FLEET } from "@/lib/fleet/vehicles";

export function FleetShowcase() {
  return (
    <section id="fleet" aria-labelledby="fleet-title" className="py-16 border-t border-gray-900 scroll-mt-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center md:text-left">
          <h2 id="fleet-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Our Premium Fleet
          </h2>
          <p className="mt-2 text-sm text-muted">
            Choose from our flagship luxury vehicles, seeded for ultimate comfort and NYC-certified travel.
          </p>
        </div>

        {/* Swipeable snap container on mobile, multi-column grid on desktop */}
        <div className="mt-10 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 scrollbar-hide">
          {FLEET.map((vehicle) => (
            <div
              key={vehicle.slug}
              className="w-[85vw] shrink-0 snap-center rounded-2xl border border-gray-900 bg-surface p-6 shadow-md md:w-auto flex flex-col justify-between"
            >
              <div>
                {/* Vehicle header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {vehicle.label}
                    </h3>
                    <span className="inline-block mt-1 rounded bg-accent-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-gold">
                      {vehicle.comfort}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-muted tracking-wider">
                    {vehicle.vehicleClass}
                  </span>
                </div>

                {/* Badges and descriptions */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 rounded-xl bg-background/50 p-3 border border-gray-900">
                    <svg className="h-5 w-5 text-accent-gold shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-muted tracking-wider">Capacity</p>
                      <p className="font-semibold text-foreground text-xs sm:text-sm">{vehicle.capacity} Passengers</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-background/50 p-3 border border-gray-900">
                    <svg className="h-5 w-5 text-accent-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-muted tracking-wider">Luggage</p>
                      <p className="font-semibold text-foreground text-xs sm:text-sm">{vehicle.luggage} Bags</p>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-sm text-muted leading-relaxed">
                  Available for premium airport transfers, hourly point-to-point tours, and special events across any of the 5 boroughs of New York City and all local airports.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/new"
                  data-testid={`fleet-reserve-${vehicle.slug}`}
                  className="block w-full rounded-xl border border-accent-gold bg-transparent py-3 text-center text-xs font-semibold uppercase tracking-wider text-accent-gold hover:bg-accent-gold hover:text-background transition-all duration-300 active:scale-95"
                >
                  Reserve this vehicle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
