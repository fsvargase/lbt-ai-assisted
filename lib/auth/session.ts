import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Resolve the session, returning null instead of throwing when the JWT cookie
 * cannot be decoded (e.g. after rotating AUTH_SECRET). Prevents stale cookies
 * from crashing Server Components / Route Handlers.
 */
export async function getSafeSession(): Promise<Session | null> {
  try {
    return await auth();
  } catch {
    return null;
  }
}
