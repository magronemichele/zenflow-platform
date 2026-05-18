/**
 * @file lib/types/index.ts
 * @description Central type definitions for the ZenFlow platform.
 *
 * All domain models, API contracts, and UI state shapes are defined here.
 * Import from "@/lib/types" throughout the codebase — never re-declare inline.
 */

// ─────────────────────────────────────────────────────────────────────────────
// AUTH & USER
// ─────────────────────────────────────────────────────────────────────────────

/** Subscription tier the user is currently on. */
export type SubscriptionTier = "free" | "monthly" | "annual";

/**
 * Core user profile stored in Zustand and synced to the DB.
 * All optional biometric fields are set during onboarding.
 */
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  /** Age in years */
  age?: number;
  /** Body weight in kilograms */
  weightKg?: number;
  /** Height in centimetres */
  heightCm?: number;
  gender?: "male" | "female" | "other";
  /** Relative URL or external CDN path to user avatar */
  avatarUrl?: string;
  subscription: SubscriptionTier;
  createdAt: string; // ISO-8601
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  age: number;
  weightKg: number;
  heightCm: number;
  phone: string;
  gender: "male" | "female" | "other";
  email: string;
  password: string;
  confirmPassword: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT — ARTICLES / TIPS
// ─────────────────────────────────────────────────────────────────────────────

export type ContentCategory =
  | "nutrition"
  | "movement"
  | "meditation"
  | "sleep"
  | "mindfulness"
  | "recipes"
  | "mental-health";

export type ContentDifficulty = "beginner" | "intermediate" | "advanced";

/**
 * A single wellness article / tip card.
 * `isPremium` articles are blurred for free-tier users.
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: ContentCategory;
  /** Unsplash / CDN URL */
  coverUrl: string;
  author: Author;
  publishedAt: string; // ISO-8601
  /** Estimated reading time in minutes */
  readingTime: number;
  tags: string[];
  difficulty: ContentDifficulty;
  isPremium: boolean;
  /** Engagement stats (populated server-side) */
  stats: { views: number; likes: number; saves: number };
}

export interface Author {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACKING ENTRIES
// ─────────────────────────────────────────────────────────────────────────────

/** Single body-weight measurement. */
export interface WeightEntry {
  id: string;
  userId: string;
  valueKg: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

/** Single workout / physical-activity session. */
export interface ActivityEntry {
  id: string;
  userId: string;
  /** Activity duration in minutes */
  durationMin: number;
  /** Activity type label (e.g. "Running", "Yoga") */
  activityType: string;
  date: string;
  createdAt: string;
}

export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

/** Single meal log entry. */
export interface MealEntry {
  id: string;
  userId: string;
  mealType: MealType;
  description: string;
  /** Approximate calories, optional */
  calories?: number;
  date: string;
  createdAt: string;
}

/** Free-text personal note. */
export interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY PLAN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Structured plan for a single calendar day.
 * Users can fill in each slot; completed days are marked green in the calendar.
 */
export interface DayPlan {
  date: string; // YYYY-MM-DD
  userId: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  activity: string;
  morningRoutine?: string;
  eveningRoutine?: string;
  isCompleted: boolean;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI COACH CHAT
// ─────────────────────────────────────────────────────────────────────────────

/** A single message in the coach chat thread. */
export interface ChatMessage {
  id: string;
  role: "user" | "coach";
  text: string;
  timestamp: string; // ISO-8601
  coachName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION / PAYMENT
// ─────────────────────────────────────────────────────────────────────────────

export type BillingInterval = "trial" | "month" | "year";

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number; // EUR
  interval: BillingInterval;
  features: string[];
  /** Renders a highlight ring around the card */
  isPopular?: boolean;
}

export interface PaymentPayload {
  cardholderName: string;
  cardNumber: string;
  cvv: string;
  expiry: string; // MM/YY
  plan: SubscriptionTier;
}

// ─────────────────────────────────────────────────────────────────────────────
// API CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: { page: number; total: number; perPage: number };
}

export interface ApiError {
  error: string;
  statusCode: number;
  details?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI STATE
// ─────────────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastState {
  id: string;
  message: string;
  variant: ToastVariant;
}
