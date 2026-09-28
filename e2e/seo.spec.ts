import { test, expect } from "@playwright/test";

test("sitemap lists public routes and excludes private ones", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.ok()).toBeTruthy();
  const xml = await res.text();

  expect(xml).toContain("/services/airport-transfers");
  expect(xml).toContain("/services/hourly");
  // Private routes must not be listed.
  expect(xml).not.toContain("/dashboard");
  expect(xml).not.toContain("/driver");
  expect(xml).not.toContain("/signin");
});

test("robots disallows private routes and references the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBeTruthy();
  const txt = await res.text();

  expect(txt).toMatch(/Disallow:\s*\/dashboard/);
  expect(txt).toMatch(/Disallow:\s*\/driver/);
  expect(txt).toMatch(/Disallow:\s*\/bookings/);
  expect(txt).toMatch(/Disallow:\s*\/signin/);
  expect(txt).toMatch(/Sitemap:\s*https?:\/\/.+\/sitemap\.xml/);
});

test("a marketing page renders indexable SEO content", async ({ page }) => {
  await page.goto("/services/airport-transfers");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByTestId("cta-book-airport-transfers")).toBeVisible();
  const jsonLd = page.locator('script[type="application/ld+json"]');
  await expect(jsonLd.first()).toHaveCount(1);
});

test("a private page emits noindex", async ({ page }) => {
  await page.goto("/signin");
  const robots = page.locator('head meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/);
});
