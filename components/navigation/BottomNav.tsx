/**
 * @file components/navigation/BottomNav.tsx
 * @description Mobile-first bottom navigation bar.
 * Renders only below the "sm" breakpoint; desktop users rely on TopBar.
 * Active tab is highlighted in gold; all tabs use aria-current for accessibility.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Compass, CalendarDays,
  Activity, MessageCircle, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home",    href: "/dashboard", Icon: LayoutDashboard },
  { label: "Explore", href: "/explore",   Icon: Compass },
  { label: "Plan",    href: "/plan",      Icon: CalendarDays },
  { label: "Track",   href: "/tracker",   Icon: Activity },
  { label: "Coach",   href: "/coach",     Icon: MessageCircle },
  { label: "Me",      href: "/profile",   Icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 sm:hidden pb-safe",
        "border-t backdrop-blur-xl",
      )}
      style={{
        background: "rgba(0,33,32,0.94)",
        borderColor: "var(--clr-border)",
      }}
    >
      <div className="flex items-center justify-around h-14 px-1">
        {TABS.map(({ label, href, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              className="flex flex-col items-center gap-0.5 min-w-[44px] py-1 px-2"
            >
              <Icon
                size={20}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-gold" : "text-white/40"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wide transition-colors",
                  isActive ? "text-gold" : "text-white/30"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
