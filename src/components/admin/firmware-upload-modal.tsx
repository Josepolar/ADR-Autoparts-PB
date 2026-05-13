"use client";

import { useState } from "react";
import { createFirmwareFile } from "@/server/actions";
import { useToast } from "@/context/toast-context";
import { Upload, X } from "lucide-react";

interface FirmwareUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FirmwareUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: FirmwareUploadModalProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fileName: "",
    description: "",
    fileUrl: "",
    price: "2500",
    version: "v1.0",
    status: "TUNED" as "STOCK" | "TUNED" | "CUSTOM",
    fileHash: "",
    fileSizeBytes: "0",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.fileName || !formData.fileUrl || !formData.fileHash) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await createFirmwareFile({
        fileName: formData.fileName,
        description: formData.description,
        fileUrl: formData.fileUrl,
        price: parseFloat(formData.price),
        version: formData.version,
        status: formData.status,
        fileHash: formData.fileHash,
        fileSizeBytes: parseInt(formData.fileSizeBytes),
      });

      if (result.success) {
        addToast("Firmware file created successfully", "success");
        setFormData({
          fileName: "",
          description: "",
          fileUrl: "",
          price: "2500",
          version: "v1.0",
          status: "TUNED",
          fileHash: "",
          fileSizeBytes: "0",
        });
        onSuccess?.();
        onClose();
      } else {
        addToast(result.error || "Failed to create firmware file", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      addToast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#2a2a35] bg-[#16161d]">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-red-400" />
            Upload Firmware File
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              File Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Stage1_Tuned_BMW.bin"
              value={formData.fileName}
              onChange={(e) =>
                setFormData({ ...formData, fileName: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="File description and details"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          {/* File URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              S3 File URL *
            </label>
            <input
              type="url"
              placeholder="https://s3.amazonaws.com/..."
              value={formData.fileUrl}
              onChange={(e) =>
                setFormData({ ...formData, fileUrl: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
            />
          </div>

          {/* File Hash */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              SHA256 Hash *
            </label>
            <input
              type="text"
              placeholder="SHA256 hash of the file"
              value={formData.fileHash}
              onChange={(e) =>
                setFormData({ ...formData, fileHash: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 font-mono text-xs"
            />
          </div>

          {/* File Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              File Size (bytes)
            </label>
            <input
              type="number"
              placeholder="0"
              value={formData.fileSizeBytes}
              onChange={(e) =>
                setFormData({ ...formData, fileSizeBytes: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "STOCK" | "TUNED" | "CUSTOM",
                })
              }
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
            >
              <option value="STOCK">Original Stock</option>
              <option value="TUNED">Stage 1 Tuned</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Version
            </label>
            <input
              type="text"
              placeholder="e.g., v1.0, v1.1-tuned"
              value={formData.version}
              onChange={(e) =>
                setFormData({ ...formData, version: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price (₱)
            </label>
            <input
              type="number"
              placeholder="2500"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#1e1e28] border border-[#2a2a35] rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#1e1e28] border border-[#2a2a35] text-gray-300 rounded-lg hover:bg-[#252530] transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
