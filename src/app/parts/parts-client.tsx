"use client";

import { useEffect, useState } from "react";
import { getParts } from "@/server/actions";
import { Spinner } from "@/components/ui/modern-components";
import { ShoppingCart, Filter, Package, Truck, Shield, Search } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

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
  variants?: any[];
}

export default function PartsClient() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { addItem, itemCount } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);

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

  const categories = [
    { value: "all", label: "All Parts" },
    { value: "ENGINE_OILS", label: "Engine Oils" },
    { value: "FILTERS", label: "Filters" },
    { value: "SPARK_PLUGS", label: "Spark Plugs" },
    { value: "BRAKES", label: "Brakes" },
    { value: "SUSPENSION", label: "Suspension" },
  ];

  return (
    <main className="min-h-screen bg-[#0f0f12]">
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PartsPro E-Shop</h1>
              <p className="text-gray-500 text-sm">Quality automotive parts with real-time inventory</p>
            </div>
          </div>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-[#16161d] border border-[#2a2a35] rounded-xl text-gray-300 hover:text-white hover:bg-[#1e1e28] transition-all text-sm font-medium"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <div className="md:col-span-2 flex items-center bg-[#16161d] border border-[#2a2a35] rounded-xl px-3 py-2.5 gap-2">
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search parts by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#16161d] border border-[#2a2a35] rounded-xl text-gray-300 focus:outline-none focus:border-blue-500/50 transition text-sm cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-[#16161d]">
                {cat.label}
              </option>
            ))}
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#16161d] border border-[#2a2a35] rounded-xl text-gray-400 hover:text-gray-200 hover:bg-[#1e1e28] transition-all text-sm font-medium cursor-pointer">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-gray-500 mt-4 text-sm">Loading parts catalog...</p>
            </div>
          </div>
        ) : parts.length === 0 ? (
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No parts found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {parts.map((part) => (
              <div key={part.id} className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5 flex flex-col hover:border-[#3a3a45] transition-all duration-200">
                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1e1e28] text-gray-400 border border-[#2a2a35]">
                    {part.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 line-clamp-2">{part.name}</h3>
                <p className="text-xs text-gray-500 mb-1">SKU: {part.sku}</p>
                <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-2">{part.description}</p>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#2a2a35]">
                  <div>
                    <p className="text-xl font-bold text-blue-400">₱{part.retailPrice.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 line-through">
                      ₱{(Math.round(part.retailPrice * 1.2)).toLocaleString()}
                    </p>
                  </div>
                  {part.totalStock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {part.totalStock} In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Out of Stock
                    </span>
                  )}
                </div>

                <button
                  disabled={part.totalStock === 0}
                  onClick={() => handleAddToCart(part)}
                  className={`w-full py-2.5 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    addedItem === part.id
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/10"
                  }`}
                >
                  {addedItem === part.id ? "✓ Added to Cart" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Genuine Parts</h4>
              <p className="text-gray-500 text-xs">Authentic OEM and premium aftermarket parts</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Fast Shipping</h4>
              <p className="text-gray-500 text-xs">Same-day processing nationwide delivery</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-[#16161d] border border-[#2a2a35] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">100% Warranty</h4>
              <p className="text-gray-500 text-xs">Full refund if not satisfied with quality</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
