/**
 * @file components/content/HeroBanner.tsx
 * @description Full-width hero slide used inside the dashboard hero carousel.
 * Renders a background image with gradient overlay, category tag, headline,
 * subline and a CTA button.
 */

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/lib/utils/mockData";

interface Props {
  slide: HeroSlide;
}

export function HeroBanner({ slide }: Props) {
  return (
    <article
      className="relative h-64 w-full overflow-hidden rounded-2xl"
      aria-label={slide.headline}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${slide.imageUrl})` }}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,20,20,0.88) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        {/* Tag pill */}
        <span className="badge badge-teal mb-2 self-start">{slide.tag}</span>

        {/* Headline */}
        <h2 className="font-display text-gold text-lg font-bold leading-tight mb-1">
          {slide.headline}
        </h2>

        {/* Subline */}
        <p className="text-xs text-white/70 mb-4 line-clamp-2 max-w-xs">
          {slide.subline}
        </p>

        {/* CTA */}
        <Link
          href={slide.ctaHref}
          className="btn btn-primary self-start text-xs px-4 py-2"
        >
          {slide.ctaLabel}
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}
