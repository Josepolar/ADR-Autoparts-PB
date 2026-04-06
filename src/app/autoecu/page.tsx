import Link from "next/link";

export default function AutoECUPage() {
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
        <h1 className="section-heading mb-4">AutoECU Digital Portal</h1>
        <p className="text-text-secondary text-lg mb-8">
          Upload custom ECU firmware requests or browse our database of
          pre-tuned files.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="subsection-heading mb-4">📤 Upload Custom Immo-Off</h2>
            <p className="text-text-secondary mb-4">
              Upload your stock ECU file. Our experts will tune it and deliver
              the custom firmware ready to flash.
            </p>
            <button className="btn-primary" disabled>
              Coming Soon: Upload Portal
            </button>
          </div>

          <div className="card">
            <h2 className="subsection-heading mb-4">🛒 Pre-Tuned Catalogue</h2>
            <p className="text-text-secondary mb-4">
              Browse our database of ready-to-download tuned ECU files for
              popular vehicles.
            </p>
            <button className="btn-amber" disabled>
              Coming Soon: Catalogue Browser
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg">
          <p className="text-text-secondary text-center">
            🚀 AutoECU module is currently in development. Check back soon!
          </p>
        </div>
      </section>
    </main>
  );
}
