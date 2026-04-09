import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - ADR Autoparts",
  description: "Your ADR Autoparts dashboard with orders and bookings",
};

// Disable caching for user pages
export const revalidate = 0;

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
