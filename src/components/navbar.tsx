"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import LogoutButton from "@/components/auth/logout-button";

/**
 * Global navbar component with authentication awareness
 * Shows different navigation based on user role
 */
export function Navbar() {
  const { userRole, userEmail, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-xl">
            ADR Autoparts
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* Role-based links */}
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="text-nardo-gray-300 hover:text-cyber-blue-400 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link
                    href="/staff"
                    className="text-nardo-gray-300 hover:text-cyber-blue-400 transition-colors"
                  >
                    Staff Portal
                  </Link>
                )}
                {userRole === "user" && (
                  <>
                    <Link
                      href="/orders"
                      className="text-nardo-gray-300 hover:text-cyber-blue-400 transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/user"
                      className="text-nardo-gray-300 hover:text-cyber-blue-400 transition-colors"
                    >
                      My Account
                    </Link>
                  </>
                )}

                {/* User info */}
                <div className="flex items-center gap-4 border-l border-nardo-gray-700 pl-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-nardo-gray-400" />
                    <span className="text-sm text-nardo-gray-300 capitalize">
                      {userRole}
                    </span>
                  </div>
                  <LogoutButton variant="secondary" size="sm" showIcon={true} />
                </div>
              </>
            ) : (
              /* Not authenticated */
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/signin"
                  className="text-nardo-gray-300 hover:text-cyber-blue-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-cyber-blue-500 text-white rounded-lg hover:bg-cyber-blue-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-nardo-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-nardo-gray-700">
            {isAuthenticated ? (
              <>
                <div className="py-2 px-4 text-sm text-nardo-gray-400">
                  {userEmail}
                </div>
                <div className="py-2 px-4 capitalize text-sm text-nardo-gray-300">
                  Role: {userRole}
                </div>

                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-nardo-gray-300 hover:bg-nardo-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link
                    href="/staff"
                    className="block px-4 py-2 text-nardo-gray-300 hover:bg-nardo-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Staff Portal
                  </Link>
                )}
                {userRole === "user" && (
                  <>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-nardo-gray-300 hover:bg-nardo-gray-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/user"
                      className="block px-4 py-2 text-nardo-gray-300 hover:bg-nardo-gray-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </>
                )}

                <div className="px-4 py-2 border-t border-nardo-gray-700 mt-2">
                  <LogoutButton variant="danger" size="sm" className="w-full" />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2 text-nardo-gray-300 hover:bg-nardo-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-2 text-cyber-blue-400 hover:bg-nardo-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
