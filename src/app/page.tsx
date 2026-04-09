import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-nardo-gray-900">
      {/* Navigation is now provided by global Navbar component in layout */}

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-heading mb-4 text-5xl lg:text-6xl">
            Welcome to <span className="text-cyber-blue">ADR Autoparts</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            Your complete automotive ecosystem for ECU firmware, high-performance
            parts, and professional service booking.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/autoecu" className="btn-primary">
              Explore AutoECU
            </Link>
            <Link href="/parts" className="btn-secondary">
              Shop Parts
            </Link>
            <Link href="/rapide" className="btn-amber">
              Book Service
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-nardo-gray-800 border-y border-nardo-gray-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="subsection-heading text-center mb-12">Our Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AutoECU Card */}
            <div className="card">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-2">AutoECU Digital Portal</h3>
              <p className="text-text-secondary mb-4">
                Upload custom ECU firmware requests or purchase pre-tuned files from
                our database. Secure, encrypted, and industry-standard.
              </p>
              <Link
                href="/autoecu"
                className="text-cyber-blue hover:text-cyber-blue-400 font-semibold"
              >
                Learn More →
              </Link>
            </div>

            {/* PartsPro Card */}
            <div className="card">
              <div className="text-3xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold mb-2">PartsPro E-Shop</h3>
              <p className="text-text-secondary mb-4">
                High-performance automotive parts with Year-Make-Model filtering.
                Fast shipping nationwide with real-time inventory tracking.
              </p>
              <Link
                href="/parts"
                className="text-cyber-blue hover:text-cyber-blue-400 font-semibold"
              >
                Shop Now →
              </Link>
            </div>

            {/* Rapide Card */}
            <div className="card">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Rapide Service Hub</h3>
              <p className="text-text-secondary mb-4">
                Real-time booking for professional maintenance. Professional
                mechanics, state-of-the-art equipment, fast turnaround.
              </p>
              <Link
                href="/rapide"
                className="text-cyber-blue hover:text-cyber-blue-400 font-semibold"
              >
                Book Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-cyber-blue-900 to-nardo-gray-800 border border-cyber-blue-700 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-text-secondary mb-8">
            Create an account to access all three modules and manage your vehicles,
            orders, and appointments in one place.
          </p>
          <Link href="/auth/signup" className="btn-primary">
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nardo-gray-800 border-t border-nardo-gray-700 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-text-secondary">
          <p>&copy; 2026 ADR Autoparts. All rights reserved.</p>
          <p className="text-sm mt-2">
            Custom-coded with Next.js, TypeScript, and PostgreSQL
          </p>
        </div>
      </footer>
    </main>
  );
}
