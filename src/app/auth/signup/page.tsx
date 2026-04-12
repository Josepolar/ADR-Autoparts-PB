"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import PasswordInput from "@/components/auth/password-input";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = (formData.get("email") as string)?.toLowerCase().trim() || "";
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Call signup API to create user and set cookies
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // User created and cookies set by API
      // Store in sessionStorage for client-side access
      if (typeof window !== "undefined") {
        // New users are always CUSTOMER role, which maps to "user" internally
        sessionStorage.setItem("userRole", "user");
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("authTimestamp", Date.now().toString());
      }

      // Clear form
      try {
        const form = e.currentTarget as HTMLFormElement;
        if (form) {
          form.reset();
        }
      } catch (err) {
        console.debug("Form reset skipped:", err);
      }

      // Auto-login: Redirect to landing page
      // User is now logged in via cookies and sessionStorage
      window.location.href = "/";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
      console.error("Sign up error:", err);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f12] flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-600/3 via-transparent to-blue-600/3 pointer-events-none" />

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
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-500 text-sm">
              Join the ADR Autoparts community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <PasswordInput
                name="password"
                minLength={8}
                required
              />
              <p className="text-xs text-gray-600 mt-1.5">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <PasswordInput
                name="confirmPassword"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Sign in
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
