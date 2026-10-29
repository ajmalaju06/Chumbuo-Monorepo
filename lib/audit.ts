import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";

/**
 * Records an admin action as the signed-in user. Never blocks the action it
 * describes: a failed log write is reported but not thrown.
 */
export async function audit(
  supabase: SupabaseClient<Database>,
  action: string,
  entityType: string,
  entityId?: string,
  metadata: Record<string, Json> = {},
) {
  const { error } = await supabase.rpc("log_audit", {
    p_action: action,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_metadata: metadata,
  });
  // 42501: the account has no staff role, so there's nothing to audit.
  if (error && error.code !== "42501")
    console.error("audit log write failed", action, error.message);
}
