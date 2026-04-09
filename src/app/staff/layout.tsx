import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Dashboard - ADR Autoparts",
  description: "Staff dashboard for managing bookings and orders",
};

// Disable caching for staff pages
export const revalidate = 0;

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
