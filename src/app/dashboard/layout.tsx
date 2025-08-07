// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/components/Sidebar";

// // Utility function to get token from localStorage
// function getTokenFromStorage(key: string): string | null {
//   if (typeof window === "undefined") return null;

//   try {
//     return localStorage.getItem(key);
//   } catch (error) {
//     console.error("Error reading from localStorage:", error);
//     return null;
//   }
// }

// // Function to remove token from localStorage
// function removeTokenFromStorage(key: string): void {
//   if (typeof window === "undefined") return;

//   try {
//     localStorage.removeItem(key);
//   } catch (error) {
//     console.error("Error removing from localStorage:", error);
//   }
// }

// // Optional: Function to validate token format (customize based on your token structure)
// function isValidToken(token: string): boolean {
//   try {
//     // Basic checks - customize based on your needs
//     if (!token || token.length < 10) return false;
//     return true;
//   } catch {
//     return false;
//   }
// }

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = () => {
//       try {
//         // Get token from localStorage
//         const token = getTokenFromStorage("accesstoken");
//         console.log("Token from localStorage:", token);

//         if (!token) {
//           setIsAuthenticated(false);
//           setIsLoading(false);
//           return;
//         }

//         // Validate token
//         if (isValidToken(token)) {
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//           // Remove invalid token
//           removeTokenFromStorage("accesstoken");
//           removeTokenFromStorage("refreshtoken");
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated === false && !isLoading) {
//       // Redirect to login page
//       router.push("/auth/login");
//     }
//   }, [isAuthenticated, isLoading, router]);
//   // Authenticated - render dashboard
//   return (
//     <div className="md:flex">
//       <Sidebar />
//       <div className="md:flex-1 h-screen lg:w-[20rem] w-full">{children}</div>
//     </div>
//   );
// }

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
    document.cookie = "accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (error) {
    console.error("Error removing cookie:", error);
  }
}

// Optional: Function to validate token format
function isValidToken(token: string): boolean {
  try {
    // Basic checks - customize based on your needs
    if (!token || token.length < 10) return false;
    // You can add more validation like JWT format check, expiry check, etc.
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
        console.log("Token from localStorage:", token);

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate token
        if (isValidToken(token)) {
          // Set token in cookie for middleware access
          setTokenInCookie(token);
          
          // Optional: Verify token with your backend
          // const response = await fetch("/api/auth/verify", {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          // if (response.ok) {
          //   setIsAuthenticated(true);
          // } else {
          //   throw new Error("Token verification failed");
          // }
          
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid token");
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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

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
