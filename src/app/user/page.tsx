"use client";

import { useEffect, useState } from "react";
import { getOrdersData, getAppointments } from "@/server/actions";
import {
  Card,
  Button,
  Badge,
  Spinner,
  StatsCard,
} from "@/components/ui/modern-components";
import {
  Package,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "bookings">("overview");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const ordersResult = await getOrdersData();
      if (ordersResult.success) {
        setOrders(ordersResult.data || []);
      }

      const appointmentsResult = await getAppointments();
      if (appointmentsResult.success) {
        setAppointments(appointmentsResult.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-white font-bold text-xl">
              ADR Autoparts
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Link href="/auth/signin">
                <Button variant="secondary" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-nardo-gray-400">Manage your orders, appointments, and account</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            label="Active Orders"
            value={orders.filter((o) => o.status !== "COMPLETED").length}
            icon={Package}
          />
          <StatsCard
            label="Upcoming Bookings"
            value={appointments.filter((a) => new Date(a.scheduledStart) > new Date()).length}
            icon={Calendar}
          />
          <StatsCard
            label="Total Spent"
            value={`₱${orders
              .filter((o) => o.status === "COMPLETED")
              .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
              .toLocaleString()}`}
            icon={Package}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-nardo-gray-700">
          {["overview", "orders", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-4 font-semibold transition-all border-b-2 ${
                activeTab === tab
                  ? "border-cyber-blue-500 text-cyber-blue-400"
                  : "border-transparent text-nardo-gray-400 hover:text-nardo-gray-300"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "orders" && "My Orders"}
              {tab === "bookings" && "My Bookings"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : activeTab === "overview" ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-cyber-blue-500" />
                Recent Orders
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-nardo-gray-400 mb-4">No orders yet</p>
                  <Link href="/parts">
                    <Button variant="primary" size="sm">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-nardo-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-white">#{order.orderNumber}</p>
                        <p className="text-sm text-nardo-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cyber-blue-400">₱{order.totalAmount.toLocaleString()}</p>
                        <Badge variant="warning">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                  {orders.length > 3 && (
                    <Link href="/orders" className="block">
                      <Button variant="secondary" className="w-full mt-3">
                        View All Orders
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>

            {/* Upcoming Bookings */}
            <Card>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyber-blue-500" />
                Upcoming Bookings
              </h2>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-nardo-gray-400 mb-4">No upcoming bookings</p>
                  <Link href="/rapide">
                    <Button variant="primary" size="sm">
                      Book Service
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex justify-between items-center p-3 bg-nardo-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-white">{apt.service?.name}</p>
                        <p className="text-sm text-nardo-gray-400">
                          {new Date(apt.scheduledStart).toLocaleDateString()} @{" "}
                          {new Date(apt.scheduledStart).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant={apt.status === "COMPLETED" ? "success" : "info"}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                  {appointments.length > 3 && (
                    <Button variant="secondary" className="w-full mt-3">
                      View All Bookings
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        ) : activeTab === "orders" ? (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-nardo-gray-400 mb-4">No orders yet</p>
                <Link href="/parts">
                  <Button variant="primary">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-nardo-gray-700 rounded-lg hover:bg-nardo-gray-800/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-nardo-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge variant={order.status === "COMPLETED" ? "success" : "warning"}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-nardo-gray-400">{order.items?.length || 0} items</p>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-cyber-blue-400">
                          ₱{order.totalAmount.toLocaleString()}
                        </p>
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">My Service Bookings</h2>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-nardo-gray-400 mb-4">No bookings yet</p>
                <Link href="/rapide">
                  <Button variant="primary">Book a Service</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 border border-nardo-gray-700 rounded-lg hover:bg-nardo-gray-800/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">{apt.service?.name}</h3>
                        <p className="text-sm text-nardo-gray-400">
                          {new Date(apt.scheduledStart).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(apt.scheduledStart).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge variant={apt.status === "COMPLETED" ? "success" : "info"}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-nardo-gray-400">
                        ₱{(apt.servicePrice || 0).toLocaleString()}
                      </p>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </section>
    </main>
  );
}
