import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action="/auth/sign-out" method="post">
      <button
        type="submit"
        className={cn("min-h-11 text-meta underline-offset-4 hover:underline", className)}
      >
        Sign out
      </button>
    </form>
  );
}
