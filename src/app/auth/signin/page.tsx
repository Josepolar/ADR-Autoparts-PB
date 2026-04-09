"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/auth/password-input";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // TODO: Implement actual authentication with NextAuth
      // For MVP, redirect based on test role
      console.log("Sign in attempt:", { email, password });
      
      // Simulate role detection based on email for MVP
      // In production, this would come from the JWT token
      let redirectPath = "/user"; // Default to user dashboard
      
      if ((email as string)?.includes("admin")) {
        redirectPath = "/admin";
      } else if ((email as string)?.includes("staff")) {
        redirectPath = "/staff";
      }
      
      router.push(redirectPath);
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-2 rounded-lg">
                {error}
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <PasswordInput
                name="password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

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
