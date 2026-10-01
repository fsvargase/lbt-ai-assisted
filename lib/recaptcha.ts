import "server-only";
import { env } from "@/lib/env";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const TIMEOUT_MS = 4000;

interface VerifyOptions {
  action?: string;
  minScore?: number;
}

interface SiteVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

/**
 * Verify a reCAPTCHA v3 token server-side. Fails closed (returns false) on any
 * network/parse error, invalid token, or score below the threshold.
 */
export async function verifyRecaptcha(
  token: string,
  opts: VerifyOptions = {},
): Promise<boolean> {
  if (env.NODE_ENV !== "production" && env.RECAPTCHA_BYPASS) return true;
  if (!token) return false;

  const minScore = opts.minScore ?? env.RECAPTCHA_MIN_SCORE;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
      signal: controller.signal,
    });

    if (!res.ok) return false;

    const data = (await res.json()) as SiteVerifyResponse;
    if (!data.success) return false;
    if (opts.action && data.action && data.action !== opts.action) return false;
    if (typeof data.score === "number" && data.score < minScore) return false;

    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
