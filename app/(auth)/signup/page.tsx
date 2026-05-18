/**
 * @file app/(auth)/signup/page.tsx
 * @description Account creation screen.
 * Collects biometric data used to personalise the daily plan and coach advice.
 * On success → creates user → redirects to /membership for plan selection.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { signupSchema, type SignupInput } from "@/lib/utils/schemas";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";
import { Input, Select, Button } from "@/components/ui";

export default function SignupPage() {
  const router    = useRouter();
  const login     = useStore((s) => s.login);
  const pushToast = useStore((s) => s.pushToast);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupInput) {
    await new Promise((r) => setTimeout(r, 800));
    login(
      {
        id:           generateId(),
        username:     data.email.split("@")[0],
        firstName:    data.firstName,
        lastName:     data.lastName,
        email:        data.email,
        age:          data.age,
        weightKg:     data.weightKg,
        heightCm:     data.heightCm,
        phone:        data.phone,
        gender:       data.gender,
        subscription: "free",
        createdAt:    new Date().toISOString(),
      },
      generateId()
    );
    pushToast("Account created! Choose your plan. 🎉", "success");
    router.push("/membership");
  }

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <div className="glass p-8 shadow-card-lg">
        <div className="mb-6 text-center">
          <h1 className="font-display text-xl font-bold uppercase tracking-widest text-accent">
            Create Account
          </h1>
          <p className="mt-1 text-xs text-muted">Join ZenFlow — your wellness journey starts here</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" placeholder="Jane"  error={errors.firstName?.message} {...register("firstName")} />
            <Input label="Last Name"  placeholder="Smith" error={errors.lastName?.message}  {...register("lastName")} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input label="Age"    type="number" placeholder="28"  error={errors.age?.message}     {...register("age")} />
            <Input label="Wt (kg)" type="number" placeholder="70" error={errors.weightKg?.message} {...register("weightKg")} />
            <Input label="Ht (cm)" type="number" placeholder="175" error={errors.heightCm?.message} {...register("heightCm")} />
          </div>

          <Input label="Phone" type="tel" placeholder="+44 7700 000000" error={errors.phone?.message} {...register("phone")} />

          <Select
            label="Gender"
            placeholder="Select gender…"
            error={errors.gender?.message}
            options={[
              { value: "male",   label: "Male" },
              { value: "female", label: "Female" },
              { value: "other",  label: "Other" },
            ]}
            defaultValue=""
            {...register("gender")}
          />

          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />

          <div className="relative">
            <Input label="Password" type={showPw ? "text" : "password"} placeholder="8+ characters"
              error={errors.password?.message} {...register("password")} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-9 text-white/40 hover:text-white transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Input label="Confirm Password" type="password" placeholder="Repeat password"
            error={errors.confirmPassword?.message} {...register("confirmPassword")} />

          <Button type="submit" className="w-full mt-1" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
