import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { ToastProvider } from "@/context/toast-context";
import { ToastContainer } from "@/components/toast-container";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "ADR Autoparts - Firmware, Parts & Services",
  description:
    "Custom automotive super-app for ECU firmware, parts retail, and service booking",
  icons: [
    { rel: "icon", url: "/favicon.png", type: "image/png" },
    { rel: "apple-touch-icon", url: "/apple-icon.png" },
  ],
};

// Disable static generation caching for auth-sensitive pages
export const maxDuration = 60;
export const revalidate = 0; // No ISR caching for auth pages

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
        {/* Display + Body Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Squada+One&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Prevent browser caching of auth state */}
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="bg-[#0a0a0f] text-white transition-colors duration-300 antialiased">
        <SessionProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <Navbar />
                  <ToastContainer />
                  {children}
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
