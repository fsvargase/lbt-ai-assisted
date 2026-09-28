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
      <h1 className="text-4xl font-semibold tracking-tight">{service.title}</h1>
      <p className="mt-2 text-lg text-gray-600">{service.short} in New York City</p>

      <div className="mt-8 space-y-4 text-gray-700">
        <p>{service.description}</p>
        <p>
          Every ride is handled by a professional chauffeur in a premium vehicle,
          with New York City service areas including Manhattan, Brooklyn, Queens,
          the Bronx, and Staten Island, plus the JFK, LaGuardia, and Newark
          airports.
        </p>
      </div>

      <div className="mt-10">
        <BookingCta serviceSlug={service.slug} label={`Book ${service.title}`} />
      </div>
    </article>
  );
}
