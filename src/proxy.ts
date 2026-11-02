import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/profile", "/my-bookings", "/dashboard"];

export function proxy(request: NextRequest) {
  const isProtected = protectedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

  const hasSessionCookie = request.cookies
    .getAll()
    .some(({ name, value }) => name.includes("session_token") && Boolean(value));
  if (hasSessionCookie) return NextResponse.next();

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/profile/:path*", "/my-bookings/:path*", "/dashboard/:path*"],
};