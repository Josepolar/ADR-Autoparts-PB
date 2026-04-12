"use client";

import { useTheme } from "@/context/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative w-14 h-7 rounded-full transition-colors duration-500 ease-in-out cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
      style={{
        backgroundColor: isDark ? "rgba(42, 42, 53, 1)" : "rgba(228, 228, 231, 1)",
      }}
    >
      {/* Track glow on hover */}
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: isDark
            ? "inset 0 0 8px rgba(99, 102, 241, 0.15)"
            : "inset 0 0 8px rgba(250, 204, 21, 0.2)",
        }}
      />

      {/* Sun icon (shown in light mode on the left) */}
      <span
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
        style={{
          left: "6px",
          opacity: isDark ? 0.3 : 0,
          transform: `translateY(-50%) scale(${isDark ? 0.8 : 0.5})`,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>

      {/* Moon icon (shown in dark mode on the right) */}
      <span
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
        style={{
          right: "6px",
          opacity: isDark ? 0 : 0.3,
          transform: `translateY(-50%) scale(${isDark ? 0.5 : 0.8})`,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* Thumb */}
      <span
        className="absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.68,-0.15,0.27,1.15)]"
        style={{
          left: isDark ? "3px" : "calc(100% - 25px)",
          backgroundColor: isDark ? "#6366f1" : "#fbbf24",
          boxShadow: isDark
            ? "0 1px 6px rgba(99, 102, 241, 0.4)"
            : "0 1px 6px rgba(251, 191, 36, 0.4)",
        }}
      >
        {/* Thumb icon */}
        <span className="absolute inset-0 flex items-center justify-center">
          {isDark ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
