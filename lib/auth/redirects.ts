/**
 * Accepts only same-origin relative paths so `?next=` can't send people to
 * another site after signing in.
 */
export function safeNextPath(value: unknown, fallback = "/admin"): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  try {
    const url = new URL(value, "http://chumbuo.local");
    if (url.origin !== "http://chumbuo.local") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
