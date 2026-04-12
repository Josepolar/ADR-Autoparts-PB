import Link from "next/link";
import AuthCTA from "@/components/auth-cta";
import { Cpu, ShoppingBag, Clock, Shield, Truck, Headphones, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f12]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Your Complete Automotive Super-App
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                ADR Autoparts
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              ECU firmware, high-performance parts, and professional service booking
              — all in one powerful platform.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/autoecu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
              >
                <Cpu className="w-5 h-5" />
                Explore AutoECU
              </Link>
              <Link
                href="/parts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#16161d] border border-[#2a2a35] text-white font-semibold rounded-xl hover:bg-[#1e1e28] hover:border-[#3a3a45] transition-all duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Parts
              </Link>
              <Link
                href="/rapide"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold rounded-xl hover:bg-amber-500/20 transition-all duration-200"
              >
                <Clock className="w-5 h-5" />
                Book Service
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "500+", label: "Parts Available" },
              { value: "24/7", label: "ECU Portal" },
              { value: "100+", label: "Happy Clients" },
              { value: "4.9★", label: "Client Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Our Modules</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three powerful modules designed for the modern automotive experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AutoECU Card */}
            <Link href="/autoecu" className="group relative bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AutoECU Digital Portal</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Upload custom ECU firmware requests or purchase pre-tuned files.
                  Secure, encrypted, and industry-standard.
                </p>
                <span className="inline-flex items-center gap-1 text-red-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* PartsPro Card */}
            <Link href="/parts" className="group relative bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">PartsPro E-Shop</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  High-performance automotive parts with Year-Make-Model filtering.
                  Fast shipping nationwide with real-time inventory tracking.
                </p>
                <span className="inline-flex items-center gap-1 text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Shop Now <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Rapide Card */}
            <Link href="/rapide" className="group relative bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Rapide Service Hub</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Real-time booking for professional maintenance. State-of-the-art
                  equipment, experienced mechanics, fast turnaround.
                </p>
                <span className="inline-flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Book Now <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Secure & Encrypted</h4>
                <p className="text-gray-500 text-sm">All transactions and firmware transfers are encrypted end-to-end</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Fast Nationwide Delivery</h4>
                <p className="text-gray-500 text-sm">Same-day processing with real-time order tracking across Philippines</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Expert Support</h4>
                <p className="text-gray-500 text-sm">Professional mechanics and tuning experts ready to assist you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AuthCTA />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a22] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="text-white font-bold text-lg">ADR Autoparts</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/autoecu" className="hover:text-gray-300 transition-colors">AutoECU</Link>
              <Link href="/parts" className="hover:text-gray-300 transition-colors">Parts</Link>
              <Link href="/rapide" className="hover:text-gray-300 transition-colors">Services</Link>
            </div>
            <p className="text-sm text-gray-600">
              &copy; 2026 ADR Autoparts. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
