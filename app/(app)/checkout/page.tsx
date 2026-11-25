"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { SUBSCRIPTION_PLANS } from "@/lib/utils/mockData";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui";

function DemoCheckout() {
  const params = useSearchParams();
  const router = useRouter();
  const updateProfile = useStore((state) => state.updateProfile);
  const pushToast = useStore((state) => state.pushToast);
  const planId = params.get("plan");
  const plan = SUBSCRIPTION_PLANS.find((item) => item.id === planId && item.id !== "free");

  if (!plan) {
    return (
      <section className="glass mx-auto my-8 max-w-lg space-y-4 p-6">
        <h1 className="section-title">Choose a demo plan</h1>
        <Link href="/membership" className="btn-primary inline-flex">View plans</Link>
      </section>
    );
  }

  function activateDemo() {
    if (!plan) return;
    updateProfile({ subscription: plan.id });
    pushToast(`${plan.name} enabled on this browser.`, "success");
    router.push("/dashboard");
  }

  return (
    <section className="glass mx-auto my-8 max-w-lg space-y-5 p-6">
      <h1 className="section-title text-2xl">Preview membership</h1>
      <p className="font-bold">{plan.name} · {formatCurrency(plan.price)} / {plan.interval}</p>
      <p className="text-muted">This simulation changes your plan in this browser. No card details are collected and no payment is made.</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={activateDemo}>Activate demo plan</Button>
        <Link href="/membership" className="btn-ghost">Back to plans</Link>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="p-6" role="status">Loading plan…</p>}>
      <DemoCheckout />
    </Suspense>
  );
}
