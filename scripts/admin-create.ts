/**
 * Grants dashboard access. The only way to create the first admin, and runs
 * with the service role, so it never ships to the browser.
 *
 *   pnpm admin:create <email> [--role admin|editor] [--name "Display Name"]
 *
 * New addresses get an invitation email (which also verifies the address);
 * the link lets them choose a password. Existing users just get the role.
 */
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "../lib/supabase/database.types";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    role: { type: "string", default: "admin" },
    name: { type: "string" },
  },
});

const input = z
  .object({
    email: z.email().transform((e) => e.toLowerCase()),
    role: z.enum(["admin", "editor"]),
    name: z.string().trim().max(120).optional(),
  })
  .safeParse({ email: positionals[0], role: values.role, name: values.name });

if (!input.success) {
  console.error('Usage: pnpm admin:create <email> [--role admin|editor] [--name "Display Name"]');
  process.exit(1);
}

const env = z
  .object({
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    SUPABASE_SECRET_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.url(),
  })
  .safeParse(process.env);

if (!env.success) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY or NEXT_PUBLIC_SITE_URL (see .env.example).",
  );
  process.exit(1);
}

const { email, role, name } = input.data;
const supabase = createClient<Database>(
  env.data.NEXT_PUBLIC_SUPABASE_URL,
  env.data.SUPABASE_SECRET_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);

async function findUserId(address: string): Promise<string | null> {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === address);
    if (match) return match.id;
    if (data.users.length < 200) return null;
  }
}

async function main() {
  let userId = await findUserId(email);
  let invited = false;

  if (!userId) {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: name ? { display_name: name } : undefined,
      redirectTo: `${env.data!.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });
    if (error) throw error;
    userId = data.user.id;
    invited = true;
  } else if (name) {
    await supabase.from("profiles").update({ display_name: name }).eq("id", userId);
  }

  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role }, { onConflict: "user_id,role", ignoreDuplicates: true });
  if (roleError) throw roleError;

  await supabase.from("audit_logs").insert({
    action: "role.granted",
    entity_type: "user",
    entity_id: userId,
    metadata: { role, via: "cli" },
  });

  console.log(`✓ ${email} has the ${role} role.`);
  if (invited) {
    console.log("  An invitation email is on its way; the link lets them choose a password.");
    if (
      env.data!.NEXT_PUBLIC_SUPABASE_URL.includes("127.0.0.1") ||
      env.data!.NEXT_PUBLIC_SUPABASE_URL.includes("localhost")
    ) {
      console.log("  Local emails are caught by Mailpit: http://127.0.0.1:54324");
    }
  }
}

main().catch((error: unknown) => {
  console.error("✗", error instanceof Error ? error.message : error);
  process.exit(1);
});
