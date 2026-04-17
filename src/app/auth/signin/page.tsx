"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import PasswordInput from "@/components/auth/password-input";
import { useAuth } from "@/context/auth-context";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { setAuth } = useAuth();

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      // If already authenticated via sessionStorage, redirect to dashboard
      const storedRole = sessionStorage.getItem("userRole");
      if (storedRole) {
        const dashboardPath = getRolePathFromRole(storedRole);
        window.location.replace(dashboardPath);
        return;
      }

      // Only clear stale cookies if the user is NOT authenticated
      // (i.e. they intentionally navigated to signin or their session expired)
      document.cookie = "sessionToken=; path=/; max-age=0";
      document.cookie = "authToken=; path=/; max-age=0";
      document.cookie = "userEmail=; path=/; max-age=0";
    }

    // Disable browser back-button caching for auth pages
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
    const password = (formData.get("password") as string) || "";

    try {
      if (!email || !password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Authenticate against the server
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      const userRole = data.user?.role || "user";
      const redirectPath = getRolePathFromRole(userRole);

      // Update auth context state
      setAuth(email, userRole);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("userRole", userRole);
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("authTimestamp", Date.now().toString());

        window.location.href = redirectPath;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again."
      );
      console.error("Sign in error:", err);
      setLoading(false);
    }
  }

  /**
   * Get the appropriate dashboard path from a role string
   */
  function getRolePathFromRole(role: string): string {
    switch (role) {
      case "admin":
        return "/admin";
      case "staff":
        return "/staff";
      case "user":
      default:
        return "/";
    }
  }

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <main className="min-h-screen bg-[#0f0f12] flex items-center justify-center px-4 py-12 pt-20 sm:pt-24 lg:pt-28">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-600/3 via-transparent to-blue-600/3 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-white font-bold text-xl">ADR Autoparts</span>
          </Link>
        </div>

        <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm">
              Sign in to your ADR Autoparts account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <PasswordInput
                name="password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a35]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#16161d] px-3 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/api/auth/google"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-sm text-gray-300 hover:bg-[#252530] hover:border-[#3a3a45] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </a>
            <span
              title="Coming soon"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-sm text-gray-500 opacity-50 cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
              <span className="text-[10px] text-gray-600">(Soon)</span>
            </span>
          </div>

          {/* Demo Credentials Section */}
          <div className="mt-6 p-4 bg-[#1e1e28] rounded-xl border border-[#2a2a35]">
            <p className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              Demo Credentials (Click to autofill)
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={(e) => {
                  const form = (e.currentTarget.closest(".bg-\\[\\#16161d\\]") as HTMLElement)?.querySelector("form");
                  if (form) {
                    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
                    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                    if (emailInput) emailInput.value = "admin@adrautoparts.com";
                    if (passwordInput) passwordInput.value = "admin123";
                  }
                }}
                className="w-full text-left px-3 py-2 bg-[#16161d] hover:bg-[#252530] rounded-lg text-xs transition-colors cursor-pointer border border-transparent hover:border-[#2a2a35]"
              >
                <span className="font-semibold text-red-400">Admin:</span>{" "}
                <span className="text-gray-400">admin@adrautoparts.com</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  const form = (e.currentTarget.closest(".bg-\\[\\#16161d\\]") as HTMLElement)?.querySelector("form");
                  if (form) {
                    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
                    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                    if (emailInput) emailInput.value = "staff@adrautoparts.com";
                    if (passwordInput) passwordInput.value = "staff123";
                  }
                }}
                className="w-full text-left px-3 py-2 bg-[#16161d] hover:bg-[#252530] rounded-lg text-xs transition-colors cursor-pointer border border-transparent hover:border-[#2a2a35]"
              >
                <span className="font-semibold text-blue-400">Staff:</span>{" "}
                <span className="text-gray-400">staff@adrautoparts.com</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  const form = (e.currentTarget.closest(".bg-\\[\\#16161d\\]") as HTMLElement)?.querySelector("form");
                  if (form) {
                    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
                    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                    if (emailInput) emailInput.value = "user@adrautoparts.com";
                    if (passwordInput) passwordInput.value = "user123";
                  }
                }}
                className="w-full text-left px-3 py-2 bg-[#16161d] hover:bg-[#252530] rounded-lg text-xs transition-colors cursor-pointer border border-transparent hover:border-[#2a2a35]"
              >
                <span className="font-semibold text-emerald-400">User:</span>{" "}
                <span className="text-gray-400">user@adrautoparts.com</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Password: Any 6+ characters</p>
          </div>

          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
            <Link href="/" className="block text-gray-600 hover:text-gray-400 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
