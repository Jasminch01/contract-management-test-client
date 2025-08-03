"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call - replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On successful login:
      document.cookie = `auth-token=example-token; path=/; max-age=3600`;
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Invalid credentials");
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5D36] focus:ring-[#2A5D36] text-xs sm:text-sm p-2 sm:p-2.5 border"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5D36] focus:ring-[#2A5D36] text-xs sm:text-sm p-2 sm:p-2.5 border"
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
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-xs sm:text-sm">{error}</div>
            )}

            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 sm:py-2.5 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#2A5D36] hover:bg-[#1e4a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A5D36] disabled:opacity-50"
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

          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            Or <span className="text-xs sm:text-sm">Sign in with</span>
          </p>

          {/* Sign in with Google */}
          {/* <div className="mt-4 sm:mt-6 flex justify-center">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-1.5 px-3 sm:py-2 sm:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A5D36]"
            >
              <FcGoogle className="text-sm sm:text-base" />
              Google
            </button>
          </div> */}

          {/* Registration Link */}
          {/* <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-medium text-[#2A5D36] hover:text-[#1e4a2a] focus:outline-none"
                onClick={() => router.push("/register")}
              >
                Register now
              </button>
            </p>
          </div> */}
        </div>

        {/* Right decorative image - hidden on mobile */}
        <div className="hidden lg:block">
          <Image src={"/deg2.png"} width={400} height={400} alt="design" />
        </div>
      </div>
    </div>
  );
}
