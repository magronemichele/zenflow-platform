import type { ActivityEntry, DayPlan, MealEntry, WeightEntry } from "../types";

interface Records {
  activities: ActivityEntry[];
  meals: MealEntry[];
  plans: DayPlan[];
  weights: WeightEntry[];
}

export function summarizeDay(records: Records, date: string) {
  const activityMinutes = records.activities
    .filter((entry) => entry.date === date)
    .reduce((total, entry) => total + entry.durationMin, 0);
  const mealCount = records.meals.filter((entry) => entry.date === date).length;
  const plan = records.plans.find((entry) => entry.date === date);
  const lastWeight = records.weights.reduce<WeightEntry | undefined>((latest, entry) => {
    if (!latest || entry.date > latest.date || (entry.date === latest.date && entry.createdAt > latest.createdAt)) {
      return entry;
    }
    return latest;
  }, undefined);

  return { activityMinutes, mealCount, plan, lastWeight };
}
