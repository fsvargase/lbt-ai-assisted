export interface ServiceDef {
  slug: string;
  title: string;
  short: string;
  description: string;
}

export const SERVICES: ServiceDef[] = [
  {
    slug: "airport-transfers",
    title: "Airport Transfers",
    short: "JFK, LGA & EWR transfers",
    description:
      "Reliable luxury airport transfers to and from JFK, LaGuardia (LGA), and Newark (EWR). Professional chauffeurs, flight tracking, and meet-and-greet service across New York City.",
  },
  {
    slug: "hourly",
    title: "Hourly Chauffeur Hire",
    short: "Chauffeur by the hour",
    description:
      "Book a premium chauffeur by the hour for meetings, shopping, or a night out in New York City. Flexible, discreet, and always on time.",
  },
  {
    slug: "point-to-point",
    title: "Point-to-Point Transfers",
    short: "Fixed origin to destination",
    description:
      "Direct, fixed-rate luxury transfers between any two points in New York City. Comfortable, punctual, and stress-free.",
  },
  {
    slug: "events",
    title: "Event & Group Transport",
    short: "Weddings, corporate & events",
    description:
      "Chauffeured transport for weddings, corporate events, and group occasions across NYC. Coordinated logistics and premium vehicles for a seamless experience.",
  },
];

export function getService(slug: string): ServiceDef | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
