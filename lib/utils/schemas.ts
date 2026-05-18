/**
 * @file lib/utils/schemas.ts
 * @description Zod validation schemas used by React Hook Form throughout the app.
 *
 * Each schema is co-located with its inferred TypeScript type export so that
 * form components never need to import from two separate places.
 */

import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "Enter your first name"),
    lastName:  z.string().min(2, "Enter your last name"),
    age:       z.coerce.number().min(14, "Must be at least 14").max(120),
    weightKg:  z.coerce.number().min(20, "Enter weight in kg").max(400),
    heightCm:  z.coerce.number().min(50, "Enter height in cm").max(300),
    phone:     z.string().min(6, "Enter a valid phone number"),
    gender:    z.enum(["male", "female", "other"]),
    email:     z.string().email("Enter a valid email address"),
    password:  z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Tracker ──────────────────────────────────────────────────────────────────

export const weightSchema = z.object({
  valueKg: z.coerce.number().min(1, "Enter weight in kg"),
  date:    z.string().min(1, "Select a date"),
});

export const activitySchema = z.object({
  durationMin:  z.coerce.number().min(1, "Enter duration in minutes").max(1440),
  activityType: z.string().min(2, "Describe the activity"),
  date:         z.string().min(1, "Select a date"),
});

export const mealSchema = z.object({
  mealType:    z.enum(["breakfast", "lunch", "snack", "dinner"]),
  description: z.string().min(3, "Describe the meal"),
  calories:    z.coerce.number().optional(),
  date:        z.string().min(1, "Select a date"),
});

export const noteSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  body:  z.string().min(5, "Enter a description"),
});

// ─── Plan ─────────────────────────────────────────────────────────────────────

export const dayPlanSchema = z.object({
  breakfast:      z.string().optional(),
  lunch:          z.string().optional(),
  snack:          z.string().optional(),
  dinner:         z.string().optional(),
  activity:       z.string().optional(),
  morningRoutine: z.string().optional(),
  eveningRoutine: z.string().optional(),
  notes:          z.string().optional(),
});

// ─── Payment ──────────────────────────────────────────────────────────────────

export const paymentSchema = z.object({
  cardholderName: z.string().min(3, "Enter the cardholder name"),
  cardNumber: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Enter a valid card number"),
  cvv:    z.string().regex(/^\d{3,4}$/, "Enter a valid CVV"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY"),
});

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileSchema = z
  .object({
    firstName: z.string().min(2),
    lastName:  z.string().min(2),
    phone:     z.string().optional(),
    email:     z.string().email(),
    password:         z.string().min(8).optional().or(z.literal("")),
    confirmPassword:  z.string().optional().or(z.literal("")),
  })
  .refine((d) => !d.password || d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Inferred types ───────────────────────────────────────────────────────────

export type LoginInput    = z.infer<typeof loginSchema>;
export type SignupInput   = z.infer<typeof signupSchema>;
export type WeightInput   = z.infer<typeof weightSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
export type MealInput     = z.infer<typeof mealSchema>;
export type NoteInput     = z.infer<typeof noteSchema>;
export type DayPlanInput  = z.infer<typeof dayPlanSchema>;
export type PaymentInput  = z.infer<typeof paymentSchema>;
export type ProfileInput  = z.infer<typeof profileSchema>;
