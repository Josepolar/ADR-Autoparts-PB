"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { ArrowRight, MapPin, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    zipCode: "",
    paymentMethod: "COD",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form
      if (
        !formData.firstName ||
        !formData.email ||
        !formData.street ||
        !formData.city
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Calculate tax
      const tax = totalPrice * 0.12;
      const finalTotal = totalPrice + tax;

      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "test-user-1", // TODO: Replace with actual user ID from session
          items: items.map((item) => ({
            partId: item.partId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: finalTotal,
          billingAddress: formData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Failed to create order");
        setLoading(false);
        return;
      }

      // Clear cart and redirect to confirmation page
      clearCart();
      router.push(`/orders/${result.order.id}?success=true`);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0f0f12]">
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Cart is Empty</h2>
            <p className="text-gray-500 text-sm mb-6">Add items to your cart to proceed to checkout.</p>
            <Link
              href="/parts"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const subtotal = totalPrice;
  const tax = subtotal * 0.12;
  const finalTotal = subtotal + tax;

  const inputClasses = "w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors";

  return (
    <main className="min-h-screen bg-[#0f0f12]">
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
            <p className="text-gray-500 text-sm">Complete your order</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleCheckout}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-400 text-sm mb-6">
                  {error}
                </div>
              )}

              {/* Delivery Address */}
              <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h2 className="text-base font-bold text-white">Delivery Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`${inputClasses} mb-3`}
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${inputClasses} mb-3`}
                />

                <input
                  type="text"
                  name="street"
                  placeholder="Street Address *"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className={`${inputClasses} mb-3`}
                />

                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    name="province"
                    placeholder="Province/State"
                    value={formData.province}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-4">
                <h2 className="text-base font-bold text-white mb-4">Payment Method</h2>
                <label className="flex items-center p-4 border border-amber-500/30 bg-amber-500/5 rounded-xl cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-white text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  More payment options coming soon (Credit Card, Bank Transfer, E-Wallet)
                </p>
              </div>

              {/* Order Items Review */}
              <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-4">
                <h2 className="text-base font-bold text-white mb-4">Order Review</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center pb-3 border-b border-[#2a2a35] last:border-0"
                    >
                      <div>
                        <p className="font-medium text-white text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-blue-400 text-sm">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>

              <div className="space-y-3 pb-4 border-b border-[#2a2a35]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (12%)</span>
                  <span className="text-white font-medium">₱{Math.round(tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">FREE</span>
                </div>
              </div>

              <div className="mt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-white">Total</span>
                  <span className="text-lg font-bold text-red-400">
                    ₱{Math.round(finalTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/cart"
                className="block w-full py-2.5 bg-[#1e1e28] border border-[#2a2a35] text-gray-300 font-medium rounded-xl hover:bg-[#252530] transition-all text-center text-sm"
              >
                Edit Cart
              </Link>

              <div className="mt-4 bg-[#1e1e28] border border-[#2a2a35] rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500">
                  ✓ 100% Secure Checkout<br/>
                  ✓ Money Back Guarantee<br/>
                  ✓ Free Shipping on Orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
