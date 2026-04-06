import type { Metadata } from "next";
import "./globals.css";

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
        <meta name="theme-color" content="#00d4ff" />
      </head>
      <body className="bg-nardo-gray-900 text-nardo-gray-100">
        {children}
      </body>
    </html>
  );
}
