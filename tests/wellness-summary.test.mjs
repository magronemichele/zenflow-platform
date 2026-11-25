import assert from "node:assert/strict";
import test from "node:test";
import { summarizeDay } from "../lib/utils/wellnessSummary.ts";

test("summary counts today's entries only and uses the latest dated measurement", () => {
  const date = "2026-11-25";
  const result = summarizeDay({
    activities: [{ date, durationMin: 30 }, { date, durationMin: 15 }, { date: "2026-11-24", durationMin: 70 }],
    meals: [{ date }, { date: "2026-11-24" }],
    plans: [{ date, isCompleted: true }],
    weights: [
      { date: "2026-11-20", valueKg: 71, createdAt: "2" },
      { date, valueKg: 70, createdAt: "1" },
      { date, valueKg: 69, createdAt: "3" },
    ],
  }, date);
  assert.equal(result.activityMinutes, 45);
  assert.equal(result.mealCount, 1);
  assert.equal(result.plan.isCompleted, true);
  assert.equal(result.lastWeight.valueKg, 69);
});

test("empty records produce an empty day with no inferred metrics", () => {
  assert.deepEqual(summarizeDay({ activities: [], meals: [], plans: [], weights: [] }, "2026-11-25"), {
    activityMinutes: 0, mealCount: 0, plan: undefined, lastWeight: undefined,
  });
});
