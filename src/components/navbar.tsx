"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

const quickLinks = [
  { label: "ECU Firmware", href: "/autoecu", tag: "AutoECU" },
  { label: "Brake Pads", href: "/parts", tag: "Parts" },
  { label: "Oil Change", href: "/rapide", tag: "Service" },
  { label: "Performance Tuning", href: "/autoecu", tag: "AutoECU" },
  { label: "Air Filters", href: "/parts", tag: "Parts" },
  { label: "Wheel Alignment", href: "/rapide", tag: "Service" },
];

const placeholders = [
  "Search parts, firmware, or services...",
  "Try \"brake pads\" or \"ECU tune\"...",
  "What does your car need today?",
];

const tagColors: Record<string, string> = {
  AutoECU: "bg-red-500/10 text-red-400",
  Parts: "bg-blue-500/10 text-blue-400",
  Service: "bg-amber-500/10 text-amber-400",
};

export function Navbar() {
  const { userRole, userEmail, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close search on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Hide global navbar on admin/staff/user pages (they use sidebar navigation)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/staff") || pathname?.startsWith("/user")) {
    return null;
  }

  const filtered = searchQuery.length > 0
    ? quickLinks.filter((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : quickLinks;

  function handleSearchSelect(href: string) {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/parts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  return (
    <nav className="bg-[#16161d]/95 border-b border-[#2a2a35] sticky top-0 z-50 backdrop-blur-xl supports-[backdrop-filter]:bg-[#16161d]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/logo.png"
              alt="ADR Autoparts"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              priority
            />
            <span className="text-white font-bold text-lg hidden sm:block">
              ADR Autoparts
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit}>
              <div
                className={`relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-text ${
                  searchOpen
                    ? "bg-[#1e1e28] border-[#3a3a45] shadow-lg shadow-black/10"
                    : "bg-[#1e1e28]/60 border-[#2a2a35] hover:border-[#3a3a45]"
                }`}
                onClick={() => {
                  setSearchOpen(true);
                  searchInputRef.current?.focus();
                }}
              >
                <Search className={`w-4 h-4 shrink-0 transition-colors duration-200 ${searchOpen ? "text-red-400" : "text-gray-500"}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder={placeholders[placeholderIdx]}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none min-w-0"
                />
                {!searchOpen && (
                  <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-[#252530] rounded border border-[#2a2a35]">
                    /
                  </kbd>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#16161d] border border-[#2a2a35] rounded-xl shadow-2xl shadow-black/30 overflow-hidden z-50">
                <div className="px-3.5 py-2 border-b border-[#2a2a35]/60">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {searchQuery ? "Results" : "Popular"}
                  </span>
                </div>
                <div className="py-1 max-h-56 overflow-y-auto">
                  {filtered.length > 0 ? filtered.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleSearchSelect(item.href)}
                      className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-[#1e1e28] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Search className="w-3 h-3 text-gray-600" />
                        <span className="text-sm text-gray-300">{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${tagColors[item.tag] || ""}`}>
                        {item.tag}
                      </span>
                    </button>
                  )) : (
                    <div className="px-3.5 py-5 text-center text-xs text-gray-500">
                      No results for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
                <div className="px-3.5 py-1.5 border-t border-[#2a2a35]/60 flex items-center justify-between text-[10px] text-gray-600">
                  <span>â†µ Search parts</span>
                  <span>esc Close</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {userRole === "admin" && (
                  <Link href="/admin" className="text-gray-400 hover:text-red-400 transition-colors text-sm">Dashboard</Link>
                )}
                {userRole === "staff" && (
                  <Link href="/staff" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Staff Portal</Link>
                )}
                {userRole === "user" && (
                  <Link href="/user" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">My Account</Link>
                )}
                <div className="flex items-center gap-3 border-l border-[#2a2a35] pl-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-400 capitalize">{userRole}</span>
                  </div>
                  <LogoutButton variant="secondary" size="sm" showIcon={true} />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin" className="text-gray-400 hover:text-white transition-colors text-sm">Sign In</Link>
                <Link href="/auth/signup" className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: theme + menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#2a2a35]">
            {/* Mobile Search */}
            <form
              onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { router.push(`/parts?search=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery(""); setMobileMenuOpen(false); }}}
              className="px-4 py-3"
            >
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
              </div>
            </form>

            {isAuthenticated ? (
              <>
                <div className="py-1.5 px-4 text-xs text-gray-500">{userEmail}</div>
                <div className="py-1.5 px-4 capitalize text-xs text-gray-400">Role: {userRole}</div>
                {userRole === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                )}
                {userRole === "staff" && (
                  <Link href="/staff" className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Staff Portal</Link>
                )}
                {userRole === "user" && (
                  <>
                    <Link href="/orders" className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                    <Link href="/user" className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                  </>
                )}
                <div className="px-4 py-2 border-t border-[#2a2a35] mt-2">
                  <LogoutButton variant="danger" size="sm" className="w-full" />
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block px-4 py-2 text-gray-400 hover:bg-[#1e1e28] transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/signup" className="block px-4 py-2 text-red-400 hover:bg-[#1e1e28] transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
