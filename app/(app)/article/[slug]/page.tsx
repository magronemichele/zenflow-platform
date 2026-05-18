/**
 * @file app/(app)/article/[slug]/page.tsx
 * @description Full article reader view.
 * Looks up the article by slug from the mock data store.
 * Premium articles redirect free users to /membership.
 */
"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Heart, Bookmark, TrendingUp } from "lucide-react";
import { ARTICLES } from "@/lib/utils/mockData";
import { useStore, selectUser } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Carousel } from "@/components/carousel/Carousel";
import { ArticleCard } from "@/components/content/ArticleCard";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const router   = useRouter();
  const user     = useStore(selectUser);

  const article = ARTICLES.find((a) => a.slug === slug);
  const related = ARTICLES.filter((a) => a.id !== article?.id && a.category === article?.category).slice(0, 4);

  useEffect(() => {
    if (article?.isPremium && user?.subscription === "free") router.replace("/membership");
  }, [article, user, router]);

  if (!article) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center px-4">
      <p className="text-4xl">📖</p>
      <p className="font-bold text-white">Article not found</p>
      <button onClick={() => router.back()} className="btn-ghost text-sm">Go back</button>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl pb-8">
      {/* Back button */}
      <div className="sticky top-14 z-10 px-4 py-2 backdrop-blur-md" style={{ background: "rgba(0,33,32,0.7)" }}>
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Hero image */}
      <div className="relative h-56 w-full overflow-hidden">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${article.coverUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002120] via-transparent to-transparent" />
      </div>

      {/* Article content */}
      <div className="px-4 -mt-8 relative z-10">
        <span className="badge badge-teal mb-3">{article.category}</span>
        <h1 className="font-display text-gold text-xl font-bold leading-tight mb-3">{article.title}</h1>

        {/* Meta row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-cover bg-center border border-white/20"
              style={{ backgroundImage: `url(${article.author.avatarUrl})` }} />
            <div>
              <p className="text-xs font-semibold text-white">{article.author.name}</p>
              <p className="text-[10px] text-muted">{article.author.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted">
            <span className="flex items-center gap-1"><Clock size={10} /> {article.readingTime}m</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl flex items-center justify-around py-3 mb-5">
          {[
            { Icon: TrendingUp, value: article.stats.views.toLocaleString(), label: "views" },
            { Icon: Heart,      value: article.stats.likes.toLocaleString(), label: "likes" },
            { Icon: Bookmark,   value: article.stats.saves.toLocaleString(), label: "saves" },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <Icon size={15} className="text-teal-400" />
              <span className="text-sm font-bold text-white">{value}</span>
              <span className="text-[10px] text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <p className="text-sm text-white/80 leading-[1.85] mb-4">{article.summary}</p>
        <div className="space-y-4 text-sm text-white/70 leading-[1.85]">
          {article.body.split(". ").reduce<string[]>((acc, sentence, i, arr) => {
            const para = Math.floor(i / 3);
            acc[para] = ((acc[para] ?? "") + sentence + (i < arr.length - 1 ? ". " : "")).trim();
            return acc;
          }, []).map((para, i) => para && <p key={i}>{para}</p>)}
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((t) => <span key={t} className="badge badge-teal">#{t}</span>)}
        </div>
      </div>

      {/* Related articles carousel */}
      {related.length > 0 && (
        <div className="mt-8">
          <Carousel title="More Like This" subtitle={`More from ${article.category}`} cols={2}>
            {related.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}
          </Carousel>
        </div>
      )}
    </div>
  );
}
