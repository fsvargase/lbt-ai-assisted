import { test, expect } from "@playwright/test";

test.describe("Luxury Redesign & Mobile-First Flow", () => {
  test("home page elements and quick-link links render properly", async ({ page }) => {
    await page.goto("/");

    // 1. Verify Hero and CTA
    await expect(page.locator("h1")).toContainText("Luxury Budget Transportation — NYC Premium Chauffeur Service");
    const bookCta = page.getByTestId("hero-cta-book");
    await expect(bookCta).toBeVisible();
    await expect(bookCta).toHaveAttribute("href", "/new");

    // 2. Verify Services Section maps SERVICES dynamically
    await expect(page.getByTestId("home-service-airport-transfers")).toBeVisible();
    await expect(page.getByTestId("home-service-hourly")).toBeVisible();

    // 3. Verify Fleet section
    await expect(page.getByTestId("fleet-reserve-mercedes-s-class")).toBeVisible();
    await expect(page.getByTestId("fleet-reserve-cadillac-escalade")).toBeVisible();

    // 4. Verify Contact Form fields exist
    await expect(page.getByTestId("contact-name")).toBeVisible();
    await expect(page.getByTestId("contact-email")).toBeVisible();
    await expect(page.getByTestId("contact-message")).toBeVisible();
    await expect(page.getByTestId("contact-submit")).toBeVisible();
  });

  test("mobile hamburger menu opens and closes", async ({ page }) => {
    // Set viewport to a typical mobile sizing
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // 1. Hamburger menu button should be visible
    const menuToggle = page.getByTestId("nav-menu-toggle");
    await expect(menuToggle).toBeVisible();
    await expect(menuToggle).toHaveAttribute("aria-expanded", "false");

    // Panel should not be visible yet
    const mobilePanel = page.getByTestId("nav-menu-panel");
    await expect(mobilePanel).not.toBeAttached();

    // 2. Click menu trigger to expand
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("nav-menu-panel")).toBeVisible();
    await expect(page.getByTestId("nav-link-mobile-services")).toBeVisible();

    // 3. Click menu trigger again to close
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("nav-menu-panel")).not.toBeAttached();
  });

  test("contact form client-side validation blocks submit and succeeds with good input", async ({ page }) => {
    await page.goto("/");

    // Click submit empty
    const submitBtn = page.getByTestId("contact-submit");
    await submitBtn.click();

    // Inline alerts should show
    await expect(page.locator("#name-error")).toBeVisible();
    await expect(page.locator("#email-error")).toBeVisible();
    await expect(page.locator("#message-error")).toBeVisible();

    // Fill in required data
    await page.getByTestId("contact-name").fill("Dana Driver");
    await page.getByTestId("contact-email").fill("dana@example.com");
    await page.getByTestId("contact-message").fill("Hi, I want a quote for 4 hours in Manhattan.");

    // Submit again
    await submitBtn.click();

    // Form should hide and success message should render
    await expect(page.getByTestId("contact-success")).toBeVisible();
    await expect(page.getByText("Message Sent")).toBeVisible();
  });
});
