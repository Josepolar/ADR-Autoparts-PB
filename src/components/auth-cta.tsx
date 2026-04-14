"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";


/**
 * Auth-aware CTA section for landing page
 * Shows different buttons based on authentication state
 */
export function AuthCTA() {
  const { isAuthenticated, userRole } = useAuth();

  // If authenticated, show role-specific dashboard button
  if (isAuthenticated) {
    if (userRole === "admin") {
      return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Welcome, Administrator</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              Access your admin dashboard to manage users, inventory, and system settings.
            </p>
            <Link href="/admin" className="inline-flex px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-sm shadow-lg shadow-red-500/20">
              Go to Admin Dashboard
            </Link>
          </div>
        </section>
      );
    }

    if (userRole === "staff") {
      return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Welcome, Staff Member</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              Access your staff portal to manage bookings and service appointments.
            </p>
            <Link href="/staff" className="inline-flex px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-sm shadow-lg shadow-blue-500/20">
              Go to Staff Portal
            </Link>
          </div>
        </section>
      );
    }

    // User is authenticated and has "user" role
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Access your account to view orders, bookings, and manage your vehicles.
          </p>
          <Link href="/user" className="inline-flex px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm shadow-lg shadow-emerald-500/20">
            Go to My Account
          </Link>
        </div>
      </section>
    );
  }

  // Not authenticated - show sign up CTA
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
          Create an account to access all three modules and manage your vehicles,
          orders, and appointments in one place.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/auth/signup" className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-sm shadow-lg shadow-red-500/20">
            Create Account
          </a>
          <a href="/auth/signin" className="px-8 py-3 bg-[#1e1e28] border border-[#2a2a35] text-gray-300 font-semibold rounded-xl hover:bg-[#252530] transition-all text-sm">
            Sign In
          </a>
        </div>
      </div>
    </section>
  );
}

export default AuthCTA;
