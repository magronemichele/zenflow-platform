/**
 * @file components/navigation/TopBar.tsx
 * @description Fixed top navigation bar rendered inside the authenticated app shell.
 *
 * Desktop: logo + nav links + user avatar menu
 * Mobile:  logo + hamburger icon (bottom nav handles mobile navigation)
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User, Crown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, selectUser } from "@/lib/store";

const NAV_LINKS = [
  { label: "Explore",    href: "/explore" },
  { label: "Plan",       href: "/plan" },
  { label: "Tracker",    href: "/tracker" },
  { label: "Coach",      href: "/coach" },
  { label: "Membership", href: "/membership" },
] as const;

export function TopBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const user     = useStore(selectUser);
  const logout   = useStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "ZF";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 h-14",
        "border-b backdrop-blur-xl transition-colors",
      )}
      style={{
        background: "rgba(0,33,32,0.88)",
        borderColor: "var(--clr-border)",
      }}
    >
      <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-4">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="ZenFlow home">
          {/* SVG leaf mark */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="14" fill="rgba(0,196,188,0.2)" />
            <path d="M14 4C9 8 7 16 14 24C21 16 19 8 14 4Z" fill="#00c4bc" opacity="0.85" />
            <path d="M14 6C11.5 10 11 16 14 22C17 16 17.5 10 14 6Z" fill="#007a75" />
            <line x1="14" y1="8" x2="14" y2="22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" />
          </svg>
          <span
            className="font-display text-base font-bold uppercase tracking-widest"
            style={{ color: "var(--clr-accent)" }}
          >
            ZenFlow
          </span>
          {user?.subscription !== "free" && (
            <span className="badge badge-gold gap-0.5 text-[9px]">
              <Crown size={9} /> Pro
            </span>
          )}
        </Link>

        {/* ── Desktop nav ──────────────────────────────────── */}
        <nav className="hidden sm:flex items-center gap-5" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              data-active={pathname.startsWith(href)}
              className="nav-item"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── User menu ─────────────────────────────────────── */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-white/8"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold">
              {initials}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-white/80">
              {user?.firstName}
            </span>
            <ChevronDown size={13} className={cn("text-white/40 transition-transform", menuOpen && "rotate-180")} />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div
                role="menu"
                className={cn(
                  "absolute right-0 top-full mt-2 z-20 w-44 rounded-2xl py-1",
                  "glass shadow-card-lg animate-scale-in"
                )}
              >
                <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/8 hover:text-white">
                  <User size={14} /> Profile
                </Link>
                <div className="divider my-1" />
                <button role="menuitem" onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/8">
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
