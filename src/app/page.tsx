"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/context/theme-context";
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
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

/* ══════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════ */

const fileServices = [
  {
    title: "Immo Off",
    desc: "Hyundai, Kia, Ford, Toyota, Honda, Lexus — professional immobilizer bypass and key coding solutions for modern vehicles.",
    icon: Shield,
    color: "red",
  },
  {
    title: "Removals",
    desc: "DPF, EGR, Airbag Crash Data, DTC Removal — clean, tested file modifications with guaranteed results.",
    icon: Zap,
    color: "amber",
  },
  {
    title: "Tuning",
    desc: "Stage 1, Stage 2 & Stage 3 ECU performance tuning. Unlock your engine's true potential safely.",
    icon: Settings,
    color: "blue",
  },
  {
    title: "Database",
    desc: "Instant access to our library of original ECU files. Download verified stock files on demand.",
    icon: Database,
    color: "emerald",
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
  "Hyundai",
  "Kia",
  "Ford",
  "Toyota",
  "Honda",
  "Lexus",
  "Chevrolet",
];

const maintenanceServices = [
  {
    title: "PMS Packages",
    desc: "Complete preventive maintenance schedules",
    icon: ClipboardList,
    num: "01",
  },
  {
    title: "Change Oil",
    desc: "Genuine oil & filter replacements",
    icon: Droplets,
    num: "02",
  },
  {
    title: "Underchassis",
    desc: "Full undercarriage inspection & service",
    icon: Wrench,
    num: "03",
  },
  {
    title: "Mechanical",
    desc: "Engine, transmission & brake repairs",
    icon: Cog,
    num: "04",
  },
  {
    title: "ATF Dialysis",
    desc: "Automatic transmission fluid exchange",
    icon: Settings,
    num: "05",
  },
];

const testimonials = [
  {
    name: "Marco R.",
    role: "Car Enthusiast",
    text: "ADR tuned my Kia Stinger and the difference is night and day. Professional service, fast turnaround.",
    rating: 5,
  },
  {
    name: "Angela S.",
    role: "Fleet Manager",
    text: "We rely on ADR for all our fleet maintenance. Their PMS packages keep our vehicles in top shape.",
    rating: 5,
  },
  {
    name: "Joey L.",
    role: "Workshop Owner",
    text: "The ECU file database is incredible. Original files available within minutes. Best in the Philippines.",
    rating: 5,
  },
  {
    name: "Patricia M.",
    role: "Daily Driver",
    text: "Great customer service and quality parts. The online ordering is so convenient!",
    rating: 4,
  },
];

const branches = [
  {
    name: "Main Branch — Santa Maria, Bulacan",
    address:
      "0254 National Rd KM 37, Brgy. Pulong Buhangin, Santa Maria, Bulacan",
    phone: "+63 917 555 1234",
  },
  {
    name: "Antipolo Branch — Rizal",
    address:
      "2F 58 Saenz Arcade Bldg., Brgy. Mayamot, Sumulong Highway, Antipolo City, Rizal",
    phone: "+63 917 555 5678",
  },
];

const blogPosts = [
  {
    title: "Stage 2 Tuning: What You Need to Know",
    excerpt:
      "Explore the benefits and considerations of Stage 2 ECU tuning for your vehicle.",
    date: "Apr 10, 2026",
    tag: "Tuning",
  },
  {
    title: "Top 5 Signs Your Timing Belt Needs Replacing",
    excerpt:
      "Don't wait for a breakdown. Learn the early warning signs of timing belt wear.",
    date: "Apr 5, 2026",
    tag: "Maintenance",
  },
  {
    title: "DPF Removal: Legal Considerations in PH",
    excerpt:
      "What Philippine vehicle owners should know about DPF deletion and compliance.",
    date: "Mar 28, 2026",
    tag: "Services",
  },
];

const heroStats = [
  { value: 500, suffix: "+", label: "Parts Available" },
  { value: 10, suffix: "+", label: "Years of Service" },
  { value: 2000, suffix: "+", label: "Happy Clients" },
  { value: 4.9, suffix: "★", label: "Client Rating", decimal: true },
];

/* ══════════════════════════════════════════════
   COLOR MAP
   ══════════════════════════════════════════════ */
const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  red: { bg: "bg-red-500/8", text: "text-red-400", border: "border-red-500/20", glow: "shadow-red-500/10" },
  amber: { bg: "bg-amber-500/8", text: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
  blue: { bg: "bg-blue-500/8", text: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
  emerald: { bg: "bg-emerald-500/8", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
};

/* ══════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeModal, setActiveModal] = useState<
    "request" | "book" | "quote" | null
  >(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  /* ══ GSAP MASTER ANIMATIONS ══════════════════ */
  useEffect(() => {
    if (!mainRef.current) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ── Hero Entrance Timeline ── */
      const hero = gsap.timeline({ defaults: { ease: "power4.out" } });

      hero
        .fromTo(
          "[data-hero-line-1] > span",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.2 },
          0.2
        )
        .fromTo(
          "[data-hero-line-2] > span",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.2 },
          0.35
        )
        .fromTo(
          "[data-hero-badge]",
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: 0.6 },
          0.8
        )
        .fromTo(
          "[data-hero-desc]",
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          0.9
        )
        .fromTo(
          "[data-hero-cta] > *",
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5 },
          1.0
        )
        .fromTo(
          "[data-hero-stats] > *",
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4 },
          1.2
        );

      /* ── Counter Animation ── */
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const target = parseFloat(el.dataset.counterTarget || "0");
        const suffix = el.dataset.counterSuffix || "";
        const isDecimal = el.dataset.counterDecimal === "true";
        const obj = { val: 0 };

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                const display = isDecimal
                  ? obj.val.toFixed(1)
                  : Math.round(obj.val).toLocaleString();
                el.textContent = display + suffix;
              },
            });
          },
          once: true,
        });
      });

      /* ── Generic Reveal (fade-up by default) ── */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const dir = el.dataset.reveal || "up";
        const from: gsap.TweenVars = { autoAlpha: 0 };
        if (dir === "up") from.y = 50;
        else if (dir === "left") from.x = -50;
        else if (dir === "right") from.x = 50;

        gsap.fromTo(el, from, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 87%", once: true },
        });
      });

      /* ── Stagger Children Reveal ── */
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((c) => {
        const children = gsap.utils.toArray(c.children);
        gsap.fromTo(
          children,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: c, start: "top 87%", once: true },
          }
        );
      });

      /* ── Scale-In Cards ── */
      gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, scale: 0.88 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: el, start: "top 87%", once: true },
          }
        );
      });

      /* ── Clip Path Line Reveals ── */
      gsap.utils.toArray<HTMLElement>("[data-clip-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 87%", once: true },
          }
        );
      });

      /* ── Horizontal Scroll (desktop) ── */
      mm.add("(min-width: 1024px)", () => {
        const wrapper = document.querySelector(
          "[data-h-wrapper]"
        ) as HTMLElement;
        const track = document.querySelector("[data-h-track]") as HTMLElement;
        if (!wrapper || !track) return;

        const panels = gsap.utils.toArray<HTMLElement>(".h-panel");
        if (panels.length < 2) return;

        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 0.8,
            end: () => "+=" + track.scrollWidth,
            invalidateOnRefresh: true,
          },
        });
      });

      /* ── Parallax Elements (desktop only) ── */
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || "0.15");
          gsap.to(el, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });

      /* ── Testimonial Horizontal Slide ── */
      const testimonialsRow = document.querySelector("[data-testimonial-row]");
      if (testimonialsRow) {
        const cards = gsap.utils.toArray<HTMLElement>("[data-testimonial]");
        gsap.fromTo(
          cards,
          { autoAlpha: 0, x: 60 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: testimonialsRow,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      /* ── Blog Stagger ── */
      const blogs = gsap.utils.toArray<HTMLElement>("[data-blog-card]");
      if (blogs.length) {
        gsap.fromTo(
          blogs,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: blogs[0]?.parentElement,
              start: "top 87%",
              once: true,
            },
          }
        );
      }

      /* ── Footer Wipe In ── */
      gsap.fromTo(
        "[data-footer]",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-footer]",
            start: "top 92%",
            once: true,
          },
        }
      );
    }, mainRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  /* ══ HANDLERS ══════════════════════════════════ */
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
        body = {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          items: data.items,
        };
      } else if (activeModal === "book") {
        endpoint = "/api/bookings";
        body = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          date: data.date,
        };
      } else if (activeModal === "request") {
        endpoint = "/api/requests";
        body = {
          name: data.name,
          email: data.email,
          service: data.service,
          message: data.message,
        };
      } else {
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
      setFormError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function scrollTo(hash: string) {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  /* ══ RENDER ════════════════════════════════════ */
  return (
    <main
      ref={mainRef}
      className="min-h-screen bg-[#0a0a0f] overflow-x-hidden selection:bg-red-500/20"
    >
      {/* Film grain — CSS only, lightweight */}
      <div className="grain-overlay hidden lg:block" />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section
        data-hero
        className="relative h-screen flex flex-col overflow-hidden"
      >
        {/* BG layers */}
        <div data-hero-bg className="absolute inset-0">
          <Image
            src="/cover.png"
            alt=""
            fill
            className="object-cover object-center opacity-[0.05]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/20 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        </div>

        {/* Single subtle glow — no blur-[150px] perf killer */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-red-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Navbar clearance + bounded content area */}
        <div className="shrink-0 h-14 sm:h-16 lg:h-20" />
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col justify-end max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 w-full pb-6 sm:pb-8 lg:pb-10">
          {/* Badge */}
          <div
            data-hero-badge
            className="invisible inline-flex items-center gap-2 sm:gap-2.5 mb-6 sm:mb-8"
          >
            <span className="w-6 sm:w-8 h-[1px] bg-red-500/60" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-400 font-medium">
              Trusted Automotive Solutions Since 2015
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display leading-[0.88] tracking-tight">
            <span
              data-hero-line-1
              className="block overflow-hidden text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem]"
            >
              <span className={"block bg-gradient-to-r bg-clip-text text-transparent " + (isDark ? "from-white via-white to-gray-300" : "from-gray-900 via-gray-800 to-gray-600")}>
                ADR AUTO
              </span>
            </span>
            <span
              data-hero-line-2
              className="block overflow-hidden text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem]"
            >
              <span className="block text-stroke">PARTS TRADING</span>
            </span>
          </h1>

          {/* Description */}
          <p
            data-hero-desc
            className="invisible max-w-md lg:max-w-lg text-gray-400 mt-6 sm:mt-8 text-sm sm:text-base lg:text-lg leading-relaxed"
          >
            ECU file services, premium auto parts, and professional vehicle
            maintenance — all under one roof.
          </p>

          {/* CTA Buttons */}
          <div data-hero-cta className="flex gap-3 sm:gap-4 mt-8 sm:mt-10 flex-wrap">
            <button
              onClick={() => scrollTo("#services")}
              className="invisible group inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-red-500 text-white text-sm sm:text-base font-semibold rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:gap-3 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              Our Services
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <Link
              href="/parts"
              className="invisible inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-white/[0.04] border border-white/[0.08] text-white text-sm sm:text-base font-semibold rounded-full hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 backdrop-blur-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop Parts
            </Link>
            <button
              onClick={() => scrollTo("#book-now")}
              className="invisible hidden sm:inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 text-gray-300 text-sm sm:text-base font-medium hover:text-white transition-colors duration-300 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Now
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          </div>
        </div>

        {/* Stats strip at bottom */}
        <div
          data-hero-stats
          className="relative border-t border-white/[0.06] bg-black/30 backdrop-blur-lg"
        >
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="invisible py-4 sm:py-6 lg:py-7 text-center"
              >
                <span
                  data-counter
                  data-counter-target={stat.value}
                  data-counter-suffix={stat.suffix}
                  data-counter-decimal={stat.decimal ? "true" : "false"}
                  className="text-xl sm:text-2xl lg:text-3xl font-display text-white"
                >
                  0
                </span>
                <span className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 block mt-0.5 sm:mt-1 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-[90px] sm:bottom-[100px] lg:bottom-[130px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-medium">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
            <div className="w-0.5 h-1.5 bg-white/30 rounded-full animate-scroll-dot" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BRAND MARQUEE
          ═══════════════════════════════════════════ */}
      <div className="border-y border-white/[0.04] overflow-hidden py-4 sm:py-5 bg-[#08080c]">
        <div className="marquee-track flex items-center gap-0 whitespace-nowrap">
          {[...supportedBrands, ...supportedBrands, ...supportedBrands].map(
            (brand, i) => (
              <span
                key={i}
                className="text-lg sm:text-xl lg:text-2xl font-display uppercase tracking-[0.15em] text-white/[0.07] flex-shrink-0 px-6 sm:px-8"
              >
                {brand}
                <span className="text-red-500/20 ml-6 sm:ml-8">✦</span>
              </span>
            )
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          ABOUT
          ═══════════════════════════════════════════ */}
      <section
        id="about"
        className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 lg:px-12"
      >
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            {/* Left — 7 cols */}
            <div className="lg:col-span-7">
              <div data-reveal="left" className="invisible">
                <span className="text-red-400/70 text-[11px] uppercase tracking-[0.3em] font-medium">
                  About Us
                </span>
                <div className="w-12 h-[1px] bg-red-500/30 mt-3 mb-6" />
              </div>

              <h2
                data-reveal="up"
                className="invisible text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white leading-[0.95] mb-6 sm:mb-8"
              >
                YOUR TRUSTED
                <br />
                AUTOMOTIVE PARTNER
              </h2>

              <div data-reveal="up" className="invisible space-y-5 max-w-xl">
                <p className="text-gray-400 leading-relaxed text-[15px]">
                  ADR Auto Parts Trading has been serving automotive
                  professionals and enthusiasts across the Philippines for over a
                  decade. We specialize in ECU file services, genuine auto parts,
                  and full-service vehicle maintenance.
                </p>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  From Stage 1 tuning to complete PMS packages, our team of
                  certified mechanics and ECU specialists deliver precision
                  results every time.
                </p>
              </div>

              {/* Counter stats */}
              <div
                data-stagger
                className="flex flex-wrap gap-8 sm:gap-12 mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-white/[0.06]"
              >
                {[
                  { val: 10, suffix: "+", label: "Years" },
                  { val: 2000, suffix: "+", label: "Vehicles Serviced" },
                  { val: 100, suffix: "%", label: "Satisfaction Goal" },
                ].map((s) => (
                  <div key={s.label} className="invisible">
                    <span
                      data-counter
                      data-counter-target={s.val}
                      data-counter-suffix={s.suffix}
                      className="text-3xl lg:text-4xl font-display text-white"
                    >
                      0
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-1 uppercase tracking-[0.2em]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 5 cols, feature cards */}
            <div
              data-stagger
              className="lg:col-span-5 grid grid-cols-2 gap-3"
            >
              {[
                {
                  icon: Shield,
                  title: "Certified Experts",
                  desc: "Factory-trained ECU & mechanical specialists",
                },
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  desc: "Same-day processing, nationwide shipping",
                },
                {
                  icon: Headphones,
                  title: "Expert Support",
                  desc: "Dedicated team for every inquiry",
                },
                {
                  icon: Clock,
                  title: "Quick Turnaround",
                  desc: "Most services completed within 24 hours",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="invisible group p-5 lg:p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 tilt-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/8 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/15 transition-all duration-500">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FILE SERVICES — Horizontal Scroll (desktop)
          ═══════════════════════════════════════════ */}
      <section className="border-t border-white/[0.04]">
        {/* Desktop: horizontal scroll */}
        <div
          data-h-wrapper
          className="hidden lg:block relative overflow-hidden"
        >
          <div
            data-h-track
            className="flex"
            style={{ width: fileServices.length * 100 + "vw" }}
          >
            {fileServices.map((svc, i) => {
              const c = colorMap[svc.color] || colorMap.red;
              return (
                <div
                  key={svc.title}
                  className="h-panel px-12 xl:px-20"
                  id={i === 0 ? "services" : undefined}
                >
                  <div className="max-w-[90rem] mx-auto w-full grid grid-cols-12 gap-16 items-center">
                    {/* Left content */}
                    <div className="col-span-7">
                      <span
                        className={"text-[11px] uppercase tracking-[0.3em] font-medium " + c.text + " opacity-60"}
                      >
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(fileServices.length).padStart(2, "0")}
                      </span>
                      <h2 className="text-6xl xl:text-8xl font-display text-white mt-4 leading-[0.9]">
                        {svc.title.toUpperCase()}
                      </h2>
                      <p className="text-gray-400 text-lg mt-6 max-w-lg leading-relaxed">
                        {svc.desc}
                      </p>
                      <Link
                        href="/autoecu"
                        className={"group inline-flex items-center gap-2 mt-8 text-sm font-medium " + c.text + " hover:gap-3 transition-all duration-300"}
                      >
                        Explore Service
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* Right icon */}
                    <div className="col-span-5 flex items-center justify-center">
                      <div
                        className={"w-48 h-48 xl:w-56 xl:h-56 rounded-[2rem] " + c.bg + " border " + c.border + " flex items-center justify-center"}
                      >
                        <svc.icon
                          className={"w-24 h-24 xl:w-28 xl:h-28 " + c.text + " opacity-30"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Large watermark number */}
                  <span className="section-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="lg:hidden py-20 px-6 sm:px-8" id="services">
          <div data-reveal="up" className="invisible mb-12">
            <span className="text-red-400/70 text-[11px] uppercase tracking-[0.3em] font-medium">
              I. File Services
            </span>
            <h2 className="text-4xl font-display text-white mt-3">
              ECU & SOFTWARE
              <br />
              SOLUTIONS
            </h2>
          </div>

          <div data-stagger className="space-y-4">
            {fileServices.map((svc, i) => {
              const c = colorMap[svc.color] || colorMap.red;
              return (
                <Link
                  href="/autoecu"
                  key={svc.title}
                  className="invisible group flex items-center gap-5 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-400"
                >
                  <div
                    className={"w-14 h-14 rounded-xl " + c.bg + " flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500"}
                  >
                    <svc.icon className={"w-7 h-7 " + c.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={"text-[10px] uppercase tracking-[0.2em] " + c.text + " opacity-60"}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-white font-semibold text-lg">
                      {svc.title}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {svc.desc}
                    </p>
                  </div>
                  <ArrowRight
                    className={"w-5 h-5 " + c.text + " opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCTS
          ═══════════════════════════════════════════ */}
      <section
        id="products"
        className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 lg:px-12 border-t border-white/[0.04]"
      >
        <div className="max-w-[90rem] mx-auto">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-6" data-reveal="up">
              <span className="invisible text-blue-400/70 text-[11px] uppercase tracking-[0.3em] font-medium">
                II. Products
              </span>
              <h2 className="invisible text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mt-3 leading-[0.95]">
                AUTO PARTS
                <br />
                CATALOG
              </h2>
            </div>
            <div
              className="lg:col-span-6 flex items-end"
              data-reveal="right"
            >
              <p className="invisible text-gray-400 text-[15px] leading-relaxed max-w-md lg:ml-auto">
                Genuine and aftermarket parts for top automotive brands.
                Available for pickup or nationwide delivery.
              </p>
            </div>
          </div>

          {/* Category grid — asymmetric bento */}
          <div
            data-stagger
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3"
          >
            {productCategories.map((cat) => (
              <Link
                href="/parts"
                key={cat.name}
                className="invisible group relative flex flex-col items-center justify-center gap-3 p-6 lg:p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-blue-500/[0.04] hover:border-blue-500/15 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-12 h-12 rounded-xl bg-blue-500/8 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/15 transition-all duration-500">
                  <cat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="relative text-sm text-gray-300 font-medium text-center group-hover:text-white transition-colors duration-300">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Browse all CTA */}
          <div
            data-reveal="up"
            className="invisible flex justify-center mt-12"
          >
            <Link
              href="/parts"
              className="group inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 hover:gap-3 transition-all duration-300"
            >
              Browse All Parts
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAINTENANCE
          ═══════════════════════════════════════════ */}
      <section
        id="maintenance"
        className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 lg:px-12 border-t border-white/[0.04] relative"
      >
        {/* Faint watermark */}
        <span
          data-parallax="0.05"
          className="hidden lg:block section-number !text-[18rem] !-top-12 !right-12"
        >
          III
        </span>

        <div className="max-w-[90rem] mx-auto relative">
          <div data-reveal="up" className="invisible mb-16">
            <span className="text-amber-400/70 text-[11px] uppercase tracking-[0.3em] font-medium">
              III. Maintenance
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mt-3 leading-[0.95]">
              VEHICLE SERVICE
              <br />
              CENTER
            </h2>
          </div>

          <div
            data-stagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {maintenanceServices.map((svc) => (
              <Link
                href="/rapide"
                key={svc.title}
                className="invisible group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 lg:p-7 hover:bg-amber-500/[0.03] hover:border-amber-500/15 transition-all duration-500 overflow-hidden tilt-card"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <span className="text-3xl font-display text-white/[0.06] block mb-4 group-hover:text-amber-500/10 transition-colors duration-500">
                    {svc.num}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/8 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500/15 transition-all duration-500">
                    <svc.icon className="w-5.5 h-5.5 text-amber-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1.5">
                    {svc.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Request / Book / Quote
          ═══════════════════════════════════════════ */}
      <section
        id="request-ticket"
        className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 lg:px-12 border-t border-white/[0.04]"
      >
        <div className="max-w-[90rem] mx-auto">
          <div
            data-stagger
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5"
          >
            {/* Request Ticket */}
            <div className="invisible group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 lg:p-10 hover:border-red-500/20 transition-all duration-500 glow-border overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-red-500/8 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-display text-white mb-2 tracking-wide">
                REQUEST TICKET
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Submit a service request or inquiry. Our team will respond
                within 24 hours.
              </p>
              <button
                onClick={() => openModal("request")}
                className="group/btn inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 hover:gap-3 transition-all duration-300 cursor-pointer"
              >
                Submit Request
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>

            {/* Book Now */}
            <div
              id="book-now"
              className="invisible group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 lg:p-10 hover:border-amber-500/20 transition-all duration-500 glow-border overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-amber-500/8 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <CalendarCheck className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-display text-white mb-2 tracking-wide">
                BOOK NOW
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Schedule your vehicle maintenance or ECU service appointment
                online.
              </p>
              <button
                onClick={() => openModal("book")}
                className="group/btn inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 hover:gap-3 transition-all duration-300 cursor-pointer"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>

            {/* Quotation */}
            <div
              id="quotation"
              className="invisible group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 lg:p-10 hover:border-blue-500/20 transition-all duration-500 glow-border overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-blue-500/8 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ClipboardList className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-display text-white mb-2 tracking-wide">
                GET QUOTATION
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Request a free price quote for parts, services, or fleet
                packages.
              </p>
              <button
                onClick={() => openModal("quote")}
                className="group/btn inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 hover:gap-3 transition-all duration-300 cursor-pointer"
              >
                Get Quote
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BRANCHES & CONTACT
          ═══════════════════════════════════════════ */}
      <section
        id="branches"
        className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 lg:px-12 border-t border-white/[0.04]"
      >
        <div className="max-w-[90rem] mx-auto">
          <div data-reveal="up" className="invisible mb-16">
            <span className="text-emerald-400/70 text-[11px] uppercase tracking-[0.3em] font-medium">
              Find Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mt-3 leading-[0.95]">
              OUR BRANCHES
              <br />& CONTACT
            </h2>
          </div>

          <div
            data-stagger
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
          >
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="invisible group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 lg:p-10 hover:border-emerald-500/15 transition-all duration-500"
              >
                <h3 className="text-lg font-semibold text-white mb-6">
                  {branch.name}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-gray-400 text-sm leading-relaxed">
                      {branch.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a
                      href={"tel:" + branch.phone.replace(/\s/g, "")}
                      className="text-gray-400 text-sm hover:text-emerald-400 transition-colors"
                    >
                      {branch.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a
                      href="mailto:info@adrautoparts.com"
                      className="text-gray-400 text-sm hover:text-emerald-400 transition-colors"
                    >
                      info@adrautoparts.com
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section
        id="testimonials"
        className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 lg:px-12 border-t border-white/[0.04]"
      >
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-6" data-reveal="up">
              <span className="invisible text-purple-400/70 text-[11px] uppercase tracking-[0.3em] font-medium">
                Testimonials
              </span>
              <h2 className="invisible text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mt-3 leading-[0.95]">
                CUSTOMER
                <br />
                FEEDBACK
              </h2>
            </div>
            <div
              className="lg:col-span-6 flex items-end"
              data-reveal="right"
            >
              <p className="invisible text-gray-400 text-[15px] leading-relaxed max-w-md lg:ml-auto">
                Real experiences from clients who trust ADR for their automotive
                needs.
              </p>
            </div>
          </div>

          <div
            data-testimonial-row
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                data-testimonial
                className="invisible group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 lg:p-7 hover:border-purple-500/15 transition-all duration-500"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={"w-3.5 h-3.5 " + (
                        i < t.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-white/10"
                      )}
                    />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="pt-5 border-t border-white/[0.05]">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BLOG
          ═══════════════════════════════════════════ */}
      <section
        id="blog"
        className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 lg:px-12 border-t border-white/[0.04]"
      >
        <div className="max-w-[90rem] mx-auto">
          <div data-reveal="up" className="invisible mb-16">
            <span className="text-cyan-400/70 text-[11px] uppercase tracking-[0.3em] font-medium">
              Blog
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white mt-3 leading-[0.95]">
              LATEST POSTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                data-blog-card
                className="invisible group bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden hover:border-cyan-500/15 transition-all duration-500"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center relative overflow-hidden">
                  <span className="text-5xl text-white/[0.04] group-hover:scale-110 transition-transform duration-700">
                    ✦
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                </div>

                <div className="p-6 lg:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-500/8 px-2.5 py-1 rounded-full">
                      {post.tag}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors duration-300 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-cyan-400 text-sm font-medium mt-5 group-hover:gap-2.5 transition-all duration-300 cursor-pointer">
                    Read More{" "}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer
        data-footer
        className="invisible border-t border-white/[0.04] pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-12"
      >
        <div className="max-w-[90rem] mx-auto">
          {/* Big brand name - hidden on small screens */}
          <h2 className="hidden sm:block text-6xl md:text-7xl lg:text-[8rem] font-display text-white/[0.03] leading-[0.85] mb-12 lg:mb-16 tracking-tight select-none">
            ADR AUTO
            <br />
            PARTS TRADING
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <Image
                  src="/logo.png"
                  alt="ADR"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <div>
                  <span className="text-white font-semibold text-base block leading-tight">
                    ADR Auto Parts
                  </span>
                  <span className="text-[10px] text-gray-600 uppercase tracking-[0.15em]">
                    Trading
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Your complete automotive solutions partner in the Philippines.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#branches"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Our Branches
                  </a>
                </li>
                <li>
                  <a
                    href="#branches"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">
                Services
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#services"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    File Services
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#maintenance"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Maintenance
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Tuning
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-[0.15em] mb-5">
                Get Started
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#request-ticket"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Request Ticket
                  </a>
                </li>
                <li>
                  <a
                    href="#book-now"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Book Now
                  </a>
                </li>
                <li>
                  <a
                    href="#quotation"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Quotation
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="divider-line mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-gray-600">
              &copy; {new Date().getFullYear()} ADR Auto Parts Trading. All
              rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[11px] text-gray-600">
              <a
                href="#policies"
                className="hover:text-gray-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#policies"
                className="hover:text-gray-400 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════
          MODALS
          ═══════════════════════════════════════════ */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={closeModal}
          />
          <div className="relative bg-[#111118] border border-white/[0.08] rounded-2xl w-full max-w-md p-8 shadow-2xl shadow-black/50">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-display text-white mb-2">
                  SUBMITTED
                </h3>
                <p className="text-gray-400 text-sm">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : activeModal === "request" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-display text-white tracking-wide">
                    REQUEST TICKET
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Submit a service request or inquiry
                  </p>
                </div>
                <input
                  required
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/40 transition-colors"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/40 transition-colors"
                />
                <select
                  required
                  name="service"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-gray-400 text-sm focus:outline-none focus:border-red-500/40 transition-colors"
                >
                  <option value="">Select Service Type</option>
                  <option value="immo-off">Immo Off</option>
                  <option value="dpf-removal">DPF / EGR Removal</option>
                  <option value="tuning">ECU Tuning</option>
                  <option value="database">ECU Database</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="Describe your request..."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/40 resize-none transition-colors"
                />
                {formError && (
                  <p className="text-red-400 text-xs">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            ) : activeModal === "book" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                    <CalendarCheck className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-display text-white tracking-wide">
                    BOOK APPOINTMENT
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Schedule your vehicle service
                  </p>
                </div>
                <input
                  required
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/40 transition-colors"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/40 transition-colors"
                />
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500/40 transition-colors"
                />
                <select
                  required
                  name="service"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-gray-400 text-sm focus:outline-none focus:border-amber-500/40 transition-colors"
                >
                  <option value="">Select Service</option>
                  <option value="pms">PMS Package</option>
                  <option value="change-oil">Change Oil</option>
                  <option value="underchassis">Underchassis</option>
                  <option value="mechanical">Mechanical Repair</option>
                  <option value="atf">ATF Dialysis</option>
                  <option value="ecu">ECU Service</option>
                </select>
                <input
                  required
                  name="date"
                  type="date"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-gray-400 text-sm focus:outline-none focus:border-amber-500/40 transition-colors"
                />
                {formError && (
                  <p className="text-red-400 text-xs">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Booking..." : "Book Appointment"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                    <ClipboardList className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-display text-white tracking-wide">
                    GET QUOTATION
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Request a free price quote
                  </p>
                </div>
                <input
                  required
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 transition-colors"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 transition-colors"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number (optional)"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 transition-colors"
                />
                <textarea
                  required
                  name="items"
                  rows={3}
                  placeholder="Parts or services you need a quote for..."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 resize-none transition-colors"
                />
                {formError && (
                  <p className="text-red-400 text-xs">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Get Quote"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
