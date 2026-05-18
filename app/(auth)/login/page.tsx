/**
 * @file app/(auth)/login/page.tsx
 * @description Sign-in screen.
 * On success → stores user in Zustand → redirects to /dashboard.
 * Demo mode: any username (3+ chars) + password (6+ chars) signs in.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { useState } from "react";

import { loginSchema, type LoginInput } from "@/lib/utils/schemas";
import { useStore } from "@/lib/store";
import { Input, Button } from "@/components/ui";

export default function LoginPage() {
  const router    = useRouter();
  const login     = useStore((s) => s.login);
  const pushToast = useStore((s) => s.pushToast);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    // ── Replace with real API call ──────────────────────────
    await new Promise((r) => setTimeout(r, 700));
    login(
      {
        id: "user-demo", username: data.username,
        firstName: data.username, lastName: "User",
        email: "demo@zenflow.app", subscription: "free",
        createdAt: new Date().toISOString(),
      },
      "demo-jwt-token"
    );
    pushToast("Welcome back! 🌿", "success");
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <div className="glass p-8 shadow-card-lg">

        {/* Logo */}
        <div className="mb-7 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600/30 border border-teal-500/30">
            <Leaf size={28} className="text-teal-400" />
          </div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-accent">
            ZenFlow
          </h1>
          <p className="text-xs text-muted uppercase tracking-widest">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Username"
            placeholder="Enter your username…"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPw ? "text" : "password"}
              placeholder="Enter your password…"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-9 text-white/40 hover:text-white transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
