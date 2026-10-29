import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { highestRole, satisfiesRole, type Role } from "./roles";

export type StaffUser = {
  id: string;
  email: string;
  displayName: string;
  roles: Role[];
  role: Role;
};

type AuthState =
  | { status: "signed-out" }
  | { status: "needs-mfa"; userId: string }
  | { status: "signed-in"; user: Omit<StaffUser, "role"> & { role: Role | null } };

/**
 * Reads and verifies the session once per request. Uses getUser(), which
 * checks the token with the auth server rather than trusting the cookie.
 */
export const getAuthState = cache(async (): Promise<AuthState> => {
  // Always per request: the auth client compares token expiry with the clock,
  // and a role change must take effect immediately, not after a cached window.
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };

  const [{ data: aal }, { data: roleRows }, { data: profile }] = await Promise.all([
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
  ]);

  // Enrolled in MFA but this session hasn't passed the second factor yet.
  if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
    return { status: "needs-mfa", userId: user.id };
  }

  const roles = (roleRows ?? []).map((row) => row.role);
  return {
    status: "signed-in",
    user: {
      id: user.id,
      email: user.email ?? "",
      displayName: profile?.display_name || user.email || "",
      roles,
      role: highestRole(roles),
    },
  };
});

/**
 * Gate for every admin page, server action and route handler. Redirects
 * instead of returning when the caller isn't allowed.
 */
export async function requireRole(min: Role, nextPath = "/admin"): Promise<StaffUser> {
  const state = await getAuthState();
  if (state.status === "signed-out") {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (state.status === "needs-mfa") {
    redirect(`/login/mfa?next=${encodeURIComponent(nextPath)}`);
  }
  const { user } = state;
  if (!user.role || !satisfiesRole(user.roles, min)) {
    redirect("/login?error=forbidden");
  }
  return { ...user, role: user.role };
}
