"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import LogoutButton from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

const centerLinks = [
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Maintenance", href: "#maintenance" },
];

const rightLinks = [
  { label: "Request Ticket", href: "#request-ticket" },
  { label: "Book Now", href: "#book-now" },
  { label: "Quotation", href: "#quotation" },
];

export function Navbar() {
  const { userRole, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/staff") ||
    pathname?.startsWith("/user")
  ) {
    return null;
  }

  function scrollTo(hash: string) {
    setMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push("/" + hash);
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-[#2a2a35]/60 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left — Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo.png"
              alt="ADR Auto Parts Trading"
              width={40}
              height={40}
              className="w-9 h-9 lg:w-10 lg:h-10 object-contain"
              priority
            />
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg leading-tight block">
                ADR Auto Parts
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">
                Trading
              </span>
            </div>
          </Link>

          {/* Center — Services, Products, Maintenance */}
          <div className="hidden lg:flex items-center gap-1">
            {centerLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right — Actions + Theme + Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {rightLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-3.5 py-1.5 text-sm font-medium text-gray-400 hover:text-white border border-transparent hover:border-[#2a2a35] rounded-lg transition-all duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="w-px h-5 bg-[#2a2a35] mx-1" />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link
                    href="/staff"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Staff
                  </Link>
                )}
                {userRole === "user" && (
                  <Link
                    href="/user"
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    My Dashboard
                  </Link>
                )}
                <LogoutButton variant="secondary" size="sm" showIcon={true} />
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white border border-[#2a2a35] hover:border-[#3a3a45] rounded-lg transition-all duration-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-[#2a2a35]/60 animate-fade-in">
            <div className="space-y-1 mb-4">
              <p className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest text-gray-600 font-medium">
                Navigate
              </p>
              {centerLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="space-y-1 border-t border-[#2a2a35]/40 pt-3">
              <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-widest text-gray-600 font-medium">
                Actions
              </p>
              {rightLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="border-t border-[#2a2a35]/40 pt-3 mt-3 px-3">
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="block py-2 text-sm text-red-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link
                    href="/staff"
                    className="block py-2 text-sm text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Staff Portal
                  </Link>
                )}
                {userRole === "user" && (
                  <Link
                    href="/user"
                    className="block py-2 text-sm text-emerald-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                )}
                <LogoutButton
                  variant="danger"
                  size="sm"
                  className="w-full mt-2"
                />
              </div>
            ) : (
              <div className="border-t border-[#2a2a35]/40 pt-3 mt-3 px-3 flex gap-2">
                <Link
                  href="/auth/signin"
                  className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-white/5 border border-[#2a2a35] rounded-lg hover:bg-white/10 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
