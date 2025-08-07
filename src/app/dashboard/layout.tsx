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

// Optional: Function to validate token format (customize based on your token structure)
function isValidToken(token: string): boolean {
  try {
    // Basic checks - customize based on your needs
    if (!token || token.length < 10) return false;
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
    const checkAuth = () => {
      try {
        // Get token from localStorage
        const token = getTokenFromStorage("accesstoken");
        console.log("Token from localStorage:", token);

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate token
        if (isValidToken(token)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Remove invalid token
          removeTokenFromStorage("accesstoken");
          removeTokenFromStorage("refreshtoken");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
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
  // Authenticated - render dashboard
  return (
    <div className="md:flex">
      <Sidebar />
      <div className="md:flex-1 h-screen lg:w-[20rem] w-full">{children}</div>
    </div>
  );
}
