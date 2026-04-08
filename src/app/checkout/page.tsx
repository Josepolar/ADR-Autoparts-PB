"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Card, Button, Input, Spinner, Alert } from "@/components/ui/modern-components";
import { ArrowRight, MapPin } from "lucide-react";
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
      <main className="min-h-screen bg-nardo-gray-900">
        <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold"
              >
                ← Back to Home
              </Link>
              <h1 className="text-xl font-bold text-white">Checkout</h1>
              <div className="w-20" />
            </div>
          </div>
        </nav>

        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-2">Cart is Empty</h2>
            <p className="text-nardo-gray-400 mb-6">Add items to your cart to proceed to checkout.</p>
            <Link href="/parts">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </Card>
        </section>
      </main>
    );
  }

  const subtotal = totalPrice;
  const tax = subtotal * 0.12;
  const finalTotal = subtotal + tax;

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/cart"
              className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold"
            >
              ← Back to Cart
            </Link>
            <h1 className="text-xl font-bold text-white">Checkout</h1>
            <div className="w-20" />
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleCheckout}>
              {error && <Alert type="danger" className="mb-6">{error}</Alert>}

              {/* Delivery Address */}
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-cyber-blue-500" />
                  <h2 className="text-xl font-bold text-white">Delivery Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mb-4"
                />

                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mb-4"
                />

                <Input
                  type="text"
                  name="street"
                  placeholder="Street Address *"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="mb-4"
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="text"
                    name="province"
                    placeholder="Province/State"
                    value={formData.province}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-nardo-gray-600 rounded-lg cursor-pointer hover:bg-nardo-gray-800 transition-colors bg-nardo-gray-800 border-cyber-blue-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-cyber-blue-500"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-white">Cash on Delivery</p>
                      <p className="text-sm text-nardo-gray-400">
                        Pay when your order arrives
                      </p>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-nardo-gray-400 mt-4">
                  💡 More payment options coming soon (Credit Card, Bank Transfer, E-Wallet)
                </p>
              </Card>

              {/* Order Items Review */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Order Review</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center pb-3 border-b border-nardo-gray-700 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-nardo-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-cyber-blue-400">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Checkout Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-20">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-3 pb-6 border-b border-nardo-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-nardo-gray-400">Subtotal</span>
                  <span className="text-white">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-nardo-gray-400">Tax (12%)</span>
                  <span className="text-white">₱{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-nardo-gray-400">Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-cyber-blue-400">
                    ₱{finalTotal.toLocaleString()}
                  </span>
                </div>

                <Link href="/cart">
                  <Button variant="secondary" size="sm" className="w-full">
                    Edit Cart
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-nardo-gray-800 rounded-lg">
                <p className="text-xs text-nardo-gray-400">
                  ✓ 100% Secure Checkout<br/>
                  ✓ Money Back Guarantee<br/>
                  ✓ Free Shipping on Orders
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
