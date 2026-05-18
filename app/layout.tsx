/**
 * @file app/layout.tsx
 * @description Root layout — wraps every page in the application.
 * Responsibilities: font loading, global metadata, viewport configuration.
 */

import type { Metadata, Viewport } from "next";
import { Cinzel, Nunito } from "next/font/google";
import "./globals.css";

/* ── Google Fonts ────────────────────────────────────────────────────────── */

/** Cinzel: serif display font for headings — elegant, classical feel */
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  display: "swap",
});

/** Nunito: rounded humanist sans-serif for body text — friendly and legible */
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

/* ── SEO Metadata ────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title:       { default: "ZenFlow", template: "%s · ZenFlow" },
  description: "Your personal wellness companion — expert articles, smart tracking, AI coaching.",
  keywords:    ["wellness", "health", "fitness", "nutrition", "meditation", "tracker"],
  authors:     [{ name: "Giulia Rossi", url: "https://zenflow.app" }],
  openGraph: {
    type:        "website",
    locale:      "en_GB",
    siteName:    "ZenFlow",
    title:       "ZenFlow — Your Wellness, Elevated",
    description: "Expert articles, smart daily tracking, AI wellness coaching.",
    images:      [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:  "summary_large_image",
    title: "ZenFlow — Your Wellness, Elevated",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width:            "device-width",
  initialScale:     1,
  themeColor:       "#007a75",
  colorScheme:      "dark",
};

/* ── Root Layout ─────────────────────────────────────────────────────────── */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
