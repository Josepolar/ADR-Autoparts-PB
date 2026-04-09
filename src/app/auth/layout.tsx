import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - ADR Autoparts",
  description: "Sign in to your ADR Autoparts account",
};

// Disable caching for auth pages to prevent session issues
export const revalidate = 0;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Auth-specific meta tags to prevent caching in browser */}
      <meta name="robots" content="noindex, nofollow" />
      <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
      {children}
    </>
  );
}
