import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type Client = SupabaseClient<Database>;

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const options = { auth: { persistSession: false, autoRefreshToken: false } };

export const service = (): Client =>
  createClient<Database>(url(), process.env.SUPABASE_SECRET_KEY!, options);
export const anon = (): Client =>
  createClient<Database>(url(), process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, options);

export const PASSWORD = "Test-Passw0rd-123";

/** Creates a confirmed user with the given role and returns a client signed in as them. */
export async function userWithRole(role: "admin" | "editor" | null) {
  const admin = service();
  const email = `test-${role ?? "none"}-${randomUUID().slice(0, 8)}@chumbuo.test`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  if (role) {
    const { error: roleError } = await admin
      .from("user_roles")
      .insert({ user_id: data.user.id, role });
    if (roleError) throw roleError;
  }
  const client = anon();
  const { error: signInError } = await client.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (signInError) throw signInError;
  return { id: data.user.id, email, client };
}

export async function deleteUsers(ids: string[]) {
  const admin = service();
  for (const id of ids) await admin.auth.admin.deleteUser(id);
}

export const slug = (prefix: string) => `${prefix}-${randomUUID().slice(0, 8)}`;
