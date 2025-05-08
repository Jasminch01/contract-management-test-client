"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import localFont from "next/font/local";
import Sidebar from "@/components/Sidebar";

const satoshiFont = localFont({
  src: [
    {
      path: "../asset/font/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../asset/font/Satoshi-Bold.otf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../asset/font/Satoshi-Medium.otf",
      weight: "600",
      style: "medium",
    },
    {
      path: "../asset/font/Satoshi-Light.otf",
      weight: "300",
      style: "light",
    },
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status from cookies
    const authToken = document.cookie.includes("auth-token");
    setIsAuthenticated(authToken);

    // Redirect logic
    if (!authToken && !pathname.startsWith("/login")) {
      router.push("/login");
    } else if (authToken && pathname.startsWith("/login")) {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <link rel="shortcut icon" href="/Favicon.png" type="image/x-icon" />
      <body className={satoshiFont.className}>
        {isAuthenticated ? (
          <div className="md:flex h-screen bg-gray-50">
            <Sidebar />
            <div className="md:flex-1 h-full w-full xl:w-[30rem]">
              {children}
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50">{children}</div>
        )}
      </body>
    </html>
  );
}
