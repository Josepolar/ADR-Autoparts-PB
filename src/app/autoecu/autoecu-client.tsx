"use client";

import { useEffect, useState } from "react";
import { getFirmwareFiles } from "@/server/actions";
import { Spinner } from "@/components/ui/modern-components";
import { Download, Upload, CheckCircle, Cpu } from "lucide-react";
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

  const filteredFirmware = firmware.filter(
    (f) => filter === "all" || f.status === filter
  );

  return (
    <main className="min-h-screen bg-[#0f0f12]">
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AutoECU Portal</h1>
              <p className="text-gray-500 text-sm">
                Browse tuned ECU firmware, upload for custom modifications, and download optimized files.
              </p>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-blue-400 text-sm flex items-start gap-2">
            <span className="shrink-0 mt-0.5">📦</span>
            All firmware files are encrypted. Download includes 24-hour secure access via signed URLs.
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFirmware.map((file) => (
              <div key={file.id} className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-5 hover:border-[#3a3a45] transition-all duration-200 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-5 h-5 ${file.status === "TUNED" ? "text-emerald-400" : "text-gray-500"}`} />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    file.status === "TUNED" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${file.status === "TUNED" ? "bg-emerald-400" : "bg-blue-400"}`} />
                    {file.status === "STOCK" ? "Original" : "Stage 1"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{file.fileName}</h3>

                {file.ecu?.vehicle && (
                  <p className="text-xs text-gray-400 mb-3">
                    <strong className="text-gray-300">{file.ecu.vehicle.year}</strong> {file.ecu.vehicle.make} {file.ecu.vehicle.model}
                  </p>
                )}

                <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{file.description}</p>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#2a2a35]">
                  <span className="text-xl font-bold text-red-400">₱{file.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 bg-[#1e1e28] px-2 py-1 rounded-lg">
                    {file.version}
                  </span>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" />
                  Download
                </button>
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
