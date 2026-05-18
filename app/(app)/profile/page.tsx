/**
 * @file app/(app)/profile/page.tsx
 * @description User profile management — edit personal details, change password, manage subscription.
 */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { LogOut, Crown } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/utils/schemas";
import { useStore, selectUser } from "@/lib/store";
import { Input, Button } from "@/components/ui";
import Link from "next/link";

export default function ProfilePage() {
  const user        = useStore(selectUser);
  const updateProfile = useStore((s) => s.updateProfile);
  const logout      = useStore((s) => s.logout);
  const pushToast   = useStore((s) => s.pushToast);
  const router      = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ProfileInput>({
      resolver: zodResolver(profileSchema),
      defaultValues: { firstName: user?.firstName, lastName: user?.lastName, email: user?.email, phone: user?.phone },
    });

  function onSubmit(data: ProfileInput) {
    updateProfile({ firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone });
    pushToast("Profile updated!", "success");
  }

  function handleLogout() { logout(); router.replace("/login"); }

  return (
    <div className="mx-auto max-w-xl px-4 py-4 space-y-4">
      <h1 className="font-display text-xl font-bold text-accent">My Profile</h1>

      {/* Avatar card */}
      <div className="glass rounded-3xl p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-teal-600 flex items-center justify-center font-display text-xl font-bold text-white">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <p className="font-bold text-white text-base">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-muted">{user?.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="badge badge-teal capitalize">{user?.subscription} plan</span>
            {user?.subscription === "free" && (
              <Link href="/membership" className="text-[10px] text-gold hover:underline font-bold flex items-center gap-1">
                <Crown size={10} /> Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass rounded-3xl p-5">
        <h2 className="section-title mb-4">Personal Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" error={errors.firstName?.message} {...register("firstName")} />
            <Input label="Last Name"  error={errors.lastName?.message}  {...register("lastName")} />
          </div>
          <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="New Password (optional)" type="password" placeholder="Leave blank to keep current" error={errors.password?.message} {...register("password")} />
          <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>Save Changes</Button>
        </form>
      </div>

      <Button variant="ghost" className="w-full border-red-400/30 text-red-400 hover:bg-red-900/20" onClick={handleLogout} leftIcon={<LogOut size={15} />}>
        Sign Out
      </Button>
    </div>
  );
}
