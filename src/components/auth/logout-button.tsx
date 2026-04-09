"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/modern-components";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

/**
 * Logout button component that handles session cleanup
 * Prevents back-button vulnerability by clearing all caches
 */
export function LogoutButton({
  variant = "secondary",
  size = "sm",
  className = "",
  showIcon = true,
}: LogoutButtonProps) {
  const { logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, force redirect to signin
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading || isLoggingOut}
      variant={variant}
      size={size}
      className={className}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}

export default LogoutButton;
