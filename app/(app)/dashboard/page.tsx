/**
 * @file app/(app)/dashboard/page.tsx
 * @description Main dashboard — the first screen users see after login.
 *
 * Sections (top → bottom):
 *  1. Personalised greeting + streak widget
 *  2. Hero carousel (4 full-width slides, autoplay)
 *  3. Quick daily tips carousel (horizontal chips)
 *  4. Trending articles carousel (2-col)
 *  5. Category-filtered carousels: Nutrition | Movement | Mindfulness
 *  6. Coach CTA banner
 *  7. Latest premium articles teaser
 */

"use client";

import Link from "next/link";
import { MessageCircle, TrendingUp, Flame, Target, Zap } from "lucide-react";

import { Carousel } from "@/components/carousel/Carousel";
import { HeroBanner } from "@/components/content/HeroBanner";
import { ArticleCard } from "@/components/content/ArticleCard";
import { useStore, selectUser } from "@/lib/store";
import {
  HERO_SLIDES, ARTICLES, QUICK_TIPS, COACHES,
} from "@/lib/utils/mockData";

// ─────────────────────────────────────────────────────────────────────────────
// Derived data slices
// ─────────────────────────────────────────────────────────────────────────────

const trending   = ARTICLES.filter((a) => a.stats.views > 15000);
const nutrition  = ARTICLES.filter((a) => a.category === "nutrition" || a.category === "recipes");
const movement   = ARTICLES.filter((a) => a.category === "movement");
const mindful    = ARTICLES.filter((a) => a.category === "mindfulness" || a.category === "meditation");
const premium    = ARTICLES.filter((a) => a.isPremium);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user    = useStore(selectUser);
  const weights = useStore((s) => s.weights);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-4">

      {/* ── 1. Greeting & Stats ───────────────────────────── */}
      <section className="px-4">
        <h1 className="font-display text-xl font-bold" style={{ color: "var(--clr-accent)" }}>
          {greeting}, {user?.firstName} 👋
        </h1>
        <p className="mt-0.5 text-sm text-muted">
          Here&apos;s your wellness overview for today.
        </p>

        {/* Mini stat chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[
            { icon: Flame,    label: "Streak",   value: "7 days",  color: "text-orange-400" },
            { icon: Target,   label: "Goal",     value: "On track",color: "text-teal-400" },
            { icon: Zap,      label: "Energy",   value: "High",    color: "text-gold" },
            { icon: TrendingUp,label:"Progress", value: weights.length > 0 ? `${weights[0].valueKg} kg` : "—", color: "text-violet-light" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass shrink-0 flex items-center gap-2 rounded-2xl px-3 py-2">
              <Icon size={15} className={color} aria-hidden="true" />
              <div>
                <p className="text-[9px] text-muted uppercase font-bold tracking-wide">{label}</p>
                <p className="text-xs font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Hero carousel ─────────────────────────────── */}
      <Carousel
        title="Featured"
        subtitle="Handpicked for you today"
        autoplay={5000}
        showDots
        className="px-0"
      >
        {HERO_SLIDES.map((slide) => (
          <HeroBanner key={slide.id} slide={slide} />
        ))}
      </Carousel>

      {/* ── 3. Quick Tips carousel ───────────────────────── */}
      <section className="px-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="section-title">Daily Tips</h2>
            <p className="section-sub mt-0.5">Science-backed micro-habits</p>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {QUICK_TIPS.map((tip) => (
            <div key={tip.id} className="glass shrink-0 w-56 rounded-2xl p-4">
              <div className="mb-2 text-2xl" role="img" aria-label={tip.category}>
                {tip.emoji}
              </div>
              <span className="badge badge-teal mb-2">{tip.category}</span>
              <p className="text-xs text-white/80 leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Trending Articles carousel ────────────────── */}
      <Carousel
        title="Trending Now"
        subtitle="Most-read this week"
        seeAll={{ label: "See all", href: "/explore" }}
        cols={2}
      >
        {trending.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </Carousel>

      {/* ── 5a. Nutrition carousel ────────────────────────── */}
      <Carousel
        title="Nutrition & Recipes"
        subtitle="Fuel your body right"
        seeAll={{ label: "See all", href: "/explore?category=nutrition" }}
      >
        {nutrition.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </Carousel>

      {/* ── 5b. Movement carousel ────────────────────────── */}
      <Carousel
        title="Move & Train"
        subtitle="Workouts for every level"
        seeAll={{ label: "See all", href: "/explore?category=movement" }}
        cols={2}
      >
        {movement.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </Carousel>

      {/* ── 5c. Mindfulness carousel ─────────────────────── */}
      <Carousel
        title="Mind & Soul"
        subtitle="Practices for inner calm"
        seeAll={{ label: "See all", href: "/explore?category=mindfulness" }}
      >
        {mindful.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </Carousel>

      {/* ── 6. Coach CTA ──────────────────────────────────── */}
      <section className="px-4">
        <div
          className="relative overflow-hidden rounded-3xl p-5"
          style={{ background: "linear-gradient(135deg, #5a2e9a 0%, #00a8a1 100%)" }}
        >
          <div className="relative z-10">
            <p className="badge badge-gold mb-3">AI Powered</p>
            <h2 className="font-display text-lg font-bold text-white mb-2">
              Meet Your Personal Wellness Coach
            </h2>
            <p className="text-xs text-white/70 mb-4 max-w-xs">
              Get personalised advice, workout plans and nutrition guidance — available 24/7.
            </p>

            {/* Coach avatars */}
            <div className="mb-4 flex -space-x-2">
              {COACHES.map((c) => (
                <div
                  key={c.id}
                  className="h-9 w-9 rounded-full border-2 border-white/30 bg-cover bg-center"
                  style={{ backgroundImage: `url(${c.avatarUrl})` }}
                  title={c.name}
                />
              ))}
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/30 bg-black/30 text-[10px] font-bold text-white">
                +3
              </div>
            </div>

            <Link href="/coach" className="btn-primary inline-flex gap-1.5 text-xs">
              <MessageCircle size={14} /> Chat with a Coach
            </Link>
          </div>

          {/* Decorative circle */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" aria-hidden="true" />
          <div className="absolute -bottom-6 right-10 h-24 w-24 rounded-full bg-white/5" aria-hidden="true" />
        </div>
      </section>

      {/* ── 7. Premium content teaser ────────────────────── */}
      <Carousel
        title="Premium Reads"
        subtitle="Unlock with a Pro membership"
        seeAll={{ label: "Upgrade", href: "/membership" }}
        cols={2}
      >
        {premium.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </Carousel>

      {/* Bottom spacer for mobile bottom nav */}
      <div className="h-4" aria-hidden="true" />
    </div>
  );
}
