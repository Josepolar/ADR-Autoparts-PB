import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - ADR Autoparts",
  description: "Admin dashboard for managing ADR Autoparts",
};

// Disable caching for admin pages
export const revalidate = 0;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
