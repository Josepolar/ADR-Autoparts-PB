"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Also check sessionStorage as a fallback during hydration
    const storedRole = typeof window !== "undefined"
      ? sessionStorage.getItem("userRole")
      : null;

    const effectiveRole = userRole || storedRole;

    if (!effectiveRole) {
      // Not authenticated at all - redirect to signin
      window.location.href = "/auth/signin";
      return;
    }

    if (effectiveRole !== "admin") {
      // Authenticated but wrong role - redirect to home
      window.location.href = "/";
      return;
    }

    setAuthorized(true);
  }, [isAuthenticated, userRole, isLoading]);

  if (isLoading || !authorized) {
    return (
      <div className="min-h-screen bg-nardo-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-cyber-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-nardo-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
