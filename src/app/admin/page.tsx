"use client";

import { useEffect, useState } from "react";
import {
  getAdminStats,
  getOrdersData,
  getImmoRequests,
  getQuotations,
  getBookings,
  approveQuotation,
  rejectQuotation,
  updateBookingStatus,
} from "@/server/actions";
import {
  Spinner,
} from "@/components/ui/modern-components";
import {
  Users,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
  Package,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  CalendarCheck,
  Check,
  XCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/auth/logout-button";
import InventoryManagement from "@/components/admin/inventory-management";
import StaffManagement from "@/components/admin/staff-management";

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

// Sidebar navigation items
const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "quotations", label: "Quotations", icon: ClipboardList },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "staff", label: "Staff", icon: Users },
  { id: "immo", label: "Tuning Requests", icon: Wrench },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [immoRequests, setImmoRequests] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory" | "staff" | "immo" | "quotations" | "bookings">("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ id: string; type: "quotation" | "booking"; action: "approve" | "reject" | "confirm" | "cancel" } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
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
      } else if (activeTab === "orders") {
        const ordersResult = await getOrdersData();
        if (ordersResult.success) {
          setOrders(ordersResult.data || []);
        }
      } else if (activeTab === "quotations") {
        const result = await getQuotations();
        if (result.success) {
          setQuotations(result.data || []);
        }
      } else if (activeTab === "bookings") {
        const result = await getBookings();
        if (result.success) {
          setBookings(result.data || []);
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

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications?role=ADMIN");
      const result = await res.json();
      if (result.success) {
        setNotifications(result.data || []);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }

  async function handleReviewSubmit() {
    if (!reviewModal) return;
    try {
      if (reviewModal.type === "quotation") {
        if (reviewModal.action === "approve") {
          await approveQuotation(reviewModal.id, reviewNotes, "admin");
        } else {
          await rejectQuotation(reviewModal.id, reviewNotes, "admin");
        }
        const result = await getQuotations();
        if (result.success) setQuotations(result.data || []);
      } else {
        const status = reviewModal.action === "confirm" ? "CONFIRMED" : "CANCELLED";
        await updateBookingStatus(reviewModal.id, status, reviewNotes, "admin");
        const result = await getBookings();
        if (result.success) setBookings(result.data || []);
      }
    } catch (error) {
      console.error("Error processing review:", error);
    }
    setReviewModal(null);
    setReviewNotes("");
    loadNotifications();
  }

  async function handleMarkAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "ADMIN" }),
    });
    loadNotifications();
  }

  async function handleNotificationClick(n: any) {
    if (!n.isRead) {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: n.id }),
      });
      loadNotifications();
    }
    if (n.type === "NEW_QUOTATION") setActiveTab("quotations");
    else if (n.type === "NEW_BOOKING") setActiveTab("bookings");
    else if (n.type === "NEW_ORDER") setActiveTab("orders");
    setShowNotifications(false);
  }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview": return "Dashboard";
      case "orders": return "Orders";
      case "quotations": return "Quotations";
      case "bookings": return "Bookings";
      case "inventory": return "Inventory";
      case "staff": return "Staff Management";
      case "immo": return "Tuning Requests";
    }
  };

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="text-white font-bold text-lg tracking-tight">ADR Admin</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm">
              A
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
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "text-gray-400 hover:bg-[#1e1e28] hover:text-gray-200 border border-transparent"
                  }
                  ${sidebarCollapsed ? "justify-center px-0" : ""}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-red-400" : ""}`} />
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

          {/* Collapse toggle (desktop only) */}
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
            {/* Search (desktop) */}
            <div className="hidden md:flex items-center bg-[#1e1e28] border border-[#2a2a35] rounded-xl px-3 py-2 gap-2 w-64">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1e1e28] rounded-xl transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-12 w-80 bg-[#16161d] border border-[#2a2a35] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a35]">
                      <h3 className="text-white font-semibold text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-8">No notifications</p>
                      ) : (
                        notifications.slice(0, 15).map((n: any) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`w-full text-left px-4 py-3 border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors cursor-pointer ${!n.isRead ? "bg-red-500/5" : ""}`}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />}
                              <div className={!n.isRead ? "" : "pl-4"}>
                                <p className="text-white text-sm font-medium">{n.title}</p>
                                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-gray-600 text-[10px] mt-1">
                                  {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile + Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#2a2a35]">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white leading-tight">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
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
                <StatCard
                  label="Total Users"
                  value={stats?.totalUsers || 0}
                  icon={Users}
                  trend={12}
                  color="blue"
                />
                <StatCard
                  label="Total Orders"
                  value={stats?.totalOrders || 0}
                  icon={ShoppingCart}
                  trend={8}
                  color="green"
                />
                <StatCard
                  label="Revenue"
                  value={`₱${(stats?.totalRevenue || 0).toLocaleString()}`}
                  icon={DollarSign}
                  trend={15}
                  color="amber"
                />
                <StatCard
                  label="Pending Requests"
                  value={stats?.pendingImmoRequests || 0}
                  icon={AlertCircle}
                  trend={-3}
                  color="red"
                />
              </div>

              {/* Chart placeholder + Quick stats */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Revenue Chart Area */}
                <div className="xl:col-span-2 bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-semibold text-base">Revenue Overview</h3>
                      <p className="text-gray-500 text-sm mt-0.5">Monthly earnings summary</p>
                    </div>
                    <div className="flex gap-2">
                      {["Week", "Month", "Year"].map((period) => (
                        <button
                          key={period}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1e1e28] text-gray-400 hover:text-white hover:bg-[#2a2a35] transition-colors cursor-pointer"
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Chart visualization */}
                  <div className="flex items-end gap-2 h-48 px-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 50].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-red-600/80 to-red-400/60 hover:from-red-500 hover:to-red-300/80 transition-all duration-200 cursor-pointer"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] text-gray-600">
                          {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5 space-y-4">
                  <h3 className="text-white font-semibold text-base mb-4">Quick Stats</h3>
                  <QuickStatItem label="Avg. Order Value" value="₱2,450" trend={5.2} />
                  <QuickStatItem label="Conversion Rate" value="3.2%" trend={-1.1} />
                  <QuickStatItem label="Active Products" value="127" trend={8} />
                  <QuickStatItem label="Active Users" value="89" trend={12} />
                  <QuickStatItem label="Reviews Pending" value="14" trend={-2} />
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-white font-semibold text-base flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-red-400" />
                      Recent Orders
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">Latest transactions</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-sm text-red-400 hover:text-red-300 font-medium cursor-pointer transition-colors"
                  >
                    View All →
                  </button>
                </div>

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
                      {orders.slice(0, 6).map((order) => (
                        <tr key={order.id} className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors">
                          <td className="py-3.5 text-red-400 font-medium">#{order.orderNumber}</td>
                          <td className="py-3.5 text-gray-300">{order.user?.name || order.user?.email || "N/A"}</td>
                          <td className="py-3.5 font-semibold text-white">₱{order.totalAmount.toLocaleString()}</td>
                          <td className="py-3.5">
                            <OrderStatusBadge status={order.status} />
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
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "orders" ? (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h2 className="text-white font-semibold text-lg">All Orders</h2>
                <div className="flex items-center bg-[#1e1e28] border border-[#2a2a35] rounded-xl px-3 py-2 gap-2 w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-full"
                  />
                </div>
              </div>
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#2a2a35]">
                      <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Order</th>
                      <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Customer</th>
                      <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Amount</th>
                      <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors">
                        <td className="py-3.5 text-red-400 font-medium">#{order.orderNumber}</td>
                        <td className="py-3.5 text-gray-300">{order.user?.name || order.user?.email || "N/A"}</td>
                        <td className="py-3.5 font-semibold text-white">₱{order.totalAmount.toLocaleString()}</td>
                        <td className="py-3.5">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-3.5">
                          <button className="text-xs text-gray-400 hover:text-white bg-[#1e1e28] hover:bg-[#2a2a35] px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">No orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "immo" ? (
            <div className="space-y-4">
              <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
                <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-red-400" />
                  Immo-Off Tuning Requests
                </h2>

                {immoRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Wrench className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No tuning requests at this time.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {immoRequests.map((request: any) => (
                      <div
                        key={request.id}
                        className="p-4 bg-[#1e1e28] border border-[#2a2a35] rounded-xl hover:border-[#3a3a45] transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-white text-sm">
                            {request.vehicle?.year}{" "}
                            {request.vehicle?.make}{" "}
                            {request.vehicle?.model}
                          </h3>
                          <OrderStatusBadge status={request.status} />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          User: {request.user?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.status === "PENDING_UPLOAD" && (
                          <button className="mt-3 w-full text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg py-2 transition-colors cursor-pointer">
                            Download &amp; Process
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "inventory" ? (
            <InventoryManagement />
          ) : activeTab === "staff" ? (
            <StaffManagement />
          ) : activeTab === "quotations" ? (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-red-400" />
                    Quotation Requests
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">{quotations.length} total requests</p>
                </div>
              </div>

              {quotations.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No quotation requests</p>
                  <p className="text-gray-600 text-sm mt-1">Quotation requests from customers will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#2a2a35]">
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Customer</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Email</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Items / Description</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Date</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotations.map((q: any) => (
                        <tr key={q.id} className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors">
                          <td className="py-3.5 text-white font-medium">{q.name}</td>
                          <td className="py-3.5 text-gray-400 text-xs">{q.email}</td>
                          <td className="py-3.5 text-gray-300 text-xs max-w-[200px] truncate">{q.items}</td>
                          <td className="py-3.5"><OrderStatusBadge status={q.status} /></td>
                          <td className="py-3.5 text-gray-500 text-xs">
                            {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="py-3.5">
                            {q.status === "PENDING" ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => { setReviewModal({ id: q.id, type: "quotation", action: "approve" }); setReviewNotes(""); }}
                                  className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setReviewModal({ id: q.id, type: "quotation", action: "reject" }); setReviewNotes(""); }}
                                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-gray-500 text-xs truncate max-w-[120px]">{q.adminNotes || "—"}</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === "bookings" ? (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-red-400" />
                    Booking Requests
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">{bookings.length} total bookings</p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No booking requests</p>
                  <p className="text-gray-600 text-sm mt-1">Booking requests from customers will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#2a2a35]">
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Customer</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Service</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Date</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Phone</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b: any) => (
                        <tr key={b.id} className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors">
                          <td className="py-3.5">
                            <p className="text-white font-medium">{b.name}</p>
                            <p className="text-gray-500 text-xs">{b.email}</p>
                          </td>
                          <td className="py-3.5 text-gray-300 capitalize">{b.service.replace(/-/g, " ")}</td>
                          <td className="py-3.5 text-gray-400 text-xs">
                            {new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="py-3.5 text-gray-400 text-xs">{b.phone}</td>
                          <td className="py-3.5"><OrderStatusBadge status={b.status} /></td>
                          <td className="py-3.5">
                            {b.status === "PENDING" ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => { setReviewModal({ id: b.id, type: "booking", action: "confirm" }); setReviewNotes(""); }}
                                  className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Confirm"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setReviewModal({ id: b.id, type: "booking", action: "cancel" }); setReviewNotes(""); }}
                                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Cancel"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-gray-500 text-xs truncate max-w-[120px]">{b.adminNotes || "—"}</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {/* Review Modal */}
          {reviewModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
              <div className="relative bg-[#16161d] border border-[#2a2a35] rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-1 capitalize">
                  {reviewModal.action} {reviewModal.type}
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  {reviewModal.action === "approve" || reviewModal.action === "confirm"
                    ? "Add notes for this approval (optional)."
                    : "Provide a reason for this rejection."}
                </p>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes..."
                  className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/40 resize-none mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setReviewModal(null)}
                    className="flex-1 py-2.5 bg-[#1e1e28] border border-[#2a2a35] text-gray-300 font-medium rounded-xl hover:bg-[#2a2a35] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    className={`flex-1 py-2.5 font-medium rounded-xl transition-colors cursor-pointer text-white ${
                      reviewModal.action === "approve" || reviewModal.action === "confirm"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {reviewModal.action === "approve" ? "Approve" : reviewModal.action === "confirm" ? "Confirm" : reviewModal.action === "reject" ? "Reject" : "Cancel Booking"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  color: "blue" | "green" | "amber" | "red";
}) {
  const colorMap = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    green: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  };
  const c = colorMap[color];
  const isPositive = (trend || 0) >= 0;

  return (
    <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5 hover:border-[#3a3a45] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function QuickStatItem({ label, value, trend }: { label: string; value: string; trend: number }) {
  const isPositive = trend >= 0;
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2a2a35]/50 last:border-0">
      <div>
        <p className="text-sm text-gray-300">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </span>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    PROCESSING: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    READY_FOR_DOWNLOAD: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    PENDING_UPLOAD: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  };
  const c = config[status] || { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status.replace(/_/g, " ")}
    </span>
  );
}
