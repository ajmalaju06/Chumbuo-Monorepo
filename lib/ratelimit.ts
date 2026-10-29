import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { serverEnv } from "@/lib/env.server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Salted hash so raw IPs and emails never reach the database. */
export function hashIdentifier(value: string): string {
  return createHash("sha256").update(`${serverEnv().HASH_SALT}:${value}`).digest("hex");
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Counts one attempt against each key and reports whether all are still
 * within `limit` per `windowSeconds`. Fails closed if the limiter is down.
 */
export async function rateLimit(
  scope: string,
  identifiers: string[],
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const supabase = createAdminClient();
  const results = await Promise.all(
    identifiers.map((id) =>
      supabase.rpc("hit_rate_limit", {
        p_key: `${scope}:${hashIdentifier(id)}`,
        p_limit: limit,
        p_window_seconds: windowSeconds,
      }),
    ),
  );
  return results.every(({ data, error }) => !error && data === true);
}
