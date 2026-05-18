/**
 * @file app/(app)/checkout/page.tsx
 * @description Stripe-ready payment form.
 * Reads `?plan=monthly|annual` from the URL query string.
 * In production replace the timeout with a real Stripe PaymentIntent call.
 */
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Lock } from "lucide-react";
import { useState } from "react";
import { paymentSchema, type PaymentInput } from "@/lib/utils/schemas";
import { useStore } from "@/lib/store";
import { SUBSCRIPTION_PLANS } from "@/lib/utils/mockData";
import { formatCurrency } from "@/lib/utils";
import { Input, Button } from "@/components/ui";
import type { SubscriptionTier } from "@/lib/types";

export default function CheckoutPage() {
  const params    = useSearchParams();
  const router    = useRouter();
  const updateProfile = useStore((s) => s.updateProfile);
  const pushToast = useStore((s) => s.pushToast);
  const [loading, setLoading] = useState(false);

  const planId = (params.get("plan") ?? "monthly") as SubscriptionTier;
  const plan   = SUBSCRIPTION_PLANS.find((p) => p.id === planId) ?? SUBSCRIPTION_PLANS[1];

  const { register, handleSubmit, formState: { errors } } =
    useForm<PaymentInput>({ resolver: zodResolver(paymentSchema) });

  async function onSubmit(_data: PaymentInput) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    updateProfile({ subscription: planId });
    pushToast(`${plan.name} activated! Welcome to Pro. 🎉`, "success");
    router.push("/dashboard");
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8 bg-zen-violet">
      <div className="glass w-full max-w-sm p-8 rounded-3xl shadow-card-lg animate-fade-in">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 border border-gold/30">
            <CreditCard size={22} className="text-gold" />
          </div>
          <h1 className="font-display text-xl font-bold text-accent uppercase tracking-wide">Checkout</h1>
          <p className="mt-1 text-xs text-muted">
            {plan.name} — <span className="text-white font-bold">{formatCurrency(plan.price)}</span>/{plan.interval}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Cardholder Name" placeholder="Jane Smith" error={errors.cardholderName?.message} {...register("cardholderName")} />
          <Input label="Card Number" placeholder="1234 5678 9012 3456" maxLength={19} error={errors.cardNumber?.message} {...register("cardNumber")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="CVV" placeholder="123" maxLength={4} error={errors.cvv?.message} {...register("cvv")} />
            <Input label="Expiry" placeholder="MM/YY" maxLength={5} error={errors.expiry?.message} {...register("expiry")} />
          </div>
          <Button variant="violet" type="submit" className="w-full" isLoading={loading}>
            Pay {formatCurrency(plan.price)}
          </Button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1 text-[10px] text-white/25">
          <Lock size={10} /> Secured by Stripe — your data is never stored
        </p>
      </div>
    </div>
  );
}
