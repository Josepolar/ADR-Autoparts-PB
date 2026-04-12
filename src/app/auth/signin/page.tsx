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

    // If already authenticated, redirect to the appropriate dashboard
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("userRole");
      if (storedRole) {
        const dashboardPath = getRolePathFromRole(storedRole);
        window.location.href = dashboardPath;
        return;
      }
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
    const email = (formData.get("email") as string)?.trim() || "";
    const password = (formData.get("password") as string) || "";

    try {
      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      // Validate email format
      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Validate password length (MVP requirement)
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      console.log("Sign in attempt:", { email });
      
      // Simulate authentication delay (MVP)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // TODO: In production, call actual authentication API
      // const response = await fetch("/api/auth/signin", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      // if (!data.success) throw new Error(data.message);

      // Determine role-based redirect path using switch statement
      const redirectPath = getRolePath(email);
      const userRole = detectUserRole(email);

      // Call API to set session cookies (server-side)
      try {
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email, role: userRole }),
        });

        if (!response.ok) {
          throw new Error("Failed to set session cookies");
        }
      } catch (apiError) {
        console.error("Session cookie error:", apiError);
        setError("Failed to establish session");
        setLoading(false);
        return;
      }
      
      // Update auth context state
      setAuth(email, userRole);

      // Store role in sessionStorage for client-side access control
      if (typeof window !== "undefined") {
        sessionStorage.setItem("userRole", userRole);
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("authTimestamp", Date.now().toString());

        // Clear form before redirect (safely handle null)
        try {
          const form = e.currentTarget as HTMLFormElement;
          if (form) {
            form.reset();
          }
        } catch (err) {
          // Ignore form reset errors - we're redirecting anyway
          console.debug("Form reset skipped:", err);
        }

        // Use window.location for hard redirect to prevent back-button issues
        // This triggers a full page reload, preventing cached auth state
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
   * Detect user role based on email pattern
   * Production: Extract from verified JWT token claims
   */
  function detectUserRole(email: string): "admin" | "staff" | "user" {
    const emailLower = email.toLowerCase();
    
    switch (true) {
      case emailLower.includes("admin"):
        return "admin"; // Maps to ADMIN role
      case emailLower.includes("staff") || emailLower.includes("mechanic"):
        return "staff"; // Maps to MECHANIC role
      default:
        return "user"; // Maps to CUSTOMER role
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

  /**
   * Get the appropriate dashboard path based on user role
   * Redirects to role-specific dashboard after successful login
   */
  function getRolePath(email: string): string {
    const role = detectUserRole(email);
    return getRolePathFromRole(role);
  }

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <main className="min-h-screen bg-[#0f0f12] flex items-center justify-center px-4 py-12">
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
