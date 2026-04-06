import Link from "next/link";

export default function PartsPage() {
  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-text-primary font-bold">
              ← Back to Home
            </Link>
            <Link href="/auth/signin" className="btn-primary text-sm">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="section-heading mb-4">PartsPro E-Shop</h1>
        <p className="text-text-secondary text-lg mb-8">
          High-performance automotive parts with Year-Make-Model filtering.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="card">
            <h3 className="subsection-heading mb-2">🔍 Smart Filtering</h3>
            <p className="text-text-secondary mb-4">
              Select your vehicle year, make, and model to see compatible parts.
            </p>
          </div>

          <div className="card">
            <h3 className="subsection-heading mb-2">📦 Real-Time Inventory</h3>
            <p className="text-text-secondary mb-4">
              Check stock levels and get accurate shipping estimates for all
              orders.
            </p>
          </div>

          <div className="card">
            <h3 className="subsection-heading mb-2">🚚 Fast Shipping</h3>
            <p className="text-text-secondary mb-4">
              Nationwide delivery with tracking. Same-day processing for orders
              placed before 2 PM.
            </p>
          </div>
        </div>

        <div className="p-6 bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg">
          <p className="text-text-secondary text-center">
            🚀 PartsPro shop is currently in development. Check back soon!
          </p>
        </div>
      </section>
    </main>
  );
}
