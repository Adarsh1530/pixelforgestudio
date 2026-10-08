import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "pixelforge_super_secret_jwt_key_2026_change_in_production"
);

const AUTH_COOKIE_NAME = "pf_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If already logged in, redirect away from /admin/login to /admin
  if (pathname === "/admin/login") {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // Invalid token, proceed to login page
      }
    }
    return NextResponse.next();
  }

  // Allow auth API routes & public enquiries
  if (pathname.startsWith("/api/auth/") || pathname === "/api/enquiries") {
    return NextResponse.next();
  }

  // Allow /admin/mobile to render (manages authentication client-side with persistent storage)
  if (pathname === "/admin/mobile") {
    return NextResponse.next();
  }

  // Protect all /admin pages and /api/admin/* endpoints
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value || bearerToken;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
