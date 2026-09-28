import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Simple, dependency-free password hashing using scrypt (dev/credentials auth).
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return (
    keyBuffer.length === derived.length && timingSafeEqual(keyBuffer, derived)
  );
}
