// app/(auth)/layout.tsx
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Sign In" };
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-zen-teal flex items-center justify-center p-4">
      {children}
    </main>
  );
}
