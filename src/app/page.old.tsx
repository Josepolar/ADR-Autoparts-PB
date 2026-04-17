"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu,
  ShoppingBag,
  Wrench,
  Shield,
  Truck,
  Headphones,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  FileText,
  CalendarCheck,
  ClipboardList,
  Zap,
  Database,
  Settings,
  Droplets,
  Cog,
  Filter,
  Disc,
  CircleDot,
  Timer,
  X,
} from "lucide-react";

/* ─── SERVICE DATA ──────────────────────────────────── */
const fileServices = [
  {
    title: "Immo Off",
    desc: "Hyundai, Kia, Ford, Toyota, Honda, Lexus",
    icon: Shield,
  },
  {
    title: "Removals",
    desc: "DPF, EGR, Airbag Crash, DTC Removal",
    icon: Zap,
  },
  {
    title: "Tuning",
    desc: "Stage 1, Stage 2 & Stage 3 Performance Tuning",
    icon: Settings,
  },
  {
    title: "Database",
    desc: "Access to original ECU files",
    icon: Database,
  },
];

const productCategories = [
  { name: "Brakes", icon: Disc },
  { name: "Hoses", icon: Filter },
  { name: "Genuine Oils", icon: Droplets },
  { name: "ECU Units", icon: Cpu },
  { name: "Clock Springs", icon: CircleDot },
  { name: "Timing Belts", icon: Timer },
  { name: "Injectors", icon: Cog },
];

const supportedBrands = [
  "Hyundai", "Kia", "Ford", "Toyota", "Honda", "Lexus", "Chevrolet",
];

const maintenanceServices = [
  { title: "PMS Packages", desc: "Complete preventive maintenance schedules", icon: ClipboardList },
  { title: "Change Oil", desc: "Genuine oil & filter replacements", icon: Droplets },
  { title: "Underchassis", desc: "Full undercarriage inspection & service", icon: Wrench },
  { title: "Mechanical", desc: "Engine, transmission & brake repairs", icon: Cog },
  { title: "ATF Dialysis", desc: "Automatic transmission fluid exchange", icon: Settings },
];

const testimonials = [
  { name: "Marco R.", role: "Car Enthusiast", text: "ADR tuned my Kia Stinger and the difference is night and day. Professional service, fast turnaround.", rating: 5 },
  { name: "Angela S.", role: "Fleet Manager", text: "We rely on ADR for all our fleet maintenance. Their PMS packages keep our vehicles in top shape.", rating: 5 },
  { name: "Joey L.", role: "Workshop Owner", text: "The ECU file database is incredible. Original files available within minutes. Best in the Philippines.", rating: 5 },
  { name: "Patricia M.", role: "Daily Driver", text: "Great customer service and quality parts. The online ordering is so convenient!", rating: 4 },
];

const branches = [
  { name: "Main Branch — Santa Maria, Bulacan", address: "0254 National Rd KM 37, Brgy. Pulong Buhangin, Santa Maria, Bulacan", phone: "+63 917 555 1234" },
  { name: "Antipolo Branch — Rizal", address: "2F 58 Saenz Arcade Bldg., Brgy. Mayamot, Sumulong Highway, Antipolo City, Rizal", phone: "+63 917 555 5678" },
];

const blogPosts = [
  { title: "Stage 2 Tuning: What You Need to Know", excerpt: "Explore the benefits and considerations of Stage 2 ECU tuning for your vehicle.", date: "Apr 10, 2026", tag: "Tuning" },
  { title: "Top 5 Signs Your Timing Belt Needs Replacing", excerpt: "Don't wait for a breakdown. Learn the early warning signs of timing belt wear.", date: "Apr 5, 2026", tag: "Maintenance" },
  { title: "DPF Removal: Legal Considerations in PH", excerpt: "What Philippine vehicle owners should know about DPF deletion and compliance.", date: "Mar 28, 2026", tag: "Services" },
];

/* ─── PAGE ──────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeModal, setActiveModal] = useState<"request" | "book" | "quote" | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  /* ─── GSAP SCROLL ANIMATIONS ─────────────────── */
  useEffect(() => {
    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      // Helper: animate element(s) on scroll with reliable triggering
      function animateOnScroll(
        targets: gsap.TweenTarget,
        trigger: gsap.DOMTarget,
        fromVars: gsap.TweenVars,
        toVars: gsap.TweenVars,
        start = "top 88%"
      ) {
        gsap.set(targets, fromVars);
        ScrollTrigger.create({
          trigger,
          start,
          onEnter: () => gsap.to(targets, { ...toVars, overwrite: true }),
          once: true,
        });
      }

      // Hero content entrance (immediate, not scroll-based)
      gsap.fromTo("[data-hero-badge]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.fromTo("[data-hero-title]", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" });
      gsap.fromTo("[data-hero-desc]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.6, ease: "power3.out" });
      gsap.fromTo("[data-hero-buttons]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power3.out" });
      gsap.fromTo("[data-hero-stat]", { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 1, ease: "power3.out" });

      // Section headers — fade up on scroll
      gsap.utils.toArray<HTMLElement>("[data-section-header]").forEach((el) => {
        animateOnScroll(el, el,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
      });

      // Cards — stagger fade-up on scroll
      gsap.utils.toArray<HTMLElement>("[data-animate-cards]").forEach((container) => {
        const cards = gsap.utils.toArray(container.children);
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        ScrollTrigger.create({
          trigger: container,
          start: "top 88%",
          onEnter: () => gsap.to(cards, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", overwrite: true }),
          once: true,
        });
      });

      // About section — slide left content, slide right cards
      animateOnScroll("[data-about-text]", "[data-about-text]",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" },
        "top 85%"
      );
      animateOnScroll("[data-about-cards]", "[data-about-cards]",
        { autoAlpha: 0, x: 50 },
        { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" },
        "top 85%"
      );

      // Testimonial cards — scale up
      const testimonials = gsap.utils.toArray<HTMLElement>("[data-testimonial]");
      gsap.set(testimonials, { autoAlpha: 0, scale: 0.9, y: 30 });
      ScrollTrigger.batch(testimonials, {
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.2)", overwrite: true }),
        start: "top 90%",
        once: true,
      });

      // Blog cards — slide up staggered
      const blogs = gsap.utils.toArray<HTMLElement>("[data-blog-card]");
      gsap.set(blogs, { autoAlpha: 0, y: 50 });
      ScrollTrigger.batch(blogs, {
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", overwrite: true }),
        start: "top 90%",
        once: true,
      });

      // Brand pills — stagger pop in
      const pills = gsap.utils.toArray<HTMLElement>("[data-brand-pill]");
      gsap.set(pills, { autoAlpha: 0, scale: 0.8 });
      ScrollTrigger.create({
        trigger: "[data-brand-pills]",
        start: "top 88%",
        onEnter: () => gsap.to(pills, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: "back.out(1.5)", overwrite: true }),
        once: true,
      });

      // Footer — fade in
      animateOnScroll("[data-footer]", "[data-footer]",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "top 92%"
      );

    }, mainRef);

    return () => ctx.revert();
  }, []);

  function openModal(modal: "request" | "book" | "quote") {
    setFormSubmitted(false);
    setFormError(null);
    setActiveModal(modal);
  }

  function closeModal() {
    setActiveModal(null);
    setFormSubmitted(false);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      let endpoint = "";
      let body: Record<string, unknown> = {};

      if (activeModal === "quote") {
        endpoint = "/api/quotations";
        body = { name: data.name, email: data.email, phone: data.phone || null, items: data.items };
      } else if (activeModal === "book") {
        endpoint = "/api/bookings";
        body = { name: data.name, email: data.email, phone: data.phone, service: data.service, date: data.date };
      } else {
        // request ticket - just show success (no dedicated table needed)
        setFormSubmitted(true);
        setSubmitting(false);
        setTimeout(() => closeModal(), 2000);
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      setFormSubmitted(true);
      setTimeout(() => closeModal(), 2000);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function scrollTo(hash: string) {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main ref={mainRef} className="min-h-screen bg-[#0f0f12]">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/cover.png"
            alt=""
            fill
            className="object-cover object-center opacity-[0.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f12]/30 via-[#0f0f12]/70 to-[#0f0f12]" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-blue-600/5" />
        </div>
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div data-hero-badge className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Trusted Automotive Solutions Since 2015
            </div>

            <h1 data-hero-title className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.05]">
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                ADR Auto Parts
              </span>
              <br />
              <span className="text-white">Trading</span>
            </h1>

            <p data-hero-desc className="text-lg sm:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
              ECU file services, premium auto parts, and professional vehicle
              maintenance — all under one roof.
            </p>

            <div data-hero-buttons className="flex gap-3 flex-wrap">
              <button
                onClick={() => scrollTo("#services")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.02] cursor-pointer"
              >
                <Cpu className="w-5 h-5" />
                Our Services
              </button>
              <Link
                href="/parts"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#16161d] border border-[#2a2a35] text-white font-semibold rounded-xl hover:bg-[#1e1e28] hover:border-[#3a3a45] transition-all duration-200 hover:scale-[1.02]"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Parts
              </Link>
              <button
                onClick={() => scrollTo("#book-now")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold rounded-xl hover:bg-amber-500/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <CalendarCheck className="w-5 h-5" />
                Book Now
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { value: "500+", label: "Parts Available" },
              { value: "10+", label: "Years of Service" },
              { value: "2,000+", label: "Happy Clients" },
              { value: "4.9\u2605", label: "Client Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                data-hero-stat
                className="text-center py-4 bg-white/[0.02] rounded-xl border border-white/[0.04]"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-[10px] uppercase tracking-widest text-gray-600">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gray-500 rounded-full animate-scroll-dot" />
          </div>
        </div>
      </section>

      {/* ═══ ABOUT US ═══ */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-about-text>
              <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Your Trusted Automotive Partner
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                ADR Auto Parts Trading has been serving automotive professionals and enthusiasts
                across the Philippines for over a decade. We specialize in ECU file services,
                genuine auto parts, and full-service vehicle maintenance.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                From Stage 1 tuning to complete PMS packages, our team of certified
                mechanics and ECU specialists deliver precision results every time. We stock
                parts for Hyundai, Kia, Ford, Toyota, Honda, Lexus, Chevrolet, and more.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold text-white">10+</p>
                  <p className="text-xs text-gray-500 mt-1">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">2K+</p>
                  <p className="text-xs text-gray-500 mt-1">Vehicles Serviced</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">100%</p>
                  <p className="text-xs text-gray-500 mt-1">Satisfaction Goal</p>
                </div>
              </div>
            </div>
            <div data-about-cards className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Certified Experts", desc: "Factory-trained ECU & mechanical specialists" },
                { icon: Truck, title: "Fast Delivery", desc: "Same-day processing, nationwide shipping" },
                { icon: Headphones, title: "Expert Support", desc: "Dedicated team for every inquiry" },
                { icon: Clock, title: "Quick Turnaround", desc: "Most services completed within 24 hours" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl hover:border-red-500/20 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FILE SERVICES ═══ */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div data-section-header className="text-center mb-16">
            <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-3">I. File Services</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">ECU & Software Solutions</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Professional ECU file services for tuning, removal, and immobilizer solutions</p>
          </div>

          <div data-animate-cards className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fileServices.map((svc) => (
              <Link
                href="/autoecu"
                key={svc.title}
                className="group relative bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <svc.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{svc.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div data-section-header className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">II. Products</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Auto Parts Catalog</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Genuine and aftermarket parts for top automotive brands</p>
          </div>

          {/* Brands */}
          <div data-brand-pills className="flex flex-wrap justify-center gap-3 mb-12">
            {supportedBrands.map((brand) => (
              <span
                key={brand}
                data-brand-pill
                className="px-4 py-2 bg-[#16161d] border border-[#2a2a35] rounded-full text-sm text-gray-300 font-medium hover:border-blue-500/30 hover:text-blue-400 transition-all duration-200"
              >
                {brand}
              </span>
            ))}
          </div>

          {/* Categories */}
          <div data-animate-cards className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {productCategories.map((cat) => (
              <Link
                href="/parts"
                key={cat.name}
                className="group flex flex-col items-center gap-3 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <cat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAINTENANCE ═══ */}
      <section id="maintenance" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div data-section-header className="text-center mb-16">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">III. Maintenance</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Vehicle Service Center</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Complete maintenance solutions for your vehicle</p>
          </div>

          <div data-animate-cards className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {maintenanceServices.map((svc) => (
              <Link
                href="/rapide"
                key={svc.title}
                className="group bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svc.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-bold mb-1.5">{svc.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{svc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REQUEST TICKET / BOOK NOW / QUOTATION ═══ */}
      <section id="request-ticket" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div data-animate-cards className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-[#16161d] border border-[#2a2a35] rounded-2xl p-8 hover:border-red-500/30 transition-all duration-300 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Request Ticket</h3>
              <p className="text-gray-500 text-sm mb-6">Submit a service request or inquiry. Our team will respond within 24 hours.</p>
              <button onClick={() => openModal("request")} className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-all text-sm cursor-pointer">
                Submit Request
              </button>
            </div>
            <div id="book-now" className="group bg-[#16161d] border border-[#2a2a35] rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Book Now</h3>
              <p className="text-gray-500 text-sm mb-6">Schedule your vehicle maintenance or ECU service appointment online.</p>
              <button onClick={() => openModal("book")} className="px-6 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold rounded-xl hover:bg-amber-500/20 transition-all text-sm cursor-pointer">
                Book Appointment
              </button>
            </div>
            <div id="quotation" className="group bg-[#16161d] border border-[#2a2a35] rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Get Quotation</h3>
              <p className="text-gray-500 text-sm mb-6">Request a free price quote for parts, services, or fleet packages.</p>
              <button onClick={() => openModal("quote")} className="px-6 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold rounded-xl hover:bg-blue-500/20 transition-all text-sm cursor-pointer">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BRANCHES & CONTACT ═══ */}
      <section id="branches" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div data-section-header className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Find Us</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Branches & Contact</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Visit us at any of our locations or get in touch</p>
          </div>

          <div data-animate-cards className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-8 hover:border-emerald-500/20 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-4">{branch.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-gray-400 text-sm">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="text-gray-400 text-sm hover:text-emerald-400 transition-colors">{branch.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a href="mailto:info@adrautoparts.com" className="text-gray-400 text-sm hover:text-emerald-400 transition-colors">info@adrautoparts.com</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div data-section-header className="text-center mb-16">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Customer Feedback</h2>
            <p className="text-gray-500 max-w-xl mx-auto">What our clients say about our services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                data-testimonial
                className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-700"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-600 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG ═══ */}
      <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1a1a22]">
        <div className="max-w-7xl mx-auto">
          <div data-section-header className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Blog</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Latest Posts</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Stay updated with automotive tips and industry news</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                data-blog-card
                className="group bg-[#16161d] border border-[#2a2a35] rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="h-44 bg-gradient-to-br from-[#1e1e28] to-[#16161d] flex items-center justify-center">
                  <span className="text-4xl text-gray-800 group-hover:text-gray-700 transition-colors">\u2756</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full">{post.tag}</span>
                    <span className="text-xs text-gray-600">{post.date}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2 group-hover:text-cyan-400 transition-colors">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium mt-4 group-hover:gap-2 transition-all cursor-pointer">
                    Read More <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MODALS ═══ */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-[#16161d] border border-[#2a2a35] rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Submitted!</h3>
                <p className="text-gray-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : activeModal === "request" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Request Ticket</h3>
                  <p className="text-gray-500 text-sm mt-1">Submit a service request or inquiry</p>
                </div>
                <input required name="name" placeholder="Full Name" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/40" />
                <input required name="email" type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/40" />
                <select required name="service" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-gray-400 text-sm focus:outline-none focus:border-red-500/40">
                  <option value="">Select Service Type</option>
                  <option value="immo-off">Immo Off</option>
                  <option value="dpf-removal">DPF / EGR Removal</option>
                  <option value="tuning">ECU Tuning</option>
                  <option value="database">ECU Database</option>
                  <option value="other">Other</option>
                </select>
                <textarea required name="message" rows={3} placeholder="Describe your request..." className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/40 resize-none" />
                {formError && <p className="text-red-400 text-xs">{formError}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            ) : activeModal === "book" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                    <CalendarCheck className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Book Appointment</h3>
                  <p className="text-gray-500 text-sm mt-1">Schedule your vehicle service</p>
                </div>
                <input required name="name" placeholder="Full Name" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/40" />
                <input required name="email" type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/40" />
                <input required name="phone" type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/40" />
                <select required name="service" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-gray-400 text-sm focus:outline-none focus:border-amber-500/40">
                  <option value="">Select Service</option>
                  <option value="pms">PMS Package</option>
                  <option value="change-oil">Change Oil</option>
                  <option value="underchassis">Underchassis</option>
                  <option value="mechanical">Mechanical Repair</option>
                  <option value="atf">ATF Dialysis</option>
                  <option value="ecu">ECU Service</option>
                </select>
                <input required name="date" type="date" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-gray-400 text-sm focus:outline-none focus:border-amber-500/40" />
                {formError && <p className="text-red-400 text-xs">{formError}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Booking..." : "Book Appointment"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                    <ClipboardList className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Get Quotation</h3>
                  <p className="text-gray-500 text-sm mt-1">Request a free price quote</p>
                </div>
                <input required name="name" placeholder="Full Name" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40" />
                <input required name="email" type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40" />
                <input name="phone" type="tel" placeholder="Phone Number (optional)" className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40" />
                <textarea required name="items" rows={3} placeholder="Parts or services you need a quote for..." className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 resize-none" />
                {formError && <p className="text-red-400 text-xs">{formError}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Submitting..." : "Get Quote"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer data-footer className="border-t border-[#1a1a22] pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/logo.png" alt="ADR" width={36} height={36} className="rounded-lg" />
                <div>
                  <span className="text-white font-bold text-lg block leading-tight">ADR Auto Parts</span>
                  <span className="text-[10px] text-gray-600 uppercase tracking-[0.15em]">Trading</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your complete automotive solutions partner in the Philippines.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#about" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">About Us</a></li>
                <li><a href="#branches" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Our Branches</a></li>
                <li><a href="#branches" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Contact Us</a></li>
                <li><a href="#testimonials" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Testimonials</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
              <ul className="space-y-2.5">
                <li><a href="#services" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">File Services</a></li>
                <li><a href="#products" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Products</a></li>
                <li><a href="#maintenance" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Maintenance</a></li>
                <li><a href="#services" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Tuning</a></li>
              </ul>
            </div>

            {/* Actions */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Get Started</h4>
              <ul className="space-y-2.5">
                <li><a href="#request-ticket" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Request Ticket</a></li>
                <li><a href="#book-now" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Book Now</a></li>
                <li><a href="#quotation" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Quotation</a></li>
                <li><a href="#blog" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#1a1a22] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} ADR Auto Parts Trading. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <a href="#policies" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#policies" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
