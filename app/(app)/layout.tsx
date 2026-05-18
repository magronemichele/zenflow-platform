/**
 * @file app/(app)/layout.tsx
 * @description Authenticated app shell.
 * Renders TopBar + BottomNav around all protected pages.
 * Redirects unauthenticated users to /login.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, selectIsAuthenticated } from "@/lib/store";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ToastContainer } from "@/components/ui/ToastContainer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1 pb-20 pt-14 animate-fade-in">
        {children}
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
