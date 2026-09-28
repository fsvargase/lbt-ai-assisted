import { absoluteUrl, siteConfig } from "./config";

export function localBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    image: absoluteUrl(siteConfig.ogImage),
    areaServed: { "@type": "City", name: "New York City" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
  };
}

export function serviceSchema(args: {
  name: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    serviceType: args.name,
    description: args.description,
    url: args.url,
    areaServed: { "@type": "City", name: "New York City" },
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
  };
}
