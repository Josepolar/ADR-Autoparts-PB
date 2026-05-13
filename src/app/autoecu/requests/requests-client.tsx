"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserImmoRequests } from "@/server/actions";
import { useToast } from "@/context/toast-context";
import { Spinner } from "@/components/ui/modern-components";
import {
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Home,
  ChevronRight,
  Calendar,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface ImmoRequest {
  id: string;
  userId: string;
  vehicleId: string;
  status: string;
  basePrice: number;
  totalPrice: number;
  adminNotes?: string;
  modifiedFileUrl?: string;
  downloadedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  vehicle?: {
    id: string;
    year: number;
    make: string;
    model: string;
    engineName: string;
  };
  stockFile?: {
    id: string;
    fileName: string;
    fileUrl: string;
  };
}

const statusConfig = {
  PENDING_UPLOAD: { label: "Pending Upload", color: "bg-yellow-500/10 text-yellow-400", icon: Clock },
  PROCESSING: { label: "Processing", color: "bg-blue-500/10 text-blue-400", icon: Zap },
  READY_FOR_DOWNLOAD: { label: "Ready for Download", color: "bg-green-500/10 text-green-400", icon: CheckCircle },
  DOWNLOADED: { label: "Downloaded", color: "bg-green-600/10 text-green-500", icon: CheckCircle },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-400", icon: AlertCircle },
};

export default function RequestsClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToast } = useToast();
  const [requests, setRequests] = useState<ImmoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      addToast("Please sign in to view your requests", "warning");
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      loadRequests();
    }
  }, [status, session?.user?.id, router, addToast]);

  async function loadRequests() {
    setLoading(true);
    try {
      const result = await getUserImmoRequests(session?.user?.id!);
      if (result.success && result.data) {
        // Convert Decimal types to numbers
        const converted = result.data.map((req: any) => ({
          ...req,
          basePrice: Number(req.basePrice),
        }));
        setRequests(converted);
      } else {
        addToast("Failed to load requests", "error");
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      addToast("An error occurred loading requests", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(request: ImmoRequest) {
    if (!request.modifiedFileUrl) {
      addToast("Download link not available", "error");
      return;
    }

    setDownloading(request.id);
    try {
      // Create a temporary link to download
      const link = document.createElement("a");
      link.href = request.modifiedFileUrl;
      link.download = `${request.vehicle?.make}-${request.vehicle?.model}-tuned-firmware.bin`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast("Download started successfully", "success");
    } catch (error) {
      console.error("Download error:", error);
      addToast("Failed to start download", "error");
    } finally {
      setDownloading(request.id);
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] pt-14 sm:pt-16 lg:pt-20 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-500 mt-4 text-sm">Loading your requests...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-14 sm:pt-16 lg:pt-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-[#0f0a0a] to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/[0.06] to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-red-500/[0.04] rounded-full blur-3xl" />
        <div className="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-400 transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/autoecu" className="hover:text-gray-400 transition-colors">
              AutoECU Portal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">Your Requests</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-white mt-1">
                ECU Tuning Requests
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Track your firmware tuning requests and download completed files
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {requests.length === 0 ? (
          <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No requests yet</p>
            <p className="text-gray-600 text-sm mt-1 mb-6">
              Start your ECU tuning journey by uploading your stock firmware
            </p>
            <Link
              href="/autoecu/upload"
              className="inline-block px-6 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
            >
              Upload Stock Firmware
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const statusInfo = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.PENDING_UPLOAD;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={request.id}
                  className="bg-[#16161d] border border-[#2a2a35] rounded-xl p-6 hover:border-[#3a3a45] transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Vehicle Info */}
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-lg">
                        {request.vehicle?.year} {request.vehicle?.make} {request.vehicle?.model}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-red-400" />
                          <span>{request.vehicle?.engineName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </div>
                      {request.adminNotes && (
                        <p className="text-xs text-gray-500 mt-3 leading-relaxed">{request.adminNotes}</p>
                      )}
                    </div>

                    {/* Actions & Pricing */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Amount</p>
                      <p className="text-white font-bold text-xl mb-4">₱{Number(request.totalPrice).toLocaleString()}</p>

                      {request.status === "READY_FOR_DOWNLOAD" || request.status === "DOWNLOADED" ? (
                        <button
                          onClick={() => handleDownload(request)}
                          disabled={downloading === request.id}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                          {downloading === request.id ? "Downloading..." : "Download File"}
                        </button>
                      ) : (
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-2">
                            {request.status === "PENDING_UPLOAD"
                              ? "Awaiting stock file"
                              : "File is being processed"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
