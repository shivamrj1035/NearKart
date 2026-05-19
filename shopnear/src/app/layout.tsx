import type { Metadata, Viewport } from "next";
import { Outfit, Figtree } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/ui/PageTransition";
import BottomNav from "@/components/ui/BottomNav";

import AppShell from "@/components/ui/AppShell";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopNear",
  description: "Find the right shop, before you step out.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevents zoom on input focus
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${figtree.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#2563EB" />
      </head>
      <body className="min-h-full flex flex-col bg-page-bg">
        <AppShell>
          <PageTransition>{children}</PageTransition>
        </AppShell>
        <BottomNav />
      </body>
    </html>
  );
}
