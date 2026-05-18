/**
 * @file components/ui/ToastContainer.tsx
 * @description Global toast notification renderer.
 * Consumes the `toasts` array from Zustand and auto-dismisses after 3.5s.
 * Rendered once in app/(app)/layout.tsx — never instantiate elsewhere.
 */

"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, selectToasts } from "@/lib/store";
import type { ToastVariant } from "@/lib/types";

// ── Variant config ──────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<
  ToastVariant,
  { Icon: React.ElementType; bg: string; border: string }
> = {
  success: { Icon: CheckCircle, bg: "bg-teal-700/90",   border: "border-teal-400" },
  error:   { Icon: XCircle,     bg: "bg-red-800/90",    border: "border-red-400" },
  warning: { Icon: AlertCircle, bg: "bg-amber-700/90",  border: "border-amber-400" },
  info:    { Icon: Info,        bg: "bg-violet-700/90", border: "border-violet-400" },
};

// ── Single Toast ─────────────────────────────────────────────────────────────

function Toast({ id, message, variant }: { id: string; message: string; variant: ToastVariant }) {
  const dismiss = useStore((s) => s.dismissToast);
  const { Icon, bg, border } = TOAST_CONFIG[variant];

  // Auto-dismiss after 3.5s
  useEffect(() => {
    const t = setTimeout(() => dismiss(id), 3500);
    return () => clearTimeout(t);
  }, [id, dismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-card",
        "text-sm font-semibold text-white backdrop-blur-md animate-slide-up",
        "min-w-[260px] max-w-xs",
        bg, border
      )}
    >
      <Icon size={18} className="shrink-0" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      <button
        onClick={() => dismiss(id)}
        aria-label="Dismiss notification"
        className="text-white/50 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Container ────────────────────────────────────────────────────────────────

export function ToastContainer() {
  const toasts = useStore(selectToasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
}
