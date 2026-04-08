"use client";

import React from "react";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";
import { ChevronDown, Loader2, Search } from "lucide-react";

/* ============================================
   Modern UI Components - Better UX/UI
   ============================================ */

// Modern Button Component
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<{ className: string }>;
  loading?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: "bg-cyber-blue-500 text-white hover:bg-cyber-blue-600 shadow-lg hover:shadow-glow-blue",
    secondary: "bg-nardo-gray-700 text-nardo-gray-100 hover:bg-nardo-gray-600 border border-nardo-gray-600",
    ghost: "bg-transparent text-nardo-gray-100 hover:bg-nardo-gray-800 border border-nardo-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

// Modern Badge Component
export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const variants = {
    default: "bg-nardo-gray-700 text-nardo-gray-100",
    success: "bg-green-900/30 text-green-200 border border-green-700",
    warning: "bg-yellow-900/30 text-yellow-200 border border-yellow-700",
    danger: "bg-red-900/30 text-red-200 border border-red-700",
    info: "bg-cyber-blue-900/30 text-cyber-blue-200 border border-cyber-blue-700",
  };

  return <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${variants[variant]} ${className}`}>{children}</span>;
}

// Loading Spinner
export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return <Loader2 className={`${sizes[size]} animate-spin text-cyber-blue-500 ${className}`} />;
}

// Card Component
export function Card({ children, className = "", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <div className={`bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-250 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Modern Alert Component
export function Alert({
  children,
  type = "info",
  dismissible = false,
  onDismiss,
  className = "",
}: {
  children: React.ReactNode;
  type?: "success" | "warning" | "danger" | "info";
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) return null;

  const styles = {
    success: {
      bg: "bg-green-900/20",
      border: "border-green-700",
      text: "text-green-200",
      icon: <FiCheck className="w-5 h-5" />,
    },
    warning: {
      bg: "bg-yellow-900/20",
      border: "border-yellow-700",
      text: "text-yellow-200",
      icon: <FiAlertCircle className="w-5 h-5" />,
    },
    danger: {
      bg: "bg-red-900/20",
      border: "border-red-700",
      text: "text-red-200",
      icon: <FiX className="w-5 h-5" />,
    },
    info: {
      bg: "bg-cyber-blue-900/20",
      border: "border-cyber-blue-700",
      text: "text-cyber-blue-200",
      icon: <FiInfo className="w-5 h-5" />,
    },
  };

  const style = styles[type];

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${style.bg} ${style.border} ${style.text} ${className}`}>
      {style.icon}
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={() => {
            setIsOpen(false);
            onDismiss?.();
          }}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Modern Input Component
export function Input({
  icon: Icon,
  error,
  label,
  className = "",
  ...props
}: {
  icon?: React.ComponentType<{ className: string }>;
  error?: string;
  label?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-nardo-gray-100 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-nardo-gray-400 pointer-events-none" />}
        <input
          className={`w-full px-4 py-2 ${Icon ? "pl-10" : ""} bg-nardo-gray-800 border ${error ? "border-red-600" : "border-nardo-gray-700"} rounded-lg text-nardo-gray-100 placeholder-nardo-gray-400 focus:outline-none focus:border-cyber-blue-500 focus:ring-2 focus:ring-cyber-blue-500 focus:ring-opacity-50 transition-all duration-250 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Modern Dropdown Component
export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: {
  label?: string;
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-nardo-gray-100 mb-2">{label}</label>}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 flex items-center justify-between bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg text-nardo-gray-100 hover:border-cyber-blue-500 transition-colors duration-250 ${className}`}
        >
          <span>{options.find((o) => o.value === value)?.label || placeholder}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-nardo-gray-700 border border-nardo-gray-600 rounded-lg shadow-lg z-10">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-cyber-blue-500 hover:text-white transition-colors duration-250 first:rounded-t-lg last:rounded-b-lg"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading Skeleton
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-nardo-gray-700 animate-pulse rounded ${className}`} />;
}

// Stats Card
export function StatsCard({ label, value, trend, icon: Icon }: { label: string; value: string | number; trend?: number; icon?: React.ComponentType<{ className: string }> }) {
  return (
    <Card className="text-center">
      {Icon && <Icon className="w-8 h-8 text-cyber-blue-500 mx-auto mb-4" />}
      <p className="text-nardo-gray-400 text-sm mb-2">{label}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      {trend && <Badge variant={trend > 0 ? "success" : "danger"}>{trend > 0 ? "+" : ""}{trend}%</Badge>}
    </Card>
  );
}

// Search Bar
export function SearchBar({ placeholder = "Search...", onSearch, className = "" }: { placeholder?: string; onSearch?: (value: string) => void; className?: string }) {
  return <Input icon={Search} type="text" placeholder={placeholder} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch?.(e.target.value)} className={className} />;
}
