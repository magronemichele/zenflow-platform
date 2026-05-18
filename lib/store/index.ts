/**
 * @file lib/store/index.ts
 * @description Global client-side state managed by Zustand.
 *
 * The store is sliced into logical domains:
 *  - auth      → user identity, token, login/logout
 *  - tracker   → weight / activity / meal / note entries
 *  - plan      → daily plans keyed by date
 *  - chat      → AI coach conversation history
 *  - ui        → ephemeral UI state (toasts, loading flags)
 *
 * Persistence: auth + tracker + plan + chat are persisted to localStorage
 * via the `zustand/middleware` persist adapter. UI state is intentionally
 * excluded (ephemeral by design).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  User, WeightEntry, ActivityEntry, MealEntry,
  Note, DayPlan, ChatMessage, ToastState, ToastVariant,
} from "@/lib/types";
import { generateId } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Slice interfaces
// ─────────────────────────────────────────────────────────────────────────────

interface AuthSlice {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Persist authenticated user and JWT token. */
  login: (user: User, token: string) => void;
  /** Partial update — merges into existing user object. */
  updateProfile: (partial: Partial<User>) => void;
  /** Clear all auth state and redirect handled by the caller. */
  logout: () => void;
}

interface TrackerSlice {
  weights:    WeightEntry[];
  activities: ActivityEntry[];
  meals:      MealEntry[];
  notes:      Note[];
  addWeight:    (e: WeightEntry)   => void;
  addActivity:  (e: ActivityEntry) => void;
  addMeal:      (e: MealEntry)     => void;
  addNote:      (e: Note)          => void;
  deleteNote:   (id: string)       => void;
  /** Replace an existing note by id. */
  updateNote:   (id: string, patch: Partial<Note>) => void;
}

interface PlanSlice {
  plans: DayPlan[];
  /** Upsert — replaces existing plan for that date or appends. */
  savePlan:       (plan: DayPlan) => void;
  getPlanByDate:  (date: string) => DayPlan | undefined;
  markCompleted:  (date: string) => void;
}

interface ChatSlice {
  messages: ChatMessage[];
  addMessage:  (msg: ChatMessage) => void;
  clearHistory: () => void;
}

interface UISlice {
  isLoading: boolean;
  toasts: ToastState[];
  setLoading:   (v: boolean) => void;
  pushToast:    (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

/** Combined store type — all slices merged. */
type ZenFlowStore = AuthSlice & TrackerSlice & PlanSlice & ChatSlice & UISlice;

// ─────────────────────────────────────────────────────────────────────────────
// Store factory
// ─────────────────────────────────────────────────────────────────────────────

export const useStore = create<ZenFlowStore>()(
  persist(
    (set, get) => ({
      // ── Auth ─────────────────────────────────────────────────
      user:            null,
      token:           null,
      isAuthenticated: false,

      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      updateProfile: (partial) =>
        set((s) => ({
          user: s.user ? { ...s.user, ...partial } : null,
        })),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      // ── Tracker ───────────────────────────────────────────────
      weights:    [],
      activities: [],
      meals:      [],
      notes:      [],

      addWeight:   (e) => set((s) => ({ weights:    [e, ...s.weights]    })),
      addActivity: (e) => set((s) => ({ activities: [e, ...s.activities] })),
      addMeal:     (e) => set((s) => ({ meals:      [e, ...s.meals]      })),
      addNote:     (e) => set((s) => ({ notes:      [e, ...s.notes]      })),

      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      updateNote: (id, patch) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
          ),
        })),

      // ── Plan ──────────────────────────────────────────────────
      plans: [],

      savePlan: (plan) =>
        set((s) => ({
          plans: [plan, ...s.plans.filter((p) => p.date !== plan.date)],
        })),

      getPlanByDate: (date) =>
        get().plans.find((p) => p.date === date),

      markCompleted: (date) =>
        set((s) => ({
          plans: s.plans.map((p) =>
            p.date === date ? { ...p, isCompleted: true } : p
          ),
        })),

      // ── Chat ──────────────────────────────────────────────────
      messages: [],
      addMessage:   (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      clearHistory: ()    => set({ messages: [] }),

      // ── UI ────────────────────────────────────────────────────
      isLoading: false,
      toasts:    [],

      setLoading: (v) => set({ isLoading: v }),

      pushToast: (message, variant = "info") =>
        set((s) => ({
          toasts: [...s.toasts, { id: generateId(), message, variant }],
        })),

      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),

    {
      name: "zenflow-v2",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      // Only persist meaningful state — keep UI ephemeral
      partialize: (s): Partial<ZenFlowStore> => ({
        user:            s.user,
        token:           s.token,
        isAuthenticated: s.isAuthenticated,
        weights:         s.weights,
        activities:      s.activities,
        meals:           s.meals,
        notes:           s.notes,
        plans:           s.plans,
        messages:        s.messages,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Convenience selectors (avoids inline arrow functions in components)
// ─────────────────────────────────────────────────────────────────────────────
export const selectUser            = (s: ZenFlowStore) => s.user;
export const selectIsAuthenticated = (s: ZenFlowStore) => s.isAuthenticated;
export const selectToasts          = (s: ZenFlowStore) => s.toasts;
export const selectWeights         = (s: ZenFlowStore) => s.weights;
export const selectActivities      = (s: ZenFlowStore) => s.activities;
export const selectMeals           = (s: ZenFlowStore) => s.meals;
export const selectNotes           = (s: ZenFlowStore) => s.notes;
export const selectPlans           = (s: ZenFlowStore) => s.plans;
export const selectMessages        = (s: ZenFlowStore) => s.messages;
