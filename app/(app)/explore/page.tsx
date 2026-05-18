/**
 * @file app/(app)/explore/page.tsx
 * @description Content discovery page.
 * Features: full-text search, category pill filters, difficulty filter,
 * and a responsive card grid.
 */

"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import { ArticleCard } from "@/components/content/ArticleCard";
import { Carousel } from "@/components/carousel/Carousel";
import { ARTICLES } from "@/lib/utils/mockData";
import type { ContentCategory, ContentDifficulty } from "@/lib/types";

const CATEGORIES: { label: string; value: ContentCategory | "all" }[] = [
  { label: "All",          value: "all" },
  { label: "Nutrition",    value: "nutrition" },
  { label: "Movement",     value: "movement" },
  { label: "Meditation",   value: "meditation" },
  { label: "Sleep",        value: "sleep" },
  { label: "Mindfulness",  value: "mindfulness" },
  { label: "Recipes",      value: "recipes" },
  { label: "Mental Health",value: "mental-health" },
];

const DIFFICULTIES: { label: string; value: ContentDifficulty | "all" }[] = [
  { label: "All levels",   value: "all" },
  { label: "Beginner",     value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced",     value: "advanced" },
];

export default function ExplorePage() {
  const params = useSearchParams();

  const [query,      setQuery]      = useState("");
  const [category,   setCategory]   = useState<ContentCategory | "all">(
    (params.get("category") as ContentCategory) ?? "all"
  );
  const [difficulty, setDifficulty] = useState<ContentDifficulty | "all">("all");

  const filtered = useMemo(() =>
    ARTICLES.filter((a) => {
      const matchCat  = category === "all" || a.category === category;
      const matchDiff = difficulty === "all" || a.difficulty === difficulty;
      const matchQ    = !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some((t) => t.includes(query.toLowerCase()));
      return matchCat && matchDiff && matchQ;
    }),
    [query, category, difficulty]
  );

  const recent = useMemo(() =>
    [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4),
    []
  );

  return (
    <div className="mx-auto max-w-2xl py-4 space-y-6">

      {/* Page header */}
      <div className="px-4">
        <h1 className="font-display text-xl font-bold text-accent">Explore</h1>
        <p className="text-sm text-muted mt-0.5">
          {ARTICLES.length} expert articles across all wellness disciplines
        </p>
      </div>

      {/* Search bar */}
      <div className="px-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            className="field pl-10 pr-4"
            placeholder="Search articles, tags, topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search articles"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={category === c.value ? "pill-tab pill-tab-active" : "pill-tab pill-tab-inactive"}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Difficulty pills */}
      <div className="flex items-center gap-2 px-4">
        <SlidersHorizontal size={13} className="text-white/40 shrink-0" />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={difficulty === d.value ? "pill-tab pill-tab-active" : "pill-tab pill-tab-inactive"}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recently added carousel (shown when no search active) */}
      {!query && category === "all" && (
        <Carousel title="Recently Added" subtitle="Fresh content this month" cols={2}>
          {recent.map((a) => <ArticleCard key={a.id} article={a} />)}
        </Carousel>
      )}

      {/* Results grid */}
      <div className="px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-muted">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {category !== "all" && ` in ${category}`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="glass rounded-3xl py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm font-semibold text-white/60">No results found</p>
            <p className="text-xs text-muted mt-1">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
