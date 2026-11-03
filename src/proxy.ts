import { NextResponse, type NextRequest } from "next/server";

// Private routes: only a signed-in user may open them.
const protectedPaths = [
  "/profile",
  "/my-bookings",
  "/dashboard",
  "/add-studio",
  "/my-listings",
  "/studios/edit",
];

export function proxy(request: NextRequest) {
  const isProtected = protectedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

  // better-auth keeps the session JWT in an HTTPOnly cookie.
  const hasSessionCookie = request.cookies
    .getAll()
    .some(({ name, value }) => name.includes("session_token") && Boolean(value));
  if (hasSessionCookie) return NextResponse.next();

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/my-bookings/:path*",
    "/dashboard/:path*",
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/studios/edit/:path*",
  ],
};
