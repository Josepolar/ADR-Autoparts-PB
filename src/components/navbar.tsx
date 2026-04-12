"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";

/**
 * Global navbar component with authentication awareness
 * Shows different navigation based on user role
 * Hidden on /admin and /staff routes (they have their own navigation)
 */
export function Navbar() {
  const { userRole, userEmail, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide global navbar on admin/staff/user pages (they use sidebar navigation)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/staff") || pathname?.startsWith("/user")) {
    return null;
  }

  return (
    <nav className="bg-[#16161d] border-b border-[#2a2a35] sticky top-0 z-50">
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
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link
                    href="/staff"
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    Staff Portal
                  </Link>
                )}
                {userRole === "user" && (
                  <>
                    <Link
                      href="/orders"
                      className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/user"
                      className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                    >
                      My Account
                    </Link>
                  </>
                )}

                {/* User info */}
                <div className="flex items-center gap-4 border-l border-[#2a2a35] pl-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400 capitalize">
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
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400"
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
          <div className="md:hidden pb-4 border-t border-[#2a2a35]">
            {isAuthenticated ? (
              <>
                <div className="py-2 px-4 text-sm text-gray-500">
                  {userEmail}
                </div>
                <div className="py-2 px-4 capitalize text-sm text-gray-400">
                  Role: {userRole}
                </div>

                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link
                    href="/staff"
                    className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Staff Portal
                  </Link>
                )}
                {userRole === "user" && (
                  <>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/user"
                      className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </>
                )}

                <div className="px-4 py-2 border-t border-[#2a2a35] mt-2">
                  <LogoutButton variant="danger" size="sm" className="w-full" />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-2 text-red-400 hover:bg-[#1e1e28] transition-colors text-sm"
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
