/**
 * @file app/(app)/layout.tsx
 * @description Authenticated app shell.
 * Renders TopBar + BottomNav around all protected pages.
 * Redirects unauthenticated users to /login.
 */

"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useStore, selectIsAuthenticated } from "@/lib/store";
import { TopBar } from "@/components/navigation/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ToastContainer } from "@/components/ui/ToastContainer";

const subscribeToBrowser = () => () => {};
const browserSnapshot = () => true;
const serverSnapshot = () => false;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore(selectIsAuthenticated);
  const router = useRouter();

  const hasMounted = useSyncExternalStore(subscribeToBrowser, browserSnapshot, serverSnapshot);

  useEffect(() => {
    if (hasMounted && !isAuthenticated) router.replace("/login");
  }, [hasMounted, isAuthenticated, router]);

  if (!hasMounted || !isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-zen-deep focus:p-3">Skip to content</a>
      <TopBar />
      <main id="main-content" tabIndex={-1} className="flex-1 pb-20 pt-14 animate-fade-in">
        {children}
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
