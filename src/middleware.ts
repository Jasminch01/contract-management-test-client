// // middleware.ts - For routes like /auth/login, /auth/register
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const authToken = request.cookies.get("accesstoken")?.value;
//   console.log(authToken);
//   const pathname = request.nextUrl.pathname;

//   const isLoginPage = pathname === "/auth/login";
//   const isRegisterPage = pathname === "/auth/register";
//   const isAuthPage = isLoginPage || isRegisterPage;
//   const isRootPage = pathname === "/";

//   // Skip middleware for static files and API routes
//   if (
//     pathname.startsWith("/_next") || // Next.js internal files
//     pathname.includes(".") || // Files with extensions (e.g., .css, .js, .png)
//     pathname.startsWith("/favicon.ico") || // Favicon
//     pathname.startsWith("/api") // API routes
//   ) {
//     return NextResponse.next();
//   }

//   // Handle root page "/" redirect
//   if (isRootPage) {
//     if (authToken) {
//       // Authenticated user - redirect to dashboard
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     } else {
//       // Not authenticated - redirect to login
//       return NextResponse.redirect(new URL("/auth/login", request.url));
//     }
//   }

//   // If not authenticated and trying to access protected routes
//   if (!authToken && !isAuthPage) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   // If authenticated but trying to access auth pages
//   if (authToken && isAuthPage) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// // import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// // const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

// // export default clerkMiddleware(async (auth, req) => {
// //   if (!isPublicRoute(req)) {
// //     await auth.protect()
// //   }
// // })

// // export const config = {
// //   matcher: [
// //     // Skip Next.js internals and all static files, unless found in search params
// //     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
// //     // Always run for API routes
// //     '/(api|trpc)(.*)',
// //   ],
// // }

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Redirect root to login page
//   if (pathname === "/") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, } = await auth();

//   console.log(userId)

//   // If user is on root path
//   if (req.nextUrl.pathname === '/') {
//     if (userId) {
//       // User exists - redirect to dashboard
//       return NextResponse.redirect(new URL('/dashboard', req.url));
//     } else {
//       // No user - redirect to login
//       return NextResponse.redirect(new URL('/auth/login', req.url));
//     }
//   }

//   // Protect dashboard route - redirect to login if no user
//   if (req.nextUrl.pathname.startsWith('/dashboard')) {
//     if (!userId) {
//       return NextResponse.redirect(new URL('/auth/login', req.url));
//     }
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is on root path
  if (req.nextUrl.pathname === "/") {
    if (userId) {
      // User exists - redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      // No user - redirect to login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // If logged-in user tries to access auth pages, redirect to dashboard
  if (req.nextUrl.pathname.startsWith("/auth")) {
    if (userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect dashboard route - redirect to login if no user
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!userId) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
