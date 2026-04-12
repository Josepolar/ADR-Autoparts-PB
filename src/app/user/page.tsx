"use client";

import { useEffect, useState } from "react";
import { getOrdersData, getAppointments } from "@/server/actions";
import {
  Spinner,
} from "@/components/ui/modern-components";
import {
  Package,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Home,
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/auth/logout-button";

// Sidebar navigation items
const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "bookings", label: "My Bookings", icon: Calendar },
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

export default function UserDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "bookings">("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

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

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview": return "My Dashboard";
      case "orders": return "My Orders";
      case "bookings": return "My Bookings";
    }
  };

  const activeOrders = orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length;
  const upcomingBookings = appointments.filter((a) => new Date(a.scheduledStart) > new Date()).length;
  const totalSpent = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
              <span className="text-white font-bold text-lg tracking-tight">My Account</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
              U
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
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:bg-[#1e1e28] hover:text-gray-200 border border-transparent"
                  }
                  ${sidebarCollapsed ? "justify-center px-0" : ""}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-emerald-400" : ""}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Quick Links */}
          <div className={`pt-4 mt-4 border-t border-[#2a2a35] space-y-1 ${sidebarCollapsed ? "hidden" : ""}`}>
            <p className="px-3 text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Quick Links</p>
            <Link href="/parts" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-[#1e1e28] hover:text-gray-200 transition-all duration-200">
              <Package className="w-5 h-5 shrink-0" />
              <span>Shop Parts</span>
            </Link>
            <Link href="/rapide" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-[#1e1e28] hover:text-gray-200 transition-all duration-200">
              <Wrench className="w-5 h-5 shrink-0" />
              <span>Book Service</span>
            </Link>
          </div>
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
                placeholder="Search orders..."
                className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
              />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1e1e28] rounded-xl transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1e1e28] rounded-xl transition-colors cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-[#2a2a35]">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white leading-tight">Customer</p>
                <p className="text-xs text-gray-500">Member</p>
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
                <p className="text-gray-500 mt-4 text-sm">Loading your dashboard...</p>
              </div>
            </div>
          ) : activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
                <p className="text-gray-400">Manage your orders, appointments, and account all in one place.</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">Active Orders</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{activeOrders}</p>
                  <p className="text-xs text-blue-400 mt-1">In progress</p>
                </div>

                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">Upcoming Bookings</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{upcomingBookings}</p>
                  <p className="text-xs text-amber-400 mt-1">Scheduled</p>
                </div>

                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm font-medium">Total Spent</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">₱{totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-emerald-400 mt-1">Lifetime</p>
                </div>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Recent Orders */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-semibold text-base flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-emerald-400" />
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-sm text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-3">No orders yet</p>
                      <Link href="/parts" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 4).map((order: any) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 bg-[#1e1e28] rounded-xl hover:bg-[#252530] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-emerald-400">#{order.orderNumber}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
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

                {/* Upcoming Bookings */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-semibold text-base flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                      Upcoming Bookings
                    </h3>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-3">No upcoming bookings</p>
                      <Link href="/rapide" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Book a Service →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.slice(0, 4).map((apt: any) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-3 bg-[#1e1e28] rounded-xl hover:bg-[#252530] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{apt.service?.name || "Service"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(apt.scheduledStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} @{" "}
                              {new Date(apt.scheduledStart).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <StatusBadge status={apt.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/parts" className="group bg-[#16161d] border border-[#2a2a35] hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-200">
                  <Package className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold text-sm mb-1">Shop Parts</h3>
                  <p className="text-gray-500 text-xs">Browse quality automotive parts</p>
                </Link>
                <Link href="/rapide" className="group bg-[#16161d] border border-[#2a2a35] hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-200">
                  <Wrench className="w-8 h-8 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold text-sm mb-1">Book Service</h3>
                  <p className="text-gray-500 text-xs">Schedule maintenance or repairs</p>
                </Link>
                <Link href="/autoecu" className="group bg-[#16161d] border border-[#2a2a35] hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-200">
                  <Settings className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold text-sm mb-1">AutoECU Portal</h3>
                  <p className="text-gray-500 text-xs">ECU firmware and tuning</p>
                </Link>
              </div>
            </div>
          ) : activeTab === "orders" ? (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    My Orders
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
                </div>
                <Link href="/parts" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Shop More →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No orders yet</p>
                  <p className="text-gray-600 text-sm mt-1 mb-4">Start shopping to see your orders here</p>
                  <Link href="/parts" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                    Browse Parts →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="p-4 bg-[#1e1e28] rounded-xl hover:bg-[#252530] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-white">Order #{order.orderNumber}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a35]">
                        <span className="text-xs text-gray-500">{order.items?.length || 0} items</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-emerald-400">₱{order.totalAmount.toLocaleString()}</span>
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-[#16161d] rounded-lg transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    My Bookings
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">{appointments.length} total bookings</p>
                </div>
                <Link href="/rapide" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Book New Service →
                </Link>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No bookings yet</p>
                  <p className="text-gray-600 text-sm mt-1 mb-4">Book a service appointment to get started</p>
                  <Link href="/rapide" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                    Book a Service →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt: any) => (
                    <div
                      key={apt.id}
                      className="p-4 bg-[#1e1e28] rounded-xl hover:bg-[#252530] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{apt.service?.name || "Service"}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
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
                        <StatusBadge status={apt.status} />
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a35]">
                        <span className="text-sm text-gray-400">₱{(apt.servicePrice || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
