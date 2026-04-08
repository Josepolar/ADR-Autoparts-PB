"use client";

import { useCart } from "@/context/cart-context";
import { Card, Button, Badge, Alert } from "@/components/ui/modern-components";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/parts" className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold">
              ← Back to Parts
            </Link>
            <h1 className="text-xl font-bold text-white">Shopping Cart</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {items.length === 0 ? (
          <Card className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-nardo-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-nardo-gray-400 mb-6">
              Browse our parts catalog and add items to get started.
            </p>
            <Link href="/parts">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Cart Items ({items.length})</h2>

              {items.map((item) => (
                <Card key={item.id} className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-nardo-gray-400">SKU: {item.sku}</p>
                    <p className="text-lg font-bold text-cyber-blue-400 mt-2">
                      ₱{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mx-6">
                    <button
                      onClick={() =>
                        updateQuantity(item.partId, item.quantity - 1)
                      }
                      className="p-1 hover:bg-nardo-gray-700 rounded transition"
                    >
                      <Minus className="w-4 h-4 text-nardo-gray-300" />
                    </button>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.partId, parseInt(e.target.value) || 1)
                      }
                      className="w-16 px-2 py-1 text-center bg-nardo-gray-800 border border-nardo-gray-700 rounded text-white"
                    />

                    <button
                      onClick={() =>
                        updateQuantity(item.partId, item.quantity + 1)
                      }
                      className="p-1 hover:bg-nardo-gray-700 rounded transition"
                    >
                      <Plus className="w-4 h-4 text-nardo-gray-300" />
                    </button>
                  </div>

                  <div className="text-right mr-6">
                    <p className="text-sm text-nardo-gray-400">Subtotal</p>
                    <p className="text-xl font-bold text-white">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.partId)}
                    className="p-2 text-nardo-gray-400 hover:text-cyber-blue-500 hover:bg-nardo-gray-800 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </Card>
              ))}

              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-danger w-full"
              >
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-3 border-b border-nardo-gray-700 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-nardo-gray-400">Subtotal</span>
                    <span className="text-white font-semibold">
                      ₱{totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-nardo-gray-400">Shipping</span>
                    <Badge variant="success">FREE</Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-nardo-gray-400">Tax</span>
                    <span className="text-white font-semibold">
                      ₱{Math.round(totalPrice * 0.12).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-6 text-xl">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-cyber-blue-400">
                    ₱{Math.round(totalPrice * 1.12).toLocaleString()}
                  </span>
                </div>

                <Link href="/checkout" className="block mb-3">
                  <Button variant="primary" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/parts" className="block">
                  <Button variant="secondary" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>

                <Alert type="info" className="mt-4">
                  💳 Secure checkout with Stripe. We also accept cash on delivery.
                </Alert>
              </Card>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
