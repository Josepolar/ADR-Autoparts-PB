"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import PasswordInput from "@/components/auth/password-input";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set cache-control headers to prevent back-button logout
    // This is handled by the page itself for client-side security
    if (typeof window !== "undefined") {
      // Disable browser back-button caching for auth pages
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
      
      // Store role in sessionStorage for client-side access control
      if (typeof window !== "undefined") {
        const userRole = detectUserRole(email);
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
   * In production: extract from JWT token claims
   */
  function detectUserRole(email: string): "admin" | "staff" | "user" {
    const emailLower = email.toLowerCase();
    
    switch (true) {
      case emailLower.includes("admin"):
        return "admin";
      case emailLower.includes("staff"):
        return "staff";
      default:
        return "user";
    }
  }

  /**
   * Get the appropriate dashboard path based on user role
   * Uses switch statement for clear role-to-path mapping
   */
  function getRolePath(email: string): string {
    const role = detectUserRole(email);

    switch (role) {
      case "admin":
        return "/admin";
      case "staff":
        return "/staff";
      case "user":
      default:
        return "/user";
    }
  }

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <main className="min-h-screen bg-nardo-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-text-secondary">
              Welcome back to ADR Autoparts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg text-sm">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <PasswordInput
                name="password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-6 p-4 bg-nardo-gray-800 rounded-lg border border-nardo-gray-700">
            <p className="text-xs font-semibold text-nardo-gray-300 mb-3">🔐 Demo Credentials (Click to autofill):</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={(e) => {
                  const form = (e.currentTarget.closest("form") as HTMLFormElement) || 
                    document.querySelector("form");
                  if (form) {
                    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
                    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                    if (emailInput) emailInput.value = "admin@adrautoparts.com";
                    if (passwordInput) passwordInput.value = "admin123";
                  }
                }}
                className="w-full text-left px-2 py-1.5 bg-nardo-gray-700 hover:bg-nardo-gray-600 rounded text-xs transition-colors"
              >
                <span className="font-semibold text-cyber-orange">Admin:</span>{" "}
                <span className="text-nardo-gray-300">admin@adrautoparts.com</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  const form = (e.currentTarget.closest("form") as HTMLFormElement) || 
                    document.querySelector("form");
                  if (form) {
                    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
                    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                    if (emailInput) emailInput.value = "staff@adrautoparts.com";
                    if (passwordInput) passwordInput.value = "staff123";
                  }
                }}
                className="w-full text-left px-2 py-1.5 bg-nardo-gray-700 hover:bg-nardo-gray-600 rounded text-xs transition-colors"
              >
                <span className="font-semibold text-cyber-blue">Staff:</span>{" "}
                <span className="text-nardo-gray-300">staff@adrautoparts.com</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  const form = (e.currentTarget.closest("form") as HTMLFormElement) || 
                    document.querySelector("form");
                  if (form) {
                    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
                    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
                    if (emailInput) emailInput.value = "user@adrautoparts.com";
                    if (passwordInput) passwordInput.value = "user123";
                  }
                }}
                className="w-full text-left px-2 py-1.5 bg-nardo-gray-700 hover:bg-nardo-gray-600 rounded text-xs transition-colors"
              >
                <span className="font-semibold text-vibrant-red">User:</span>{" "}
                <span className="text-nardo-gray-300">user@adrautoparts.com</span>
              </button>
            </div>
            <p className="text-xs text-nardo-gray-500 mt-2">Password: Any 6+ characters</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-text-secondary mb-2">Don&apos;t have an account?</p>
            <Link href="/auth/signup" className="text-cyber-blue hover:text-cyber-blue-400 font-semibold">
              Create one here
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-text-secondary hover:text-text-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
