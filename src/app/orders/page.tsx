"use client";

import { useEffect, useState } from "react";
import { Card, Button, Badge, Spinner, Alert } from "@/components/ui/modern-components";
import { getOrdersData } from "@/server/actions";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number | any;
  createdAt: Date;
  user?: { email: string; name: string | null };
  payment?: { status: string } | null;
  items?: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED">("all");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const result = await getOrdersData();
      if (result.success && result.data) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
    setLoading(false);
  }

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "SHIPPED":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "PROCESSING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "SHIPPED":
        return "info";
      case "PROCESSING":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold">
              ← Back to Home
            </Link>
            <h1 className="text-xl font-bold text-white">My Orders</h1>
            <Link href="/parts">
              <Button variant="secondary" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <Package className="w-16 h-16 text-nardo-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-nardo-gray-400 mb-6">
              Start shopping to see your orders here.
            </p>
            <Link href="/parts">
              <Button variant="primary">Shop Now</Button>
            </Link>
          </Card>
        ) : (
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {["all", "PENDING", "PROCESSING", "SHIPPED", "COMPLETED"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      filter === status
                        ? "bg-cyber-blue-500 text-white shadow-lg"
                        : "bg-nardo-gray-700 text-nardo-gray-300 hover:bg-nardo-gray-600"
                    }`}
                  >
                    {status === "all"
                      ? "All Orders"
                      : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                )
              )}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-nardo-gray-400">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {order.status}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-nardo-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-nardo-gray-300 mb-3">
                        Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-nardo-gray-300">
                              {item.quantity}x Item
                            </span>
                            <span className="text-nardo-gray-400">
                              ₱{item.totalPrice?.toLocaleString() || "0"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-nardo-gray-400 mb-1">Total Amount</p>
                      <p className="text-lg font-bold text-cyber-blue-400">
                        ₱{(order.totalAmount as any).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-nardo-gray-400 mb-1">Payment</p>
                      <Badge variant={order.payment?.status === "COMPLETED" ? "success" : "warning"}>
                        {order.payment?.status || "Pending"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-nardo-gray-400 mb-1">Shipping</p>
                      <Badge variant="info">FREE</Badge>
                    </div>
                    <div className="flex items-start">
                      {getStatusIcon(order.status)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                    {order.status === "SHIPPED" && (
                      <Button variant="ghost" size="sm">
                        Track Package
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <Alert type="info">
                No orders found with status "{filter === "all" ? "" : filter}".
              </Alert>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
