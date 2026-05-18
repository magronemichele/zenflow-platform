/**
 * @file components/carousel/Carousel.tsx
 * @description Generic, fully accessible horizontal carousel.
 *
 * Features:
 *  - Smooth CSS scroll snap (no library dependency)
 *  - Keyboard-navigable (ArrowLeft / ArrowRight)
 *  - ARIA-compliant (role="region", aria-label, aria-roledescription)
 *  - Dot indicators with active state
 *  - Optional autoplay with pause-on-hover
 *  - Responsive: shows 1 / 2 / 3 items based on `cols` prop
 *  - Touch/swipe-friendly via native overflow-x scroll
 *
 * @example
 * <Carousel title="Trending Articles" autoplay>
 *   {articles.map(a => <ArticleCard key={a.id} article={a} />)}
 * </Carousel>
 */

"use client";

import {
  useRef, useState, useEffect, useCallback,
  type ReactNode, type KeyboardEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface CarouselProps {
  /** Displayed above the carousel row */
  title?: string;
  /** Sub-label next to the title */
  subtitle?: string;
  /** "See all" link label + href */
  seeAll?: { label: string; href: string };
  children: ReactNode[];
  /** Number of visible columns (default 1 on mobile, 2 on sm, 3 on lg) */
  cols?: 1 | 2 | 3;
  /** Auto-advances every N ms when true or a number is given (default 4000ms) */
  autoplay?: boolean | number;
  /** Extra class on the outer wrapper */
  className?: string;
  /** If true, dots are shown (default true when > 3 items) */
  showDots?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function Carousel({
  title,
  subtitle,
  seeAll,
  children,
  cols = 1,
  autoplay = false,
  className,
  showDots,
}: CarouselProps) {
  const trackRef   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused,  setPaused] = useState(false);

  const count    = children.length;
  const showDotsFinal = showDots ?? count > 2;
  const autoMs   = typeof autoplay === "number" ? autoplay : 4000;

  // ── Scroll to slide index ────────────────────────────────
  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.children[index] as HTMLElement | undefined;
    if (!item) return;
    track.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
    setActive(index);
  }, []);

  const prev = () => scrollTo((active - 1 + count) % count);
  const next = () => scrollTo((active + 1) % count);

  // ── Keyboard navigation ──────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  };

  // ── Autoplay ─────────────────────────────────────────────
  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(() => scrollTo((active + 1) % count), autoMs);
    return () => clearInterval(id);
  }, [autoplay, paused, active, count, autoMs, scrollTo]);

  // ── Sync dot with native scroll position ─────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(track.children).indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [count]);

  // ── Column width classes ──────────────────────────────────
  const itemClass = cn(
    "shrink-0 snap-start",
    cols === 1 && "w-full",
    cols === 2 && "w-[calc(50%-8px)]",
    cols === 3 && "w-[calc(33.333%-11px)]"
  );

  return (
    <section
      className={cn("w-full", className)}
      aria-label={title ?? "Carousel"}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Header ──────────────────────────────────────── */}
      {(title || seeAll) && (
        <div className="mb-3 flex items-end justify-between px-4">
          <div>
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-sub mt-0.5">{subtitle}</p>}
          </div>
          {seeAll && (
            <a
              href={seeAll.href}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
            >
              {seeAll.label} →
            </a>
          )}
        </div>
      )}

      {/* ── Track ────────────────────────────────────────── */}
      <div className="relative group">
        <div
          ref={trackRef}
          role="group"
          aria-label={`${title ?? "Carousel"} items`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide",
            "scroll-smooth snap-x snap-mandatory",
            "outline-none focus-visible:outline-none"
          )}
        >
          {children.map((child, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${count}`}
              className={itemClass}
            >
              {child}
            </div>
          ))}
        </div>

        {/* ── Prev / Next arrows (visible on hover, desktop) ── */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className={cn(
                "absolute left-1 top-1/2 -translate-y-1/2 z-10",
                "h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm",
                "flex items-center justify-center text-white",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "hover:bg-black/70"
              )}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 z-10",
                "h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm",
                "flex items-center justify-center text-white",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "hover:bg-black/70"
              )}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* ── Dot indicators ───────────────────────────────── */}
      {showDotsFinal && count > 1 && (
        <div
          role="tablist"
          aria-label="Slides"
          className="mt-3 flex justify-center gap-1.5"
        >
          {children.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active
                  ? "w-5 bg-gold"
                  : "w-1.5 bg-white/25 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
