/**
 * @file app/(app)/plan/page.tsx
 * @description Daily wellness plan calendar.
 * Users can log meals, activities and routines for each day.
 * Completed days show a green indicator in the calendar.
 */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { dayPlanSchema, type DayPlanInput } from "@/lib/utils/schemas";
import { useStore, selectUser, selectPlans } from "@/lib/store";
import { todayISO, formatDate } from "@/lib/utils";
import { Input, Textarea, Button } from "@/components/ui";

export default function PlanPage() {
  const user        = useStore(selectUser);
  const plans       = useStore(selectPlans);
  const savePlan    = useStore((s) => s.savePlan);
  const markCompleted = useStore((s) => s.markCompleted);
  const pushToast   = useStore((s) => s.pushToast);

  const [month,    setMonth]    = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const days       = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const selectedKey = format(selected, "yyyy-MM-dd");
  const existingPlan = plans.find((p) => p.date === selectedKey);

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<DayPlanInput>({
      resolver: zodResolver(dayPlanSchema),
      values: existingPlan
        ? { breakfast: existingPlan.breakfast, lunch: existingPlan.lunch,
            snack: existingPlan.snack, dinner: existingPlan.dinner,
            activity: existingPlan.activity, morningRoutine: existingPlan.morningRoutine,
            eveningRoutine: existingPlan.eveningRoutine, notes: existingPlan.notes }
        : {},
    });

  async function onSubmit(data: DayPlanInput) {
    await new Promise((r) => setTimeout(r, 400));
    savePlan({ date: selectedKey, userId: user?.id ?? "", breakfast: data.breakfast ?? "", lunch: data.lunch ?? "", snack: data.snack ?? "", dinner: data.dinner ?? "", activity: data.activity ?? "", morningRoutine: data.morningRoutine, eveningRoutine: data.eveningRoutine, notes: data.notes, isCompleted: false });
    pushToast("Plan saved!", "success");
  }

  const hasPlan = (d: Date) => plans.some((p) => p.date === format(d, "yyyy-MM-dd"));
  const isComplete = (d: Date) => plans.find((p) => p.date === format(d, "yyyy-MM-dd"))?.isCompleted;

  return (
    <div className="mx-auto max-w-xl px-4 py-4 space-y-4">
      <h1 className="font-display text-xl font-bold text-accent">Daily Plan</h1>

      {/* Calendar */}
      <div className="glass rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))} className="btn-icon"><ChevronLeft size={16} /></button>
          <span className="font-semibold text-sm">{format(month, "MMMM yyyy")}</span>
          <button onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))} className="btn-icon"><ChevronRight size={16} /></button>
        </div>

        <div className="grid grid-cols-7 mb-1 text-center">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <span key={i} className="text-[10px] font-bold text-muted">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: (days[0].getDay() + 6) % 7 }).map((_, i) => <div key={`e${i}`} />)}
          {days.map((day) => {
            const isSelected  = isSameDay(day, selected);
            const hasP        = hasPlan(day);
            const isComp      = isComplete(day);
            const isToday     = format(day, "yyyy-MM-dd") === todayISO();
            return (
              <button key={day.toISOString()} onClick={() => setSelected(day)}
                className={`relative aspect-square w-full rounded-xl text-xs font-semibold transition-all ${isSelected ? "bg-gold text-teal-900" : isToday ? "bg-teal-700/50 text-white" : "text-muted hover:bg-white/8 hover:text-white"}`}>
                {format(day, "d")}
                {hasP && !isSelected && (
                  <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isComp ? "bg-teal-400" : "bg-gold/60"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan form */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">{formatDate(selectedKey)}</h2>
            {existingPlan?.isCompleted && (
              <span className="flex items-center gap-1 text-[10px] text-teal-400 mt-0.5"><CheckCircle2 size={11} /> Completed</span>
            )}
          </div>
          {existingPlan && !existingPlan.isCompleted && (
            <Button variant="ghost" className="text-xs px-3 py-1.5" onClick={() => { markCompleted(selectedKey); pushToast("Day marked complete! 🎉", "success"); }}>
              Mark Done
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Breakfast"  placeholder="e.g. Oats & berries"  {...register("breakfast")} />
            <Input label="Lunch"      placeholder="e.g. Chicken salad"   {...register("lunch")} />
            <Input label="Snack"      placeholder="e.g. Almonds"         {...register("snack")} />
            <Input label="Dinner"     placeholder="e.g. Salmon & veg"    {...register("dinner")} />
          </div>
          <Input label="Activity" placeholder="e.g. 45 min run, yoga" {...register("activity")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Morning Routine" placeholder="e.g. Meditate 10m" {...register("morningRoutine")} />
            <Input label="Evening Routine" placeholder="e.g. Journal"      {...register("eveningRoutine")} />
          </div>
          <Textarea label="Notes" placeholder="Any reflections for today…" {...register("notes")} />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>Save Plan</Button>
        </form>
      </div>
    </div>
  );
}
