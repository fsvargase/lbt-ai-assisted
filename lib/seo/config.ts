export interface SiteConfig {
  siteUrl: string;
  name: string;
  description: string;
  ogImage: string;
}

const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.luxurybudgettransport.com";

export const siteConfig: SiteConfig = {
  siteUrl: rawUrl.replace(/\/$/, ""),
  name: "Luxury Budget Transportation",
  description:
    "Premium chauffeured ground transportation across New York City — airport transfers (JFK/LGA/EWR), hourly hire, point-to-point, and events.",
  ogImage: "/og.png",
};

export function absoluteUrl(path = "/"): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${suffix}`;
}
