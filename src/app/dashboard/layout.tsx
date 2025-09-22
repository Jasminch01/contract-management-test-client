"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@clerk/nextjs";
import { userLogin } from "@/api/Auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);

  const userEmail = user?.primaryEmailAddress?.emailAddress as string;
  const userId = user?.id as string;

  useEffect(() => {
    // Only run if Clerk is loaded and we have user data
    if (!isLoaded || !user || !userEmail || !userId || authCompleted) return;

    const userSignIn = async () => {
      if (isAuthenticating) return; // Prevent multiple simultaneous calls

      setIsAuthenticating(true);
      try {
        console.log("Attempting backend authentication...");
        const res = await userLogin(userEmail, userId);
        console.log("Backend authentication successful:", res);
        setAuthCompleted(true);
      } catch (error) {
        console.error("Backend authentication failed:", error);
        // You might want to handle this error - maybe redirect to login
        // or show an error message
      } finally {
        setIsAuthenticating(false);
      }
    };

    userSignIn();
  }, [isLoaded, user, userEmail, userId, authCompleted, isAuthenticating]); // Add dependencies

  // Show loading while Clerk is loading or while authenticating
  if (!isLoaded || (user && !authCompleted && isAuthenticating)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3">
          {!isLoaded ? "Loading..." : "Authenticating..."}
        </span>
      </div>
    );
  }

  // If no user after Clerk is loaded, let Clerk handle redirect
  if (!user) {
    return null;
  }

  // Render dashboard only after authentication is complete
  return (
    <div className="md:flex">
      <Sidebar />
      <div className="md:flex-1 h-screen lg:w-[20rem] w-full">{children}</div>
    </div>
  );
}
