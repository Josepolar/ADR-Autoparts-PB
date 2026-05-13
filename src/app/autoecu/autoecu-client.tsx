"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getFirmwareFiles, initiateFirmwareDownload } from "@/server/actions";
import { useToast } from "@/context/toast-context";
import { Spinner } from "@/components/ui/modern-components";
import { Download, Upload, CheckCircle, Cpu, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

interface FirmwareFile {
  id: string;
  fileName: string;
  description: string | null;
  price: number | any;
  status: string;
  version: string;
  fileHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  ecu?: {
    manufacturer: string;
    model: string;
    vehicle?: {
      make: string;
      model: string;
      year: number;
    };
  } | null;
}

export default function AutoECUClient() {
  const [firmware, setFirmware] = useState<FirmwareFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "STOCK" | "TUNED">("all");
  const [makeFilter, setMakeFilter] = useState<string>("all");
  const { data: session } = useSession();
  const router = useRouter();
  const { addToast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadFirmware();
  }, []);

  async function loadFirmware() {
    setLoading(true);
    const result = await getFirmwareFiles();
    if (result.success) {
      setFirmware(result.data || []);
    }
    setLoading(false);
  }

  async function handleDownload(fileId: string, fileName: string, price: number) {
    // Check authentication
    if (!session?.user?.id) {
      addToast("Please create an account or sign in to download", "warning");
      router.push("/auth/signin");
      return;
    }

    setDownloadingId(fileId);
    try {
      const result = await initiateFirmwareDownload(fileId, session.user.id);

      if (result.success && result.data?.downloadUrl) {
        // Download succeeded - file already purchased
        const link = document.createElement("a");
        link.href = result.data.downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast("Download started successfully", "success");
      } else if (result.error === "PAYMENT_REQUIRED") {
        // Payment needed - redirect to checkout with firmware info
        addToast("Please complete payment to download this file", "info");
        // Store firmware details in sessionStorage for checkout
        sessionStorage.setItem(
          "firmwareCheckout",
          JSON.stringify({
            fileId,
            fileName,
            price,
          })
        );
        router.push(`/checkout?type=firmware&fileId=${fileId}`);
      } else {
        addToast(result.error || "Failed to download file", "error");
      }
    } catch (error) {
      console.error("Download error:", error);
      addToast("An error occurred during download", "error");
    } finally {
      setDownloadingId(null);
    }
  }

  const filteredFirmware = firmware.filter(
    (f) =>
      (filter === "all" || f.status === filter) &&
      (makeFilter === "all" || f.ecu?.vehicle?.make?.toLowerCase() === makeFilter)
  );

  const availableMakes = Array.from(
    new Set(firmware.map((f) => f.ecu?.vehicle?.make).filter(Boolean))
  ) as string[];

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-14 sm:pt-16 lg:pt-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-[#0f0a0a] to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/[0.06] to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-red-500/[0.04] rounded-full blur-3xl" />
        <div className="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-14 lg:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-gray-600 mb-6">
            <Link href="/" className="hover:text-gray-400 transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">AutoECU Portal</span>
          </nav>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <Cpu className="w-8 h-8 lg:w-10 lg:h-10 text-red-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-red-400/70 font-medium">ECU File Services</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white mt-1 leading-[0.95]">
                AUTOECU PORTAL
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                Browse tuned ECU firmware, download stock originals, or submit your ECU for custom Stage 1–3 performance tuning.
              </p>
            </div>
          </div>
          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-400 text-sm flex items-start gap-2 max-w-xl">
            <span className="shrink-0 mt-0.5">📦</span>
            All firmware files are encrypted. Downloads include 24-hour secure access via signed URLs.
          </div>
        </div>
      </div>

      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="flex gap-2">
            {[
              { value: "all", label: "All Files" },
              { value: "STOCK", label: "Original" },
              { value: "TUNED", label: "Stage 1 Tuned" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as "all" | "STOCK" | "TUNED")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  filter === f.value
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-[#16161d] border border-[#2a2a35] text-gray-400 hover:text-gray-200 hover:bg-[#1e1e28]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {availableMakes.length > 0 && (
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="px-4 py-2 bg-[#16161d] border border-[#2a2a35] rounded-xl text-gray-300 focus:outline-none text-sm cursor-pointer ml-auto"
            >
              <option value="all" className="bg-[#16161d]">All Makes</option>
              {availableMakes.map((make) => (
                <option key={make} value={make.toLowerCase()} className="bg-[#16161d]">{make}</option>
              ))}
            </select>
          )}
        </div>

        {/* Firmware Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-gray-500 mt-4 text-sm">Loading firmware files...</p>
            </div>
          </div>
        ) : filteredFirmware.length === 0 ? (
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
            <Cpu className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No firmware files available</p>
            <p className="text-gray-600 text-sm mt-1">Check back later or upload your own ECU file</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFirmware.map((file) => (
              <div key={file.id} className="group bg-[#16161d] border border-[#2a2a35] rounded-3xl hover:border-[#3a3a45] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 overflow-hidden flex flex-col">
                {/* Card header gradient */}
                <div className="h-40 bg-gradient-to-br from-red-950/60 via-[#1a0f0f] to-[#16161d] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.08] to-transparent" />
                  <Cpu className="relative w-16 h-16 text-red-500/20 group-hover:text-red-500/30 transition-colors duration-500" />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      file.status === "TUNED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${file.status === "TUNED" ? "bg-emerald-400" : "bg-blue-400"}`} />
                      {file.status === "STOCK" ? "Original" : "Stage 1"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-white mb-2 leading-snug">{file.fileName}</h3>

                  {file.ecu?.vehicle && (
                    <p className="text-xs text-gray-400 mb-2">
                      <span className="font-medium text-gray-300">{file.ecu.vehicle.year}</span>{" "}
                      {file.ecu.vehicle.make} {file.ecu.vehicle.model}
                    </p>
                  )}

                  {file.description && (
                    <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2 leading-relaxed">{file.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a35]">
                    <span className="text-2xl font-bold text-white">₱{parseFloat(String(file.price)).toLocaleString()}</span>
                    <span className="text-xs text-gray-500 bg-[#1e1e28] px-2 py-1 rounded-lg border border-[#2a2a35]">
                      {file.version}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDownload(file.id, file.fileName, Number(file.price))}
                    disabled={downloadingId === file.id}
                    className="w-full mt-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {downloadingId === file.id ? "Downloading..." : "Download"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 text-center hover:border-red-500/20 transition-all duration-200">
            <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Custom Tuning</h3>
            <p className="text-gray-500 text-sm mb-5">
              Upload your stock ECU and our experts will create a custom tune for your vehicle.
            </p>
            <Link
              href="/autoecu/upload"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all text-sm"
            >
              Start Upload
            </Link>
          </div>

          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 text-center hover:border-emerald-500/20 transition-all duration-200">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Track Your Requests</h3>
            <p className="text-gray-500 text-sm mb-5">
              Monitor your tuning requests through every stage of completion.
            </p>
            <Link
              href="/autoecu/requests"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e1e28] border border-[#2a2a35] text-white font-medium rounded-xl hover:bg-[#252530] transition-all text-sm"
            >
              View Requests
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
