import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <Link href="/" className="text-text-primary font-bold">
                ADR Autoparts
              </Link>
              <span className="text-text-secondary ml-4 text-sm">
                Admin Dashboard
              </span>
            </div>
            <Link href="/auth/signin" className="btn-secondary text-sm">
              Sign Out
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-nardo-gray-800 border-r border-nardo-gray-700 min-h-screen p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase">
              Dashboard
            </h3>
            <Link
              href="/admin"
              className="block px-4 py-2 text-text-primary bg-nardo-gray-700 rounded-lg"
            >
              Overview
            </Link>

            <h3 className="text-sm font-semibold text-text-secondary uppercase mt-6">
              Management
            </h3>
            <Link
              href="/admin/immo-requests"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary rounded-lg"
            >
              Immo-Off Requests
            </Link>
            <Link
              href="/admin/inventory"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary rounded-lg"
            >
              Inventory Control
            </Link>
            <Link
              href="/admin/war-room"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary rounded-lg"
            >
              Service War Room
            </Link>

            <h3 className="text-sm font-semibold text-text-secondary uppercase mt-6">
              Insights
            </h3>
            <Link
              href="/admin/analytics"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary rounded-lg"
            >
              Analytics
            </Link>
            <Link
              href="/admin/reports"
              className="block px-4 py-2 text-text-secondary hover:text-text-primary rounded-lg"
            >
              Reports
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="section-heading mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-cyber-blue">₱0</p>
              <p className="text-text-muted text-xs mt-2">This month</p>
            </div>

            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Pending Orders</p>
              <p className="text-3xl font-bold text-vivid-amber">0</p>
              <p className="text-text-muted text-xs mt-2">Awaiting payment</p>
            </div>

            <div className="card">
              <p className="text-text-secondary text-sm mb-2">Active Services</p>
              <p className="text-3xl font-bold text-cyan-400">0</p>
              <p className="text-text-muted text-xs mt-2">In progress</p>
            </div>

            <div className="card">
              <p className="text-text-secondary text-sm mb-2">System Status</p>
              <p className="text-3xl font-bold text-green-400">✓ Online</p>
              <p className="text-text-muted text-xs mt-2">All systems operational</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="subsection-heading mb-4">Recent Orders</h2>
              <div className="text-center py-8">
                <p className="text-text-secondary">No orders yet</p>
              </div>
            </div>

            <div className="card">
              <h2 className="subsection-heading mb-4">Service Appointments</h2>
              <div className="text-center py-8">
                <p className="text-text-secondary">Calendar coming soon</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
