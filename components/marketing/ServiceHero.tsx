import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/seo/config";
import { BookingCta } from "./BookingCta";
import type { ServiceDef } from "@/lib/seo/services";

export function ServiceHero({ service }: { service: ServiceDef }) {
  const url = absoluteUrl(`/services/${service.slug}`);
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.description,
          url,
        })}
      />
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{service.title}</h1>
      <p className="mt-2 text-lg text-accent-gold font-medium tracking-wide">{service.short} in New York City</p>

      <div className="mt-8 space-y-6 text-muted text-base leading-relaxed">
        <p>{service.description}</p>
        <p>
          Every ride is handled by an NYC-certified professional chauffeur in a premium vehicle. Our service coverage covers all 5 boroughs (Manhattan, Brooklyn, Queens, the Bronx, Staten Island) and airports (JFK, LaGuardia LGA, Newark Liberty EWR) to deliver maximum elegance, safety, and comfort.
        </p>
      </div>

      <div className="mt-10">
        <BookingCta serviceSlug={service.slug} label={`Book ${service.title}`} />
      </div>
    </article>
  );
}
