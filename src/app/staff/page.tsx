"use client";

import { useEffect, useState } from "react";
import {
  getOrdersData,
  getAppointments,
  getQuotations,
  getBookings,
  approveQuotation,
  rejectQuotation,
  updateBookingStatus,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/server/actions";
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
  ClipboardList,
  Check,
  XCircle,
  MessageSquare,
  Package,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/auth/logout-button";
import InventoryManagement from "@/components/admin/inventory-management";

// Sidebar navigation items
const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "quotations", label: "Quotations", icon: ClipboardList },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", icon: Package },
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
  const [quotations, setQuotations] = useState<any[]>([]);
  const [staffBookings, setStaffBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "quotations" | "orders" | "inventory">("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ id: string; type: "quotation" | "booking"; action: "approve" | "reject" | "confirm" | "cancel" } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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
        const bResult = await getBookings();
        if (bResult.success) {
          setStaffBookings(bResult.data || []);
        }
      }
      if (activeTab === "overview" || activeTab === "orders") {
        const result = await getOrdersData();
        if (result.success) {
          setOrders(result.data || []);
        }
      }
      if (activeTab === "quotations") {
        const result = await getQuotations();
        if (result.success) {
          setQuotations(result.data || []);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }

  async function loadNotifications() {
    try {
      const result = await getNotifications("MECHANIC");
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
          await approveQuotation(reviewModal.id, reviewNotes, "staff");
        } else {
          await rejectQuotation(reviewModal.id, reviewNotes, "staff");
        }
        const result = await getQuotations();
        if (result.success) setQuotations(result.data || []);
      } else {
        const status = reviewModal.action === "confirm" ? "CONFIRMED" : "CANCELLED";
        await updateBookingStatus(reviewModal.id, status, reviewNotes, "staff");
        const result = await getBookings();
        if (result.success) setStaffBookings(result.data || []);
      }
    } catch (error) {
      console.error("Error processing review:", error);
    }
    setReviewModal(null);
    setReviewNotes("");
    loadNotifications();
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead("MECHANIC");
    loadNotifications();
  }

  async function handleNotificationClick(n: any) {
    if (!n.isRead) {
      await markNotificationRead(n.id);
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
      case "bookings": return "Service Bookings";
      case "quotations": return "Quotations";
      case "orders": return "Parts Orders";
      case "inventory": return "Parts Inventory";
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

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1e1e28] rounded-xl transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-blue-500 text-white text-[10px] font-bold rounded-full px-1">
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
                        <button onClick={handleMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
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
                            className={`w-full text-left px-4 py-3 border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors cursor-pointer ${!n.isRead ? "bg-blue-500/5" : ""}`}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
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
            <div className="space-y-5">
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Customer Bookings
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">{staffBookings.length} total bookings</p>
                </div>
              </div>

              {staffBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">No bookings</p>
                  <p className="text-gray-600 text-sm mt-1">Bookings will appear here when customers submit them</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full text-left text-sm min-w-[600px]">
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
                      {staffBookings.map((b: any) => (
                        <tr key={b.id} className="border-b border-[#2a2a35]/50 hover:bg-[#1e1e28] transition-colors">
                          <td className="py-3.5 text-white font-medium">{b.name}</td>
                          <td className="py-3.5 text-gray-300 text-xs">{b.service}</td>
                          <td className="py-3.5 text-gray-400 text-xs">{new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                          <td className="py-3.5 text-gray-400 text-xs">{b.phone}</td>
                          <td className="py-3.5"><StatusBadge status={b.status} /></td>
                          <td className="py-3.5">
                            {b.status === "PENDING" ? (
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => { setReviewModal({ id: b.id, type: "booking", action: "confirm" }); setReviewNotes(""); }} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer" title="Confirm"><Check className="w-4 h-4" /></button>
                                <button onClick={() => { setReviewModal({ id: b.id, type: "booking", action: "cancel" }); setReviewNotes(""); }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" title="Cancel"><XCircle className="w-4 h-4" /></button>
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
            </div>
          ) : activeTab === "quotations" ? (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-400" />
                    Quotation Requests
                  </h3>
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
                          <td className="py-3.5"><StatusBadge status={q.status} /></td>
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
          ) : activeTab === "orders" ? (
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                    Orders
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
          ) : activeTab === "inventory" ? (
            <InventoryManagement />
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
                  className="w-full px-4 py-3 bg-[#0f0f12] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/40 resize-none mb-4"
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
