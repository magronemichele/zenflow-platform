/**
 * @file components/content/ArticleCard.tsx
 * @description Versatile article card used in carousels, grids and lists.
 *
 * Variants:
 *  - "default"  → Tall card with cover image (carousel use)
 *  - "compact"  → Horizontal thumbnail card (list/sidebar use)
 *  - "featured" → Wide card with large image overlay (hero grid)
 *
 * Premium articles are blurred for free-tier users with an upgrade prompt.
 */

"use client";

import Link from "next/link";
import { Clock, Lock, Bookmark, Heart, TrendingUp } from "lucide-react";
import { cn, truncate, formatDate } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Category colour map
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_CLASSES: Record<string, string> = {
  nutrition:     "badge-teal",
  movement:      "badge-gold",
  meditation:    "badge-violet",
  sleep:         "badge-violet",
  mindfulness:   "badge-teal",
  recipes:       "badge-gold",
  "mental-health": "badge-red",
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function ArticleCard({
  article,
  variant = "default",
  className,
}: ArticleCardProps) {
  const user   = useStore((s) => s.user);
  const isLocked = article.isPremium && user?.subscription === "free";
  const badgeClass = CATEGORY_CLASSES[article.category] ?? "badge-teal";

  // ── Compact horizontal variant ───────────────────────────
  if (variant === "compact") {
    return (
      <Link
        href={isLocked ? "/membership" : `/article/${article.slug}`}
        className={cn(
          "glass flex gap-3 overflow-hidden p-3 transition-all hover:scale-[1.01]",
          className
        )}
        aria-label={article.title}
      >
        {/* Thumbnail */}
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${article.coverUrl})` }}
          />
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
              <Lock size={14} className="text-gold" />
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="min-w-0 flex-1">
          <span className={cn("badge mb-1", badgeClass)}>
            {article.category}
          </span>
          <p className="line-clamp-2 text-xs font-semibold leading-snug text-white">
            {article.title}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-muted">
            <Clock size={10} /> {article.readingTime} min
          </p>
        </div>
      </Link>
    );
  }

  // ── Default tall card ─────────────────────────────────────
  return (
    <Link
      href={isLocked ? "/membership" : `/article/${article.slug}`}
      className={cn(
        "glass group flex flex-col overflow-hidden transition-all duration-250",
        "hover:scale-[1.02] hover:shadow-card-lg",
        className
      )}
      aria-label={article.title}
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${article.coverUrl})` }}
          role="img"
          aria-label={`Cover for ${article.title}`}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Premium lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm">
            <Lock size={20} className="text-gold" />
            <span className="text-[10px] font-bold text-gold uppercase tracking-wide">
              Premium
            </span>
          </div>
        )}

        {/* Top-right badges */}
        <div className="absolute right-2 top-2 flex gap-1">
          {article.isPremium && (
            <span className="badge badge-gold">VIP</span>
          )}
          {article.stats.views > 20000 && (
            <span className="badge badge-teal flex items-center gap-0.5">
              <TrendingUp size={9} /> Trending
            </span>
          )}
        </div>

        {/* Bottom-left category */}
        <div className="absolute bottom-2 left-3">
          <span className={cn("badge", badgeClass)}>{article.category}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-gold text-sm font-bold leading-snug mb-2">
          {article.title}
        </h3>
        <p className="flex-1 text-xs text-muted leading-relaxed mb-3">
          {truncate(article.summary, 90)}
        </p>

        {/* Footer meta */}
        <div className="flex items-center justify-between text-[10px] text-faint border-t pt-2"
             style={{ borderColor: "var(--clr-border)" }}>
          <div className="flex items-center gap-1.5">
            {/* Author mini avatar */}
            <div
              className="h-5 w-5 rounded-full bg-cover bg-center border border-white/20"
              style={{ backgroundImage: `url(${article.author.avatarUrl})` }}
            />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-0.5">
              <Clock size={9} /> {article.readingTime}m
            </span>
            <span className="flex items-center gap-0.5">
              <Heart size={9} /> {(article.stats.likes / 1000).toFixed(1)}k
            </span>
            <span className="flex items-center gap-0.5">
              <Bookmark size={9} /> {article.stats.saves}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
