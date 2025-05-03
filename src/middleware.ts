// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // Skip middleware for static files
  if (
    request.nextUrl.pathname.startsWith("/_next") || // Next.js internal files
    request.nextUrl.pathname.includes(".") || // Files with extensions (e.g., .css, .js)
    request.nextUrl.pathname.startsWith("/favicon.ico") // Favicon
  ) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected routes
  if (!authToken && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated but trying to access login page
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
