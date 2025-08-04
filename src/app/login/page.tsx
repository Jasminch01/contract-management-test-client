"use client";
import { userLogin } from "@/api/Auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const data = await userLogin(email, password);
      if (data.data) {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5] p-4">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-32 w-full">
        {/* Left decorative image - hidden on mobile */}
        <div className="hidden lg:block mt-10">
          <Image src={"/deg1.png"} width={400} height={400} alt="design" />
        </div>

        {/* Main login form */}
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-6 shadow-xl rounded-lg border-t-4 border-[#9586E0] w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Image
                src={"/Frame.png"}
                alt="logo"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              Sign in
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
              Enter your details to sign in to your account
            </p>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5D36] focus:ring-[#2A5D36] text-xs sm:text-sm p-2 sm:p-2.5 border"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5D36] focus:ring-[#2A5D36] text-xs sm:text-sm p-2 sm:p-2.5 border"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 sm:h-4 sm:w-4 text-[#2A5D36] focus:ring-[#2A5D36] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-xs text-[#2A5D36] hover:text-[#1e4a2a]"
                onClick={() => {
                  // Handle forgot password
                  console.log("Forgot password clicked");
                }}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 sm:py-2.5 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#2A5D36] hover:bg-[#1e4a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A5D36] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right decorative image - hidden on mobile */}
        <div className="hidden lg:block">
          <Image src={"/deg2.png"} width={400} height={400} alt="design" />
        </div>
      </div>
    </div>
  );
}
