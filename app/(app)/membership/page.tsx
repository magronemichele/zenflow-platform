/**
 * @file app/(app)/membership/page.tsx
 * @description Subscription plan selection screen.
 * Displays Free / Monthly / Annual tiers with expandable feature lists.
 * Free trial → immediate access; paid plans → /checkout.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronDown, Crown, Zap } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/utils/mockData";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui";
import type { SubscriptionTier } from "@/lib/types";

export default function MembershipPage() {
  const router      = useRouter();
  const user        = useStore((s) => s.user);
  const updateProfile = useStore((s) => s.updateProfile);
  const pushToast   = useStore((s) => s.pushToast);
  const [expanded, setExpanded] = useState<SubscriptionTier | null>("monthly");
  const [loading,  setLoading]  = useState<SubscriptionTier | null>(null);

  async function choose(plan: SubscriptionTier) {
    if (plan === "free") {
      setLoading("free");
      await new Promise((r) => setTimeout(r, 600));
      updateProfile({ subscription: "free" });
      pushToast("7-day free trial activated!", "success");
      router.push("/dashboard");
    } else {
      router.push(`/checkout?plan=${plan}`);
    }
    setLoading(null);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zen-violet flex flex-col items-center px-4 py-8">

      {/* Header */}
      <div className="mb-8 text-center max-w-xs">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 border border-gold/30">
          <Crown size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-xl font-bold text-white uppercase tracking-wide mb-2">
          Choose Your Plan
        </h1>
        <p className="text-xs text-white/60">
          Start free for 7 days. No credit card required for the trial.
          Cancel anytime.
        </p>
      </div>

      {/* Plan cards */}
      <div className="w-full max-w-sm space-y-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = user?.subscription === plan.id;
          const isExp     = expanded === plan.id;

          return (
            <div
              key={plan.id}
              className={`glass p-5 transition-all duration-300 ${
                plan.isPopular
                  ? "border-gold/40 ring-1 ring-gold/25"
                  : ""
              }`}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="mb-3 flex justify-center">
                  <span className="badge badge-gold flex items-center gap-1">
                    <Zap size={10} /> Most Popular
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="flex items-start justify-between mb-1">
                <h2 className="font-display text-gold font-bold text-base uppercase tracking-wide">
                  {plan.name}
                </h2>
                <div className="text-right">
                  <span className="font-display text-white text-2xl font-bold">
                    {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <p className="text-[10px] text-white/40">/ {plan.interval}</p>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-white/40 mb-4">
                {plan.interval === "trial"
                  ? "7 days — no payment details needed"
                  : plan.interval === "year"
                  ? `${formatCurrency(plan.price / 12)} / month, billed annually`
                  : "Billed monthly, cancel anytime"}
              </p>

              {/* CTA */}
              <Button
                variant={plan.id === "free" ? "primary" : "violet"}
                className="w-full"
                isLoading={loading === plan.id}
                disabled={isCurrent || loading !== null}
                onClick={() => choose(plan.id)}
              >
                {isCurrent
                  ? "Current Plan"
                  : plan.id === "free"
                  ? "Start Free Trial"
                  : "Subscribe Now"}
              </Button>

              {/* Feature toggle */}
              <button
                className="mt-3 flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
                onClick={() => setExpanded(isExp ? null : plan.id)}
                aria-expanded={isExp}
              >
                <span>What&apos;s included</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${isExp ? "rotate-180" : ""}`}
                />
              </button>

              {isExp && (
                <ul className="mt-3 space-y-2 animate-slide-up">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-white/65">
                      <CheckCircle size={13} className="shrink-0 mt-0.5 text-teal-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[10px] text-white/25 text-center max-w-xs">
        Secure payment via Stripe. By subscribing you agree to our Terms of Service
        and Privacy Policy.
      </p>
    </div>
  );
}
