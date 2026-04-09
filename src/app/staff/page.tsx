"use client";

import { useEffect, useState } from "react";
import { getOrdersData, getAppointments } from "@/server/actions";
import {
  Card,
  Button,
  Badge,
  Spinner,
} from "@/components/ui/modern-components";
import {
  Calendar,
  ShoppingCart,
  Phone,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/auth/logout-button";

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "orders">("bookings");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "bookings") {
        const result = await getAppointments();
        if (result.success) {
          setAppointments(result.data || []);
        }
      } else {
        const result = await getOrdersData();
        if (result.success) {
          setOrders(result.data || []);
        }
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
              ADR Staff Portal
            </Link>
            <LogoutButton variant="secondary" size="sm" />
          </div>
        </div>
      </nav>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Staff Dashboard</h1>

        <div className="flex gap-4 mb-8 border-b border-nardo-gray-700">
          {["bookings", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-4 font-semibold transition-all border-b-2 ${
                activeTab === tab
                  ? "border-cyber-blue-500 text-cyber-blue-400"
                  : "border-transparent text-nardo-gray-400 hover:text-nardo-gray-300"
              }`}
            >
              {tab === "bookings" && "Service Bookings"}
              {tab === "orders" && "Parts Orders"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : activeTab === "bookings" ? (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cyber-blue-500" />
              Service Appointments
            </h2>

            {appointments.length === 0 ? (
              <p className="text-nardo-gray-400">No upcoming appointments</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-nardo-gray-700">
                    <tr>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Service</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Customer</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Date & Time</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Status</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt: any) => (
                      <tr
                        key={apt.id}
                        className="border-b border-nardo-gray-700 hover:bg-nardo-gray-800/50"
                      >
                        <td className="py-3">{apt.service?.name || "N/A"}</td>
                        <td className="py-3">{apt.user?.email || "N/A"}</td>
                        <td className="py-3 text-nardo-gray-400">
                          {new Date(apt.scheduledStart).toLocaleDateString()} @{" "}
                          {new Date(apt.scheduledStart).toLocaleTimeString()}
                        </td>
                        <td className="py-3">
                          <Badge variant="warning">{apt.status}</Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-cyber-blue-500" />
              Parts Orders
            </h2>

            {orders.length === 0 ? (
              <p className="text-nardo-gray-400">No orders</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-nardo-gray-700">
                    <tr>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Order #</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Customer</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Amount</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Status</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr
                        key={order.id}
                        className="border-b border-nardo-gray-700 hover:bg-nardo-gray-800/50"
                      >
                        <td className="py-3 text-cyber-blue-400">#{order.orderNumber}</td>
                        <td className="py-3">{order.user?.email || "N/A"}</td>
                        <td className="py-3 font-semibold">₱{order.totalAmount.toLocaleString()}</td>
                        <td className="py-3">
                          <Badge variant={order.status === "COMPLETED" ? "success" : "warning"}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </section>
    </main>
  );
}
