"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/auth/password-input";

export default function SignUpPage() {
  const router = useRouter();
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
    <main className="min-h-screen bg-nardo-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-text-secondary">
              Join the ADR Autoparts community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <PasswordInput
                name="password"
                minLength={8}
                required
              />
              <p className="text-xs text-text-muted mt-1">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
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
              className="btn-primary w-full mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary mb-2">Already have an account?</p>
            <Link href="/auth/signin" className="text-cyber-blue hover:text-cyber-blue-400 font-semibold">
              Sign in here
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
