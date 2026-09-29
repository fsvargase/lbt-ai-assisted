import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-16 border-t border-gray-900 scroll-mt-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Informational Column */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h2 id="contact-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Get in Touch
              </h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Plan your premium transfers with a qualified chauffeur in New York City. Speak to our operators for special events, custom routing, or group bookings.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-accent-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-muted">+1 (212) 555-0199</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-accent-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.68a2 2 0 012.22 0l8 5.68A2 2 0 0121 10.07V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 14l8-6 8 6" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Email</p>
                  <p className="text-sm text-muted">bookings@luxurybudgettransport.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-accent-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Coverage & Airports</p>
                  <p className="text-sm text-muted leading-relaxed">
                    All 5 NYC Boroughs (Manhattan, Brooklyn, Queens, The Bronx, Staten Island) and airports (JFK International, LaGuardia LGA, Newark Liberty EWR).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
