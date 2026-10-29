import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Refreshes the Supabase session cookie and does an optimistic redirect for
// /admin. The real authorisation check runs in requireRole() on the server.
export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSession(request);

  if (!userId && request.nextUrl.pathname.startsWith("/admin")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    const redirect = NextResponse.redirect(login);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

// Public pages never read the session, so they skip the proxy entirely.
export const config = {
  matcher: [
    "/admin/:path*",
    "/login/:path*",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
  ],
};
