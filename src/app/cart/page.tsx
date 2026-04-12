"use client";

import { useCart } from "@/context/cart-context";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-[#0f0f12]">
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
              <p className="text-gray-500 text-sm">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Browse our parts catalog and add items to get started.</p>
            <Link
              href="/parts"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                    <p className="text-base font-bold text-blue-400 mt-2">
                      ₱{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.partId, item.quantity - 1)}
                      className="p-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg hover:bg-[#252530] transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.partId, parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1.5 text-center bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm outline-none focus:border-blue-500/50"
                    />

                    <button
                      onClick={() => updateQuantity(item.partId, item.quantity + 1)}
                      className="p-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg hover:bg-[#252530] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>

                  <div className="text-right sm:w-28">
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="text-lg font-bold text-white">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.partId)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="w-full py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all cursor-pointer"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>

                <div className="space-y-3 border-b border-[#2a2a35] pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-medium">₱{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (12%)</span>
                    <span className="text-white font-medium">₱{Math.round(totalPrice * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-base font-bold text-white">Total</span>
                  <span className="text-lg font-bold text-red-400">
                    ₱{Math.round(totalPrice * 1.12).toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-center text-sm mb-3 shadow-lg shadow-red-500/20"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/parts"
                  className="block w-full py-3 bg-[#1e1e28] border border-[#2a2a35] text-gray-300 font-medium rounded-xl hover:bg-[#252530] transition-all text-center text-sm"
                >
                  Continue Shopping
                </Link>

                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-400 text-xs">
                  💳 Secure checkout with Stripe. We also accept cash on delivery.
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
