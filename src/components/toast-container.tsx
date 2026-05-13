"use client";

import React from "react";
import { useToast } from "@/context/toast-context";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "error":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "info":
      default:
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300 ${getColorClasses(
            toast.type
          )}`}
        >
          {getIcon(toast.type)}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
