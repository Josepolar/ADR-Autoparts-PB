"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Button, Badge, Spinner } from "@/components/ui/modern-components";
import { CheckCircle, Truck, Calendar } from "lucide-react";
import Link from "next/link";

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  items: any[];
  shippingAddress: any;
  payment?: { status: string; method: string };
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();
        if (result.success && result.data) {
          setOrder(result.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-nardo-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold">
              ← Back to Home
            </Link>
            <h1 className="text-xl font-bold text-white">Order Confirmation</h1>
            <div className="w-20" />
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Success Message */}
        <Card className="p-8 text-center mb-8 border-2 border-green-500 bg-gradient-to-br from-nardo-gray-800 to-nardo-gray-900">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-nardo-gray-400 mb-6">
            Thank you for your order. We've received it and will process it shortly.
          </p>
          <div className="bg-nardo-gray-800 rounded-lg p-4">
            <p className="text-sm text-nardo-gray-400 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-cyber-blue-400">
              {order?.orderNumber || "ORD-XXXXX"}
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Status */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Shipping Status</h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Order Processed", done: true },
                  { step: 2, title: "Preparing for Shipment", done: order?.status === "PROCESSING" },
                  { step: 3, title: "Out for Delivery", done: order?.status === "SHIPPED" },
                  { step: 4, title: "Delivered", done: order?.status === "COMPLETED" },
                ].map((step) => (
                  <div key={step.step} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step.done
                          ? "bg-green-500 text-white"
                          : "bg-nardo-gray-700 text-nardo-gray-400"
                      }`}
                    >
                      {step.done ? "✓" : step.step}
                    </div>
                    <span
                      className={step.done ? "text-white font-semibold" : "text-nardo-gray-400"}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center pb-4 border-b border-nardo-gray-700 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-white">Item {idx + 1}</p>
                        <p className="text-sm text-nardo-gray-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-cyber-blue-400">
                        ₱{Number(item.totalPrice ?? 0).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-nardo-gray-400">No items found</p>
                )}
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Address
              </h2>
              {order?.shippingAddress ? (
                <div className="text-nardo-gray-300 space-y-1">
                  <p className="font-semibold">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="mt-2 text-sm">{order.shippingAddress.email}</p>
                  {order.shippingAddress.phone && <p className="text-sm">{order.shippingAddress.phone}</p>}
                </div>
              ) : (
                <p className="text-nardo-gray-400">Address not available</p>
              )}
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-20">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-nardo-gray-400 mb-1">Order Date</p>
                  <p className="text-white font-semibold">
                    {order
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-nardo-gray-400 mb-1">Status</p>
                  <Badge variant="success">{order?.status || "PENDING"}</Badge>
                </div>

                <div>
                  <p className="text-sm text-nardo-gray-400 mb-1">Payment Method</p>
                  <p className="text-white font-semibold">
                    {order?.payment?.method || "Cash on Delivery"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-nardo-gray-400 mb-1">Payment Status</p>
                  <Badge
                    variant={
                      order?.payment?.status === "COMPLETED" ? "success" : "warning"
                    }
                  >
                    {order?.payment?.status || "PENDING"}
                  </Badge>
                </div>

                <div className="pt-6 border-t border-nardo-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-nardo-gray-400">Total</span>
                    <span className="text-2xl font-bold text-cyber-blue-400">
                      ₱{Number(order?.totalAmount ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <Button variant="primary" size="sm" className="w-full mb-2">
                    <Link href="/orders">Track Order</Link>
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    <Link href="/parts">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="p-6 mt-8 bg-nardo-gray-800 border border-nardo-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">
            <Calendar className="w-5 h-5 inline mr-2" />
            What Happens Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-cyber-blue-400 mb-2">📧 Confirmation Email</p>
              <p className="text-nardo-gray-400">
                We'll send you a confirmation email with your order details and tracking number.
              </p>
            </div>
            <div>
              <p className="font-semibold text-cyber-blue-400 mb-2">📦 Preparation</p>
              <p className="text-nardo-gray-400">
                Your order will be prepared and packed with care within 1-2 business days.
              </p>
            </div>
            <div>
              <p className="font-semibold text-cyber-blue-400 mb-2">🚚 Shipping</p>
              <p className="text-nardo-gray-400">
                Track your package in real-time as it makes its way to your doorstep.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
