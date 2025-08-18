"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// Utility function to get token from localStorage
function getTokenFromStorage(key: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

// Function to remove token from localStorage
function removeTokenFromStorage(key: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

// Function to set token in cookie (for middleware access)
function setTokenInCookie(token: string): void {
  if (typeof window === "undefined") return;

  try {
    // Set cookie that expires in 7 days
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `accesstoken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
}

// Function to remove token from cookie
function removeTokenFromCookie(): void {
  if (typeof window === "undefined") return;

  try {
    document.cookie =
      "accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (error) {
    console.error("Error removing cookie:", error);
  }
}

// Function to decode JWT token
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Function to validate token including expiration check
function isValidToken(token: string): boolean {
  try {
    // Basic checks
    if (!token || token.length < 10) return false;

    // Decode the token to check expiration
    const decoded = decodeJWT(token);
    if (!decoded) return false;

    // Check if token has expired
    if (decoded.exp && typeof decoded.exp === "number") {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        // console.log("Token has expired");
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = getTokenFromStorage("accesstoken");

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate token including expiration
        if (isValidToken(token)) {
          // Set token in cookie for middleware access
          setTokenInCookie(token);
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid or expired token");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        // Remove invalid tokens
        removeTokenFromStorage("accesstoken");
        removeTokenFromStorage("refreshtoken");
        removeTokenFromCookie();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && !isLoading) {
      // Redirect to login page
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while redirecting
  if (isAuthenticated === false) {
    return null;
  }

  // Authenticated - render dashboard
  return (
    <div className="md:flex">
      <Sidebar />
      <div className="md:flex-1 h-screen lg:w-[20rem] w-full">{children}</div>
    </div>
  );
}
