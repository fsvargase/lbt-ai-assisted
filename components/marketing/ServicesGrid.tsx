import Link from "next/link";
import { SERVICES } from "@/lib/seo/services";

export function ServicesGrid() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-16 border-t border-gray-900 scroll-mt-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center md:text-left">
          <h2 id="services-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Our Services
          </h2>
          <p className="mt-2 text-sm text-muted">
            Designed for convenience, prestige, and uncompromising standard.
          </p>
        </div>

        <nav aria-label="Services Grid" className="mt-10 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              data-testid={`home-service-${s.slug}`}
              className="group relative block rounded-2xl border border-gray-800 bg-surface p-6 shadow-md transition-all duration-300 hover:border-accent-gold/40 hover:-translate-y-1 hover:shadow-accent-gold/5"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-gold transition">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs text-accent-gold font-medium tracking-wide">
                    {s.short}
                  </p>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-accent-gold group-hover:underline">
                  Find out more
                  <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
