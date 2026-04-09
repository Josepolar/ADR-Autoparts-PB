"use client";

import { useEffect, useState } from "react";
import {
  getAdminStats,
  getOrdersData,
  getImmoRequests,
} from "@/server/actions";
import {
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  StatsCard,
} from "@/components/ui/modern-components";
import {
  Users,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import InventoryManagement from "@/components/admin/inventory-management";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number | any;
  pendingImmoRequests: number;
}

interface Order {
  id: string;
  orderNumber: string;
  user?: { email: string; name: string | null };
  status: string;
  totalAmount: number | any;
  createdAt: Date;
  payment?: { status: string } | null;
  items?: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [immoRequests, setImmoRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory" | "immo">("overview");

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const statsResult = await getAdminStats();
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        }

        const ordersResult = await getOrdersData();
        if (ordersResult.success) {
          setOrders(ordersResult.data || []);
        }
      } else if (activeTab === "immo") {
        const immoResult = await getImmoRequests();
        if (immoResult.success) {
          setImmoRequests(immoResult.data || []);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-white font-bold text-xl">
              ADR Admin
            </Link>
            <Link href="/auth/signin">
              <Button variant="secondary" size="sm">
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-nardo-gray-700">
          {["overview", "orders", "inventory", "immo"].map((tab) => (
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
              {tab === "orders" && "Orders"}
              {tab === "inventory" && "Inventory"}
              {tab === "immo" && "Tuning Requests"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : activeTab === "overview" ? (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                label="Total Users"
                value={stats?.totalUsers || 0}
                icon={Users}
                trend={12}
              />
              <StatsCard
                label="Total Orders"
                value={stats?.totalOrders || 0}
                icon={ShoppingCart}
                trend={8}
              />
              <StatsCard
                label="Revenue"
                value={`₱${(stats?.totalRevenue || 0).toLocaleString()}`}
                icon={DollarSign}
                trend={15}
              />
              <StatsCard
                label="Pending Requests"
                value={stats?.pendingImmoRequests || 0}
                icon={AlertCircle}
                trend={-3}
              />
            </div>

            {/* Recent Orders */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyber-blue-500" />
                Recent Orders
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-nardo-gray-700">
                    <tr>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Order #</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Customer</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Amount</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Status</th>
                      <th className="text-nardo-gray-300 font-semibold pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b border-nardo-gray-700 hover:bg-nardo-gray-800/50">
                        <td className="py-3 text-cyber-blue-400">#{order.orderNumber}</td>
                        <td className="py-3">{order.user?.email || "N/A"}</td>
                        <td className="py-3 font-semibold">₱{order.totalAmount.toLocaleString()}</td>
                        <td className="py-3">
                          <Badge
                            variant={
                              order.status === "COMPLETED"
                                ? "success"
                                : order.status === "PENDING"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-nardo-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <Link href="/admin/orders">
                  <Button variant="secondary">View All Orders</Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : activeTab === "orders" ? (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">All Orders</h2>
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
                  {orders.map((order) => (
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
          </Card>
        ) : activeTab === "immo" ? (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">📤 Immo-Off Tuning Requests</h2>

            {immoRequests.length === 0 ? (
              <Alert type="info">No tuning requests at this time.</Alert>
            ) : (
              <div className="space-y-4">
                {immoRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="p-4 bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white mb-2">
                          {request.vehicle?.year}{" "}
                          {request.vehicle?.make}{" "}
                          {request.vehicle?.model}
                        </h3>
                        <p className="text-sm text-nardo-gray-400">
                          User: {request.user?.email}
                        </p>
                        <p className="text-sm text-nardo-gray-400">
                          Uploaded: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === "READY_FOR_DOWNLOAD"
                            ? "success"
                            : request.status === "PROCESSING"
                              ? "warning"
                              : "info"
                        }
                      >
                        {request.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    {request.status === "PENDING_UPLOAD" && (
                      <Button variant="primary" size="md" className="mt-4 w-full">
                        Download & Process
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : activeTab === "inventory" ? (
          <InventoryManagement />
        ) : null}
      </section>
    </main>
  );
}
