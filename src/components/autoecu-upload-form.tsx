"use client";

import { useState } from "react";
import { Card, Button, Alert, Spinner, Input } from "@/components/ui/modern-components";
import { Upload, CheckCircle } from "lucide-react";
import Link from "next/link";

interface UploadResponse {
  success: boolean;
  message?: string;
  uploadId?: string;
}

export default function AutoECUUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [vehicleId, setVehicleId] = useState("");
  const [ecuName, setEcuName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file || !vehicleId || !ecuName) {
      setError("Please fill in all fields");
      return;
    }

    if (!file.name.match(/\.(bin|hex|ecu)$/i)) {
      setError("Only .bin, .hex, and .ecu files are accepted");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("vehicleId", vehicleId);
      formData.append("ecuName", ecuName);

      const response = await fetch("/api/upload/firmware", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (data.success) {
        setUploadSuccess(true);
        setFile(null);
        setVehicleId("");
        setEcuName("");
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (uploadSuccess) {
    return (
      <Card className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Upload Successful!</h3>
        <p className="text-nardo-gray-400 mb-4">
          Your firmware file has been uploaded and is being processed.
        </p>
        <Link href="/autoecu">
          <Button variant="primary">View Status</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6" />
        Upload Custom Firmware
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert type="danger">{error}</Alert>}

        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-semibold text-nardo-gray-300 mb-2">
            Vehicle
          </label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full px-4 py-2 bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg text-nardo-gray-100 focus:outline-none focus:border-cyber-blue-500 transition"
          >
            <option value="">Select your vehicle...</option>
            <option value="vehicle-1">2020 Toyota Camry - 5TDJKRFH8LS123456</option>
            <option value="vehicle-2">2019 Honda Civic - JHGCV12345K901234</option>
            <option value="vehicle-3">2021 BMW 320i - WBXYZ1234567890123</option>
          </select>
        </div>

        {/* ECU Name/Model */}
        <div>
          <label className="block text-sm font-semibold text-nardo-gray-300 mb-2">
            ECU Model
          </label>
          <Input
            placeholder="e.g., Bosch MED17, Continental MPC5xx"
            value={ecuName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEcuName(e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-nardo-gray-300 mb-2">
            Firmware File
          </label>
          <div className="border-2 border-dashed border-nardo-gray-600 rounded-lg p-6 text-center hover:border-cyber-blue-500 transition cursor-pointer">
            <input
              type="file"
              accept=".bin,.hex,.ecu"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="firmware-upload"
            />
            <label htmlFor="firmware-upload" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-nardo-gray-400 mx-auto mb-2" />
              <p className="text-nardo-gray-300 font-semibold">
                {file ? file.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-nardo-gray-500 mt-1">
                .bin, .hex, .ecu - Max 10MB
              </p>
            </label>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="bg-nardo-gray-800 p-4 rounded-lg">
            <p className="text-sm text-nardo-gray-300">
              <span className="font-semibold">File:</span> {file.name}
            </p>
            <p className="text-sm text-nardo-gray-300">
              <span className="font-semibold">Size:</span> {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {/* Pricing Info */}
        <div className="bg-nardo-gray-800 border border-nardo-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Tuning Service Pricing</h4>
          <div className="space-y-1 text-sm text-nardo-gray-300">
            <p>📊 Basic Tune: <span className="text-cyber-blue-400">₱2,500</span></p>
            <p>🚀 Performance Tune: <span className="text-cyber-blue-400">₱4,500</span></p>
            <p>⚡ Maximum Optimization: <span className="text-cyber-blue-400">₱7,500</span></p>
          </div>
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={loading || !file}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" /> Uploading...
            </span>
          ) : (
            "Upload Firmware"
          )}
        </Button>

        <p className="text-xs text-nardo-gray-500 text-center">
          Files are processed within 24 hours. You'll receive download link via email.
        </p>
      </form>
    </Card>
  );
}
