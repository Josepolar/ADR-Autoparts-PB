"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const suggestions = [
  { label: "ECU Firmware", href: "/autoecu", tag: "AutoECU" },
  { label: "Brake Pads", href: "/parts", tag: "Parts" },
  { label: "Oil Change", href: "/rapide", tag: "Service" },
  { label: "Performance Tuning", href: "/autoecu", tag: "AutoECU" },
  { label: "Air Filters", href: "/parts", tag: "Parts" },
  { label: "Wheel Alignment", href: "/rapide", tag: "Service" },
];

const placeholders = [
  "Search parts, firmware, or services...",
  "Try \"brake pads\" or \"ECU tune\"...",
  "What does your car need today?",
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Rotate placeholder text as a subtle psychological nudge
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = query.length > 0
    ? suggestions.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions;

  function handleSelect(href: string) {
    setFocused(false);
    setQuery("");
    router.push(href);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setFocused(false);
      router.push(`/parts?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  const tagColors: Record<string, string> = {
    AutoECU: "bg-red-500/10 text-red-400",
    Parts: "bg-blue-500/10 text-blue-400",
    Service: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        {/* Glow ring on focus */}
        <div
          className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-500 ${
            focused ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(59,130,246,0.2), rgba(245,158,11,0.2))",
            filter: "blur(6px)",
          }}
        />

        <div
          className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            focused
              ? "bg-[#16161d] dark:bg-[#16161d] light-mode:bg-white border-[#3a3a45] dark:border-[#3a3a45] light-mode:border-gray-300 shadow-lg shadow-black/10"
              : "bg-[#16161d]/80 dark:bg-[#16161d]/80 light-mode:bg-gray-100/80 border-[#2a2a35] dark:border-[#2a2a35] light-mode:border-gray-200 hover:border-[#3a3a45] dark:hover:border-[#3a3a45] light-mode:hover:border-gray-300"
          } border backdrop-blur-sm`}
        >
          <Search
            className={`w-4.5 h-4.5 shrink-0 transition-colors duration-300 ${
              focused ? "text-red-400" : "text-gray-500"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholders[placeholderIdx]}
            className="flex-1 bg-transparent text-sm text-white dark:text-white light-mode:text-gray-900 placeholder-gray-500 outline-none"
          />
          {query && (
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {!query && !focused && (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-[#1e1e28] dark:bg-[#1e1e28] light-mode:bg-gray-200 rounded-md border border-[#2a2a35] dark:border-[#2a2a35] light-mode:border-gray-300">
              /
            </kbd>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {focused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#16161d] dark:bg-[#16161d] light-mode:bg-white border border-[#2a2a35] dark:border-[#2a2a35] light-mode:border-gray-200 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50 animate-fade-in">
          <div className="px-4 py-2.5 border-b border-[#2a2a35] dark:border-[#2a2a35] light-mode:border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Sparkles className="w-3 h-3" />
              {query ? "Results" : "Popular searches"}
            </div>
          </div>

          <div className="py-1.5 max-h-64 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#1e1e28] dark:hover:bg-[#1e1e28] light-mode:hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-white dark:text-white light-mode:text-gray-800">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagColors[item.tag] || "bg-gray-500/10 text-gray-400"}`}>
                    {item.tag}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-[#2a2a35] dark:border-[#2a2a35] light-mode:border-gray-100 text-[10px] text-gray-600 flex items-center justify-between">
            <span>Press Enter to search parts</span>
            <span>ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
