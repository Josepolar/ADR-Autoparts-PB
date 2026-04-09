import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "ADR Autoparts - Firmware, Parts & Services",
  description:
    "Custom automotive super-app for ECU firmware, parts retail, and service booking",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
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
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ff0000" />
        {/* Bold Display Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Squada+One&display=swap" rel="stylesheet" />
        {/* Prevent browser caching of auth state */}
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="bg-nardo-gray-900 text-nardo-gray-100">
        <AuthProvider>
          <Navbar />
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
