"use client";

import { useEffect, useState } from "react";
import { getParts } from "@/server/actions";
import { Card, Button, Badge, Spinner, SearchBar } from "@/components/ui/modern-components";
import { ShoppingCart, Filter } from "lucide-react";
import Link from "next/link";

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

  const categories = [
    { value: "all", label: "All Parts" },
    { value: "ENGINE_OILS", label: "Engine Oils" },
    { value: "FILTERS", label: "Filters" },
    { value: "SPARK_PLUGS", label: "Spark Plugs" },
    { value: "BRAKES", label: "Brakes" },
    { value: "SUSPENSION", label: "Suspension" },
  ];

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold">
              ← Back to Home
            </Link>
            <div className="flex gap-4">
              <button className="relative p-2 text-nardo-gray-100 hover:text-cyber-blue-500 transition">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-cyber-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <Link href="/auth/signin">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">PartsPro E-Shop</h1>
          <p className="text-nardo-gray-300">
            Quality automotive parts with real-time inventory and secure checkout.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <SearchBar
            placeholder="Search parts..."
            onSearch={setSearch}
            className="md:col-span-2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg text-nardo-gray-100 focus:outline-none focus:border-cyber-blue-500 transition"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <Button variant="secondary" size="md" icon={Filter} className="w-full">
            Filter
          </Button>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : parts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-nardo-gray-400">No parts found matching your search.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {parts.map((part) => (
              <Card key={part.id} className="flex flex-col hover:shadow-lg transition">
                <div className="mb-3">
                  <Badge variant="default">{part.category}</Badge>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{part.name}</h3>

                <p className="text-sm text-nardo-gray-400 mb-2">SKU: {part.sku}</p>

                <p className="text-sm text-nardo-gray-300 mb-4 flex-1">{part.description}</p>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-nardo-gray-700">
                  <div>
                    <p className="text-2xl font-bold text-cyber-blue-400">₱{part.retailPrice.toLocaleString()}</p>
                    <p className="text-xs text-nardo-gray-400 line-through">
                      ₱{(Math.round(part.retailPrice * 1.2)).toLocaleString()}
                    </p>
                  </div>
                  {part.totalStock > 0 ? (
                    <Badge variant="success">{part.totalStock} In Stock</Badge>
                  ) : (
                    <Badge variant="danger">Out of Stock</Badge>
                  )}
                </div>

                <Button
                  variant={part.totalStock > 0 ? "primary" : "secondary"}
                  size="md"
                  disabled={part.totalStock === 0}
                  icon={ShoppingCart}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-white mb-2">Genuine Parts</h3>
            <p className="text-nardo-gray-300">Authentic OEM and premium aftermarket parts</p>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="text-lg font-bold text-white mb-2">Fast Shipping</h3>
            <p className="text-nardo-gray-300">Same-day processing nationwide delivery</p>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold text-white mb-2">100% Warranty</h3>
            <p className="text-nardo-gray-300">Full refund if not satisfied with quality</p>
          </Card>
        </div>
      </section>
    </main>
  );
}
