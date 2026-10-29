import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  HASH_SALT: z.string().min(16),
});

let cached: z.infer<typeof serverEnvSchema> | undefined;

/** Server-only secrets, validated on first use so builds don't need them. */
export function serverEnv() {
  cached ??= serverEnvSchema.parse({
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    HASH_SALT: process.env.HASH_SALT,
  });
  return cached;
}
