import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiamondForms – Youth Sports Registration",
  description: "Generate professional registration forms and payment receipts for your youth sports team.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-50">
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}