"use client";

import { useEffect, useState } from "react";
import { getOrdersData, getAppointments } from "@/server/actions";
import {
  Spinner,
} from "@/components/ui/modern-components";
import {
  Calendar,
  ShoppingCart,
  Phone,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/auth/logout-button";

// Sidebar navigation items
const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "orders", label: "Orders", icon: ShoppingCart },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; dot: string }> = {
    COMPLETED: { color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
    CONFIRMED: { color: "text-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-400" },
    PENDING: { color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
    CANCELLED: { color: "text-gray-400", bg: "bg-gray-500/10", dot: "bg-gray-400" },
    PROCESSING: { color: "text-purple-400", bg: "bg-purple-500/10", dot: "bg-purple-400" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "orders">("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "overview" || activeTab === "bookings") {
        const result = await getAppointments();
        if (result.success) {
          setAppointments(result.data || []);
        }
      }
      if (activeTab === "overview" || activeTab === "orders") {
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

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview": return "Dashboard";
      case "bookings": return "Service Bookings";
      case "orders": return "Parts Orders";
    }
  };

  const pendingBookings = appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length;
  const completedToday = appointments.filter((a) => a.status === "COMPLETED").length;
  const activeOrders = orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length;

  return (
    <div className="min-h-screen bg-[#0f0f12] flex">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-[#16161d] border-r border-[#2a2a35]
          flex flex-col transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Logo area */}
        <div className={`flex items-center h-16 px-4 border-b border-[#2a2a35] ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="text-white font-bold text-lg tracking-tight">ADR Staff</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
          )}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-400 hover:bg-[#1e1e28] hover:text-gray-200 border border-transparent"
                  }
                  ${sidebarCollapsed ? "justify-center px-0" : ""}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-[#2a2a35]">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-[#1e1e28] hover:text-gray-200 transition-all duration-200 ${sidebarCollapsed ? "justify-center px-0" : ""}`}
          >
            <Home className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Back to Site</span>}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`hidden lg:flex items-center gap-3 w-full px-3 py-2.5 mt-1 rounded-xl text-sm text-gray-400 hover:bg-[#1e1e28] hover:text-gray-200 transition-all duration-200 cursor-pointer ${sidebarCollapsed ? "justify-center px-0" : ""}`}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#16161d]/80 backdrop-blur-xl border-b border-[#2a2a35] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-white">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-[#1e1e28] border border-[#2a2a35] rounded-xl px-3 py-2 gap-2 w-64">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
              />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1e1e28] rounded-xl transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              {pendingBookings > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-[#2a2a35]">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white leading-tight">Staff</p>
                <p className="text-xs text-gray-500">Mechanic</p>
              </div>
              <LogoutButton variant="secondary" size="sm" showIcon={true} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Spinner size="lg" />
                <p className="text-gray-500 mt-4 text-sm">Loading dashboard...</p>
              </div>
            </div>
          ) : activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">Pending Bookings</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{pendingBookings}</p>
                  <p className="text-xs text-amber-400 mt-1">Awaiting service</p>
                </div>

                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">Completed Today</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{completedToday}</p>
                  <p className="text-xs text-emerald-400 mt-1">Services done</p>
                </div>

                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">Active Orders</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{activeOrders}</p>
                  <p className="text-xs text-blue-400 mt-1">In progress</p>
                </div>

                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">Total Appointments</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{appointments.length}</p>
                  <p className="text-xs text-purple-400 mt-1">All time</p>
                </div>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Recent Appointments */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-white font-semibold text-base flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Recent Appointments
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">Latest service bookings</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No appointments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.slice(0, 5).map((apt: any) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-3 bg-[#1e1e28] rounded-xl hover:bg-[#252530] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{apt.service?.name || "N/A"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{apt.user?.email || "N/A"}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-3">
                            <span className="text-xs text-gray-500 hidden sm:block">
                              {new Date(apt.scheduledStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                            <StatusBadge status={apt.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-white font-semibold text-base flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-blue-400" />
                        Recent Orders
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">Latest parts orders</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order: any) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 bg-[#1e1e28] rounded-xl hover:bg-[#252530] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-400">#{order.orderNumber}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{order.user?.email || "N/A"}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-3">
                            <span className="text-sm font-semibold text-white">₱{order.totalAmount.toLocaleString()}</span>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "bookings" ? (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Service Appointments
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">{appointments.length} total appointments</p>
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No appointments</p>
                  <p className="text-gray-600 text-sm mt-1">Appointments will appear here when customers book services</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-left text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#2a2a35]">
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Service</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Customer</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Date & Time</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt: any) => (
                        <tr
                          key={apt.id}
                          className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors"
                        >
                          <td className="py-3.5 text-white font-medium">{apt.service?.name || "N/A"}</td>
                          <td className="py-3.5 text-gray-300">{apt.user?.email || "N/A"}</td>
                          <td className="py-3.5 text-gray-400 text-xs">
                            {new Date(apt.scheduledStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} @{" "}
                            {new Date(apt.scheduledStart).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="py-3.5">
                            <StatusBadge status={apt.status} />
                          </td>
                          <td className="py-3.5">
                            <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer">
                              <Phone className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                    Parts Orders
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No orders</p>
                  <p className="text-gray-600 text-sm mt-1">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-left text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#2a2a35]">
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Order</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Customer</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Amount</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any) => (
                        <tr
                          key={order.id}
                          className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors"
                        >
                          <td className="py-3.5 text-blue-400 font-medium">#{order.orderNumber}</td>
                          <td className="py-3.5 text-gray-300">{order.user?.email || "N/A"}</td>
                          <td className="py-3.5 font-semibold text-white">₱{order.totalAmount.toLocaleString()}</td>
                          <td className="py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 text-gray-500 text-xs">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
