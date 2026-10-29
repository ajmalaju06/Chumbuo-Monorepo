import { SignOutButton } from "@/components/forms/SignOutButton";
import { getAuthState } from "@/lib/auth/session";

export async function UserMenu() {
  const state = await getAuthState();
  if (state.status !== "signed-in") return null;
  return (
    <div className="flex items-center gap-5">
      <span className="hidden text-sm sm:inline">
        {state.user.displayName}
        {state.user.role && (
          <span className="ml-2 text-meta text-ink-muted">{state.user.role}</span>
        )}
      </span>
      <SignOutButton />
    </div>
  );
}
