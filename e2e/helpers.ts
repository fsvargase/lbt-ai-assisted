import { Page } from "@playwright/test";

/** Sign in through the /signin UI using a seeded user (password: password123). */
export async function signInAs(page: Page, email: string) {
  await page.goto("/signin");
  await page.getByTestId("signin-email").fill(email);
  await page.getByTestId("signin-password").fill("password123");
  await page.getByTestId("signin-submit").click();
  // The form redirects to the callbackUrl on success; wait until we leave /signin.
  await page.waitForURL((url) => !url.pathname.startsWith("/signin"));
}
