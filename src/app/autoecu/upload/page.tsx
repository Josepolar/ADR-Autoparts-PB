import AutoECUUploadForm from "@/components/autoecu-upload-form";
import Link from "next/link";

export const metadata = {
  title: "Upload Custom ECU Firmware - ADR Autoparts",
  description: "Upload your ECU file for custom tuning and modifications",
};

export default function AutoECUUploadPage() {
  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/autoecu" className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold">
              ← Back to Catalog
            </Link>
            <h1 className="text-xl font-bold text-white">ECU Upload</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Upload Your ECU Firmware</h2>
          <p className="text-nardo-gray-300">
            Submit your original ECU file for custom tuning and optimization. Our experts will analyze and prepare modifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <AutoECUUploadForm />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">📋 How It Works</h3>
              <ol className="space-y-3 text-sm text-nardo-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-cyber-blue-400">1.</span>
                  <span>Upload your original ECU file</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyber-blue-400">2.</span>
                  <span>Select tuning level and service</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyber-blue-400">3.</span>
                  <span>Admin reviews and processes</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyber-blue-400">4.</span>
                  <span>Download modified file (24h access)</span>
                </li>
              </ol>
            </div>

            {/* Supported Formats */}
            <div className="bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">✓ Supported Formats</h3>
              <ul className="space-y-2 text-sm text-nardo-gray-300">
                <li>• Bosch MED/MEDC</li>
                <li>• Continental MPC5xx</li>
                <li>• Delphi DCM</li>
                <li>• Siemens Simtec</li>
                <li>• Others on request</li>
              </ul>
            </div>

            {/* Safety Notice */}
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p className="text-xs text-yellow-200">
                ⚠️ <strong>Important:</strong> Always backup your original ECU before flashing. ADR Autoparts is not responsible for vehicle damage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
