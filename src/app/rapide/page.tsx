import Link from "next/link";

export default function RapidePage() {
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
        <h1 className="section-heading mb-4">Rapide Service Hub</h1>
        <p className="text-text-secondary text-lg mb-8">
          Real-time booking for professional maintenance and tuning services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="card">
            <h3 className="subsection-heading mb-2">📅 Easy Scheduling</h3>
            <p className="text-text-secondary mb-4">
              Browse available time slots and book your service in minutes. Real-time
              calendar updates ensure no double-bookings.
            </p>
          </div>

          <div className="card">
            <h3 className="subsection-heading mb-2">👨‍🔧 Expert Mechanics</h3>
            <p className="text-text-secondary mb-4">
              Certified mechanics with years of experience. See mechanic
              profiles and read reviews from other customers.
            </p>
          </div>

          <div className="card">
            <h3 className="subsection-heading mb-2">🔧 Professional Services</h3>
            <p className="text-text-secondary mb-4">
              Oil changes, filter replacements, diagnostics, custom tuning, and
              more. Transparent pricing with no hidden fees.
            </p>
          </div>
        </div>

        <div className="p-6 bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg">
          <p className="text-text-secondary text-center">
            🚀 Rapide booking engine is currently in development. Check back soon!
          </p>
        </div>
      </section>
    </main>
  );
}
