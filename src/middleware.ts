// middleware.ts - For routes like /auth/login, /auth/register
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/auth/login";
  const isRegisterPage = pathname === "/auth/register";
  const isAuthPage = isLoginPage || isRegisterPage;
  const isRootPage = pathname === "/";

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") || // Next.js internal files
    pathname.includes(".") || // Files with extensions (e.g., .css, .js, .png)
    pathname.startsWith("/favicon.ico") || // Favicon
    pathname.startsWith("/api") // API routes
  ) {
    return NextResponse.next();
  }

  // Handle root page "/" redirect
  if (isRootPage) {
    if (authToken) {
      // Authenticated user - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Not authenticated - redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // If not authenticated and trying to access protected routes
  if (!authToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If authenticated but trying to access auth pages
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
