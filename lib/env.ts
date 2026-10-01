import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(1),
  RECAPTCHA_SECRET_KEY: z.string().min(1),
  RECAPTCHA_MIN_SCORE: z.coerce.number().min(0).max(1).default(0.5),
  // Non-production-only escape hatch for local/e2e runs. Ignored in production.
  RECAPTCHA_BYPASS: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

// Server-only environment. Never import this from a Client Component.
export const env = serverEnvSchema.parse(process.env);
