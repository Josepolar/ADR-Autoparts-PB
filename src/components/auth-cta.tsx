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
          <div className="bg-gradient-to-r from-cyber-blue-900 to-nardo-gray-800 border border-cyber-blue-700 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome, Administrator</h2>
            <p className="text-text-secondary mb-8">
              Access your admin dashboard to manage users, inventory, and system settings.
            </p>
            <Link href="/admin" className="btn-primary">
              Go to Admin Dashboard
            </Link>
          </div>
        </section>
      );
    }

    if (userRole === "staff") {
      return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-cyber-blue-900 to-nardo-gray-800 border border-cyber-blue-700 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome, Staff Member</h2>
            <p className="text-text-secondary mb-8">
              Access your staff portal to manage bookings and service appointments.
            </p>
            <Link href="/staff" className="btn-primary">
              Go to Staff Portal
            </Link>
          </div>
        </section>
      );
    }

    // User is authenticated and has "user" role
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-cyber-blue-900 to-nardo-gray-800 border border-cyber-blue-700 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-text-secondary mb-8">
            Access your account to view orders, bookings, and manage your vehicles.
          </p>
          <Link href="/user" className="btn-primary">
            Go to My Account
          </Link>
        </div>
      </section>
    );
  }

  // Not authenticated - show sign up CTA
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-cyber-blue-900 to-nardo-gray-800 border border-cyber-blue-700 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-text-secondary mb-8">
          Create an account to access all three modules and manage your vehicles,
          orders, and appointments in one place.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/signup" className="btn-primary">
            Create Account
          </Link>
          <Link href="/auth/signin" className="btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AuthCTA;
