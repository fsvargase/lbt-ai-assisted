import { test, expect } from "@playwright/test";
import { signInAs } from "./helpers";

// Smoke test: the public booking form renders with its accessible controls.
test("client booking form renders", async ({ page }) => {
  await page.goto("/new");

  await expect(page.getByTestId("booking-form")).toBeVisible();
  await expect(page.getByTestId("trip-type-toggle")).toBeVisible();
  await expect(page.getByTestId("origin-select")).toBeVisible();
  await expect(page.getByTestId("destination-select")).toBeVisible();
  await expect(page.getByTestId("outbound-datetime")).toBeVisible();
  await expect(page.getByTestId("booking-submit")).toBeVisible();
});

/**
 * Full booking-core flow across roles.
 *
 * Requires: a running app (webServer in playwright.config), the seeded users,
 * and browsers installed via `npx playwright install`. Each role runs in its
 * own browser context so sessions do not collide.
 */
test("round-trip booking end-to-end across roles", async ({ browser }) => {
  // Unique future dates per run so re-runs don't collide with prior assignments
  // (the availability check rejects a driver already booked at an overlapping time).
  const dayOffset = 30 + Math.floor(Math.random() * 3000);
  const localDay = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T08:00`;
  };
  const outboundAt = localDay(dayOffset);
  const returnAt = localDay(dayOffset + 1);

  // 1. Client creates a round-trip booking.
  const clientCtx = await browser.newContext();
  const client = await clientCtx.newPage();
  await signInAs(client, "client@example.com");
  await client.goto("/new");
  await client.getByTestId("trip-type-ROUND_TRIP").click();
  await client.getByTestId("origin-select").selectOption({ index: 1 });
  await client.getByTestId("destination-select").selectOption({ index: 2 });
  await client.getByTestId("outbound-datetime").fill(outboundAt);
  await client.getByTestId("return-datetime").fill(returnAt);
  await client.getByTestId("booking-submit").click();
  await client.waitForURL("**/bookings/**");
  const bookingId = client.url().split("/bookings/")[1];
  expect(bookingId).toBeTruthy();

  // 2. Operator prices the booking and 3. assigns a driver+vehicle per trip.
  const opCtx = await browser.newContext();
  const op = await opCtx.newPage();
  await signInAs(op, "operator@example.com");
  await op.goto(`/dashboard/bookings/${bookingId}`);
  await op.getByTestId("agreed-price-input").fill("250");
  await op.getByTestId("agreed-price-submit").click();
  await expect(op.getByTestId("operator-booking-status")).toHaveText("PRICED");

  const rows = op.locator('[data-testid^="assignment-row-"]');
  const rowCount = await rows.count();
  expect(rowCount).toBe(2);

  // Assign each trip to a known seeded driver by name, capturing the trip id so
  // the driver step can target this booking's exact trip (drivers accumulate
  // trips across runs).
  const assignments: { email: string; tripId: string }[] = [];
  const driverByRow = [
    { label: "Dana Driver", email: "driver.a@example.com" },
    { label: "Blake Driver", email: "driver.b@example.com" },
  ];

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const testId = (await row.getAttribute("data-testid")) ?? "";
    const tripId = testId.replace("assignment-row-", "");
    await row.locator("select").first().selectOption({ label: driverByRow[i].label });
    await row.locator("select").nth(1).selectOption({ index: 1 });
    await row.locator('[data-testid^="assign-submit-"]').click();
    await expect(row).toContainText("ASSIGNED");
    assignments.push({ email: driverByRow[i].email, tripId });
  }

  // 4. Each driver advances their own trip to COMPLETED.
  for (const { email, tripId } of assignments) {
    const ctx = await browser.newContext();
    const driver = await ctx.newPage();
    await signInAs(driver, email);
    await driver.goto("/driver/trips");

    const statusBadge = driver.getByTestId(`driver-trip-status-${tripId}`);
    const advance = driver.getByTestId(`driver-trip-advance-${tripId}`);

    // Advance ASSIGNED -> IN_PROGRESS -> COMPLETED for this booking's trip.
    await expect(statusBadge).toHaveText("ASSIGNED");
    await advance.click();
    await expect(statusBadge).toHaveText("IN_PROGRESS");
    await advance.click();
    await expect(statusBadge).toHaveText("COMPLETED");
    await ctx.close();
  }

  // 5. Booking is COMPLETED.
  await op.reload();
  await expect(op.getByTestId("operator-booking-status")).toHaveText("COMPLETED");
});
