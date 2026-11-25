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
  title: { default: "ZenFlow", template: "%s · ZenFlow" },
  description: "A local wellness journal for routines, meals, and movement.",
  authors: [{ name: "Michele Magrone" }, { name: "Giovanni Rutigliano" }],
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
