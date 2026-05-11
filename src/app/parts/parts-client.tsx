"use client";

import { useEffect, useState } from "react";
import { getParts } from "@/server/actions";
import { Spinner } from "@/components/ui/modern-components";
import {
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Search,
  Home,
  ChevronRight,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useSearchParams } from "next/navigation";

interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string | null;
  costPrice: number | any;
  retailPrice: number | any;
  totalStock: number;
  manufacturer: string | null;
  imageUrl?: string | null;
  variants?: any[];
}

const CATEGORIES = [
  { value: "all", label: "All Parts" },
  { value: "BRAKES", label: "Brakes" },
  { value: "ENGINE_OILS", label: "Engine Oils" },
  { value: "FILTERS", label: "Filters" },
  { value: "SPARK_PLUGS", label: "Spark Plugs" },
  { value: "SUSPENSION", label: "Suspension" },
  { value: "TRANSMISSION", label: "Transmission" },
  { value: "COOLING", label: "Cooling System" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "HOSES", label: "Hoses" },
  { value: "ECU_UNITS", label: "ECU Units" },
  { value: "CLOCK_SPRINGS", label: "Clock Springs" },
  { value: "TIMING_BELTS", label: "Timing Belts" },
  { value: "INJECTORS", label: "Injectors" },
  { value: "BODY", label: "Body Parts" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: Aâ€“Z" },
];

function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

export default function PartsClient() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addItem, itemCount } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    loadParts();
  }, [search, category]);

  async function loadParts() {
    setLoading(true);
    const result = await getParts({
      search: search || undefined,
      category: category !== "all" ? category : undefined,
    });
    if (result.success) {
      setParts(result.data || []);
    }
    setLoading(false);
  }

  function handleAddToCart(part: Part) {
    addItem({
      partId: part.id,
      name: part.name,
      sku: part.sku,
      price: parseFloat(String(part.retailPrice)),
      quantity: 1,
    });
    setAddedItem(part.id);
    setTimeout(() => setAddedItem(null), 2000);
  }

  function sortedParts() {
    const p = [...parts];
    if (sort === "price_asc") return p.sort((a, b) => a.retailPrice - b.retailPrice);
    if (sort === "price_desc") return p.sort((a, b) => b.retailPrice - a.retailPrice);
    if (sort === "name_asc") return p.sort((a, b) => a.name.localeCompare(b.name));
    return p;
  }

  const displayedParts = sortedParts();

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-14 sm:pt-16 lg:pt-20">
      {/* Page Header */}
      <div className="border-b border-white/[0.04] bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                <Link href="/" className="hover:text-gray-400 transition-colors flex items-center gap-1">
                  <Home className="w-3 h-3" /> Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-400">Shop</span>
                {category !== "all" && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white">{categoryLabel(category)}</span>
                  </>
                )}
              </nav>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-white tracking-tight">
                Auto Parts Shop
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Genuine and premium aftermarket parts for all vehicle types
              </p>
            </div>
            <Link
              href="/cart"
              className="relative shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-[#16161d] border border-[#2a2a35] rounded-xl text-gray-300 hover:text-white hover:bg-[#1e1e28] transition-all text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar â€” desktop */}
          <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
            <div className="sticky top-24">
              {/* Search */}
              <div className="flex items-center bg-[#16161d] border border-[#2a2a35] rounded-xl px-3 py-2.5 gap-2 mb-6">
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search parts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
                />
              </div>

              {/* Categories */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-medium mb-3">
                  Categories
                </p>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer text-left ${
                        category === cat.value
                          ? "bg-white/[0.08] text-white font-medium"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {category === cat.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Search + Filter Toggle */}
            <div className="flex gap-2 mb-4 lg:hidden">
              <div className="flex-1 flex items-center bg-[#16161d] border border-[#2a2a35] rounded-xl px-3 py-2.5 gap-2">
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search parts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
                />
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 px-3 py-2.5 bg-[#16161d] border border-[#2a2a35] rounded-xl text-gray-400 hover:text-white transition-all text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile sidebar panel */}
            {sidebarOpen && (
              <div className="lg:hidden mb-4 bg-[#16161d] border border-[#2a2a35] rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-medium mb-3">Categories</p>
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => { setCategory(cat.value); setSidebarOpen(false); }}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat.value
                          ? "bg-white/[0.1] text-white font-medium"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? "Loading..." : (
                  <span>
                    Showing <span className="text-white font-medium">{displayedParts.length}</span>{" "}
                    {displayedParts.length === 1 ? "part" : "parts"}
                    {category !== "all" && (
                      <> in <span className="text-white">{categoryLabel(category)}</span></>
                    )}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 hidden sm:block">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 bg-[#16161d] border border-[#2a2a35] rounded-lg text-gray-300 focus:outline-none text-sm cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#16161d]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="text-gray-500 mt-4 text-sm">Loading catalog...</p>
                </div>
              </div>
            ) : displayedParts.length === 0 ? (
              <div className="border border-[#2a2a35] rounded-2xl p-16 text-center">
                <Package className="w-14 h-14 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No parts found</p>
                <p className="text-gray-600 text-sm mt-1">Try a different category or search term</p>
                <button
                  onClick={() => { setCategory("all"); setSearch(""); }}
                  className="mt-5 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {displayedParts.map((part) => (
                  <div
                    key={part.id}
                    className="group bg-[#16161d] border border-[#2a2a35] rounded-3xl flex flex-col hover:border-[#3a3a45] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-64 bg-[#1a1a22] overflow-hidden">
                      {part.imageUrl ? (
                        <img
                          src={part.imageUrl}
                          alt={part.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                            <Package className="w-10 h-10 text-gray-700" />
                          </div>
                        </div>
                      )}
                      {/* Stock overlay */}
                      <div className="absolute top-3 left-3">
                        {part.totalStock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-sm text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-sm text-red-400 border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Out of Stock
                          </span>
                        )}
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-gray-400 border border-white/[0.08]">
                          {categoryLabel(part.category)}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1.5 line-clamp-2 leading-snug">
                        {part.name}
                      </h3>
                      {part.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
                          {part.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2a2a35]">
                        <div>
                          <p className="text-2xl font-bold text-white">
                            â‚±{parseFloat(String(part.retailPrice)).toLocaleString()}
                          </p>
                          {part.manufacturer && (
                            <p className="text-xs text-gray-600 mt-0.5">{part.manufacturer}</p>
                          )}
                        </div>
                        <button
                          disabled={part.totalStock === 0}
                          onClick={() => handleAddToCart(part)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            addedItem === part.id
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                          }`}
                        >
                          {addedItem === part.id ? (
                            <>âœ“ Added</>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-10 border-t border-white/[0.04]">
              <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Genuine Parts</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Authentic OEM and premium aftermarket parts</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Fast Shipping</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Same-day processing, nationwide delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">100% Warranty</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Full refund if not satisfied with quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
