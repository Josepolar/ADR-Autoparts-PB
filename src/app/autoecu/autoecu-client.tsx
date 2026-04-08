"use client";

import { useEffect, useState } from "react";
import { getFirmwareFiles } from "@/server/actions";
import { Card, Button, Badge, Spinner, Alert } from "@/components/ui/modern-components";
import { Download, Upload, CheckCircle } from "lucide-react";
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
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-nardo-gray-100 hover:text-cyber-blue-500 font-semibold">
              ← Back to Home
            </Link>
            <div className="flex gap-4">
              <Link href="/autoecu/upload">
                <Button variant="primary" size="sm">
                  Upload ECU
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AutoECU Portal</h1>
          <p className="text-nardo-gray-300">
            Browse tuned ECU firmware, upload for custom modifications, and download optimized files.
          </p>
        </div>

        <Alert type="info" className="mb-8">
          📦 All firmware files are encrypted. Download includes 24-hour secure access via signed URLs.
        </Alert>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {["all", "STOCK", "TUNED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as "all" | "STOCK" | "TUNED")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? "bg-cyber-blue-500 text-white shadow-lg"
                  : "bg-nardo-gray-700 text-nardo-gray-100 hover:bg-nardo-gray-600"
              }`}
            >
              {f === "all" ? "All Files" : f === "STOCK" ? "Original" : "Stage 1 Tuned"}
            </button>
          ))}
        </div>

        {/* Firmware Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredFirmware.length === 0 ? (
          <Alert type="warning">No firmware files available in this category.</Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFirmware.map((file) => (
              <Card key={file.id} className="flex flex-col hover:shadow-glow-blue transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {file.status === "STOCK" ? (
                      <CheckCircle className="w-6 h-6 text-nardo-gray-400" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <Badge variant={file.status === "STOCK" ? "info" : "success"}>
                    {file.status === "STOCK" ? "Original" : "Stage 1"}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{file.fileName}</h3>

                {file.ecu?.vehicle && (
                  <p className="text-sm text-nardo-gray-300 mb-3">
                    <strong>{file.ecu.vehicle.year}</strong> {file.ecu.vehicle.make} {file.ecu.vehicle.model}
                  </p>
                )}

                <p className="text-nardo-gray-400 text-sm mb-4 flex-1">{file.description}</p>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-nardo-gray-700">
                  <span className="text-2xl font-bold text-cyber-blue-400">₱{file.price.toLocaleString()}</span>
                  <span className="text-xs text-nardo-gray-400 bg-nardo-gray-700 px-2 py-1 rounded">
                    {file.version}
                  </span>
                </div>

                <Button variant="primary" size="md" icon={Download} className="w-full">
                  Download
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="text-center">
            <Upload className="w-12 h-12 text-cyber-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Custom Tuning</h3>
            <p className="text-nardo-gray-300 mb-4">
              Upload your stock ECU and our experts will create a custom tune for your vehicle.
            </p>
            <Link href="/autoecu/upload">
              <Button variant="primary" size="lg" className="w-full">
                Start Upload
              </Button>
            </Link>
          </Card>

          <Card className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Track Your Requests</h3>
            <p className="text-nardo-gray-300 mb-4">
              Monitor your tuning requests through every stage of completion.
            </p>
            <Link href="/autoecu/requests">
              <Button variant="secondary" size="lg" className="w-full">
                View Requests
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </main>
  );
}
