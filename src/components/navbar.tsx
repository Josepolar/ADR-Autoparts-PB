"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogIn, ChevronDown, ShoppingCart, Cpu, Wrench, Package, Disc, Droplets, Filter, CircleDot, Timer, Cog } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import LogoutButton from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

const shopCategories = [
  { label: "Brakes", value: "BRAKES", icon: Disc },
  { label: "Hoses", value: "HOSES", icon: Filter },
  { label: "Engine Oils", value: "ENGINE_OILS", icon: Droplets },
  { label: "ECU Units", value: "ECU_UNITS", icon: Cpu },
  { label: "Clock Springs", value: "CLOCK_SPRINGS", icon: CircleDot },
  { label: "Timing Belts", value: "TIMING_BELTS", icon: Timer },
  { label: "Injectors", value: "INJECTORS", icon: Cog },
];

const serviceLinks = [
  { label: "AutoECU Portal", desc: "ECU firmware & custom tuning", href: "/autoecu", icon: Cpu, color: "text-red-400", soon: false },
  { label: "Rapide Auto Care", desc: "Book a service appointment", href: "/rapide", icon: Wrench, color: "text-amber-400", soon: false },
  { label: "Mechanic On-Site", desc: "Mobile mechanic service", href: "#", icon: Package, color: "text-blue-400", soon: true },
];

export function Navbar() {
  const { userRole, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"shop" | "services" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/staff") ||
    pathname?.startsWith("/user")
  ) {
    return null;
  }

  function toggleDropdown(name: "shop" | "services") {
    setOpenDropdown(openDropdown === name ? null : name);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0f]/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/30"
          : "bg-[#0a0a0f]/70 backdrop-blur-xl"
      }`}
    >
      <div ref={navRef} className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Left â€” Brand */}
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
              <span className="text-white font-semibold text-sm lg:text-lg leading-tight block">
                ADR Auto Parts
              </span>
              <span className="text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">
                Trading
              </span>
            </div>
          </Link>

          {/* Center â€” Shop & Services dropdowns */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Shop Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("shop")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  openDropdown === "shop"
                    ? "text-white bg-white/[0.08]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Shop
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "shop" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "shop" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#111118]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 p-3 z-50">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-medium px-2 py-1.5 mb-1">
                    Product Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.value}
                        href={`/parts?category=${cat.value}`}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150 group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-500/[0.08] flex items-center justify-center shrink-0 group-hover:bg-blue-500/15 transition-colors">
                          <cat.icon className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span>{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.05] mt-2 pt-2">
                    <Link
                      href="/parts"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-all"
                    >
                      <span>View All Parts</span>
                      <span className="text-gray-500 text-xs">&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("services")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  openDropdown === "services"
                    ? "text-white bg-white/[0.08]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "services" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "services" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#111118]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 p-3 z-50">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-medium px-2 py-1.5 mb-1">
                    Our Services
                  </p>
                  {serviceLinks.map((svc) => (
                    <Link
                      key={svc.label}
                      href={svc.href}
                      onClick={() => !svc.soon && setOpenDropdown(null)}
                      className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 ${
                        svc.soon
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <svc.icon className={`w-4 h-4 ${svc.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{svc.label}</span>
                          {svc.soon && (
                            <span className="text-[9px] uppercase tracking-wider bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full font-medium">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{svc.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/parts"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              Parts
            </Link>
          </div>

          {/* Right â€” Cart + Theme + Auth */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">
                  {itemCount}
                </span>
              )}
            </Link>
            <div className="w-px h-5 bg-[#2a2a35] mx-1" />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {userRole === "admin" && (
                  <Link href="/admin" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link href="/staff" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Staff
                  </Link>
                )}
                {userRole === "user" && (
                  <Link href="/user" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                    My Account
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
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-1">
                  {itemCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <button
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-2xl animate-fade-in">
            {/* Shop */}
            <div className="mb-2">
              <p className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest text-gray-600 font-medium">
                Shop Parts
              </p>
              <div className="grid grid-cols-2 gap-1 px-1">
                {shopCategories.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/parts?category=${cat.value}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <cat.icon className="w-4 h-4 text-blue-400 shrink-0" />
                    {cat.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/parts"
                onClick={() => setMobileMenuOpen(false)}
                className="block mx-3 mt-1 px-3 py-2.5 text-sm font-medium text-blue-400 hover:bg-white/5 rounded-lg transition-all"
              >
                View All Parts &rarr;
              </Link>
            </div>

            {/* Services */}
            <div className="border-t border-[#2a2a35]/40 mb-2">
              <p className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-widest text-gray-600 font-medium">
                Services
              </p>
              {serviceLinks.map((svc) => (
                <Link
                  key={svc.label}
                  href={svc.href}
                  onClick={() => !svc.soon && setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                    svc.soon
                      ? "opacity-50 pointer-events-none text-gray-400"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svc.icon className={`w-4 h-4 ${svc.color}`} />
                  {svc.label}
                  {svc.soon && (
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full">Soon</span>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="border-t border-[#2a2a35]/40 pt-3 mt-3 px-3">
                {userRole === "admin" && (
                  <Link href="/admin" className="block py-2 text-sm text-red-400" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                {userRole === "staff" && (
                  <Link href="/staff" className="block py-2 text-sm text-blue-400" onClick={() => setMobileMenuOpen(false)}>
                    Staff Portal
                  </Link>
                )}
                {userRole === "user" && (
                  <Link href="/user" className="block py-2 text-sm text-emerald-400" onClick={() => setMobileMenuOpen(false)}>
                    My Account
                  </Link>
                )}
                <LogoutButton variant="danger" size="sm" className="w-full mt-2" />
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
