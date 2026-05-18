/**
 * @file lib/utils/index.ts
 * @description Shared utility functions used across the ZenFlow codebase.
 * All helpers are pure functions — no side effects, easy to unit test.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── CSS Class Merging ───────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names with conditional support.
 * Uses clsx for conditionals and tailwind-merge to deduplicate conflicting classes.
 *
 * @example cn("px-4 py-2", isActive && "bg-teal-500", "hover:opacity-80")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Identity ────────────────────────────────────────────────────────────────

/**
 * Generates a pseudo-random UUID v4 string (client-safe, no crypto dependency).
 * For production use, prefer `crypto.randomUUID()` server-side.
 */
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─── Date / Time ─────────────────────────────────────────────────────────────

/**
 * Formats an ISO-8601 date string to a human-readable locale string.
 * @param iso  - ISO date string (e.g. "2024-12-15")
 * @param opts - Optional Intl.DateTimeFormat options override
 */
export function formatDate(
  iso: string,
  opts?: Intl.DateTimeFormatOptions
): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

/**
 * Returns "X minutes ago", "2 hours ago", etc. relative to now.
 */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)   return "just now";
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Returns today's date as YYYY-MM-DD */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── String Helpers ───────────────────────────────────────────────────────────

/**
 * Converts a string to a URL-safe slug.
 * Handles common accented characters for multilingual support.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[àáâã]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Truncates a string to the given character limit, appending an ellipsis.
 */
export function truncate(text: string, limit = 120): string {
  return text.length <= limit ? text : text.slice(0, limit).trimEnd() + "…";
}

/**
 * Capitalises the first letter of every word in a string.
 */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Number / Currency ───────────────────────────────────────────────────────

/**
 * Formats a number as a EUR currency string.
 * @example formatCurrency(15) → "€15.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Clamps a number between a min and max bound.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Array Helpers ────────────────────────────────────────────────────────────

/**
 * Chunks an array into sub-arrays of the given size.
 * Useful for building grid/carousel pages.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 * Returns a NEW array (does not mutate the original).
 */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
