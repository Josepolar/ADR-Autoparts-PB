"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  userRole: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  setAuth: (email: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = sessionStorage.getItem("userRole");
      const email = sessionStorage.getItem("userEmail");
      setUserRole(role);
      setUserEmail(email);
    }
    setIsLoading(false);
  }, []);

  /**
   * Logout handler that clears session and redirects to signin
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Call logout API endpoints to clear both server and client sessions
      try {
        // Clear session API (old endpoint)
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }).catch(() => {
          // Ignore errors, we'll clear cookies via the new endpoint
        });

        // Clear signin cookies (new endpoint)
        await fetch("/api/auth/signin", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }).catch(() => {
          // Ignore errors, continue with client-side cleanup
        });
      } catch (apiError) {
        console.error("API logout error:", apiError);
      }

      // Clear client-side session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("userEmail");

        // Clear all sessionStorage to prevent any cached auth state
        sessionStorage.clear();

        // Clear localStorage
        localStorage.clear();

        // Disable back button navigation by replacing history
        window.history.replaceState({ logout: true }, "", "/");

        // Hard redirect to signin page
        window.location.href = "/auth/signin";
        
        // Add additional security measure: reload page from server
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }

      setUserRole(null);
      setUserEmail(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect to signin even if API call fails
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Set authentication state
   */
  const setAuth = useCallback((email: string, role: string) => {
    setUserEmail(email);
    setUserRole(role);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userRole", role);
    }
  }, []);

  const value: AuthContextType = {
    userRole,
    userEmail,
    isAuthenticated: Boolean(userRole && userEmail),
    isLoading,
    logout,
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
