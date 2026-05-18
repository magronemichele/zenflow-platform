/**
 * @file app/(app)/tracker/page.tsx
 * @description Unified tracking hub.
 * Tabs: Weight | Activity | Meals | Notes
 * Each tab shows an entry form + logged history for the current user.
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scale, Dumbbell, Utensils, BookOpen, Trash2, Plus } from "lucide-react";
import {
  weightSchema, activitySchema, mealSchema, noteSchema,
  type WeightInput, type ActivityInput, type MealInput, type NoteInput,
} from "@/lib/utils/schemas";
import { useStore, selectUser, selectWeights, selectActivities, selectMeals, selectNotes } from "@/lib/store";
import { generateId, formatDate, todayISO } from "@/lib/utils";
import { Input, Select, Textarea, Button } from "@/components/ui";

type Tab = "weight" | "activity" | "meals" | "notes";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "weight",   label: "Weight",   Icon: Scale },
  { id: "activity", label: "Activity", Icon: Dumbbell },
  { id: "meals",    label: "Meals",    Icon: Utensils },
  { id: "notes",    label: "Notes",    Icon: BookOpen },
];

export default function TrackerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("weight");

  return (
    <div className="mx-auto max-w-xl py-4 px-4">
      <h1 className="font-display text-xl font-bold text-accent mb-1">Tracker</h1>
      <p className="text-sm text-muted mb-5">Log your daily data and monitor your progress.</p>

      {/* Tab strip */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 ${activeTab === id ? "pill-tab pill-tab-active" : "pill-tab pill-tab-inactive"}`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeTab === "weight"   && <WeightTab />}
      {activeTab === "activity" && <ActivityTab />}
      {activeTab === "meals"    && <MealsTab />}
      {activeTab === "notes"    && <NotesTab />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Weight Tab
// ─────────────────────────────────────────────────────────────────────────────

function WeightTab() {
  const user      = useStore(selectUser);
  const weights   = useStore(selectWeights);
  const addWeight = useStore((s) => s.addWeight);
  const pushToast = useStore((s) => s.pushToast);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<WeightInput>({ resolver: zodResolver(weightSchema), defaultValues: { date: todayISO() } });

  async function onSubmit(data: WeightInput) {
    await new Promise((r) => setTimeout(r, 400));
    addWeight({ id: generateId(), userId: user?.id ?? "", valueKg: data.valueKg, date: data.date, createdAt: new Date().toISOString() });
    pushToast(`Weight logged: ${data.valueKg} kg`, "success");
    reset({ date: todayISO() });
  }

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-3xl">
        <h2 className="section-title mb-4">Log Weight</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <Input label="Weight (kg)" type="number" step="0.1" placeholder="e.g. 72.5" error={errors.valueKg?.message} {...register("valueKg")} />
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Button type="submit" className="w-full" isLoading={isSubmitting} leftIcon={<Plus size={14} />}>Log Entry</Button>
        </form>
      </div>

      {weights.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h2 className="section-title mb-3">History</h2>
          <ul className="space-y-2">
            {weights.slice(0, 10).map((e) => (
              <li key={e.id} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "var(--clr-border)" }}>
                <span className="text-xs text-muted">{formatDate(e.date)}</span>
                <span className="text-sm font-bold text-white">{e.valueKg} kg</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity Tab
// ─────────────────────────────────────────────────────────────────────────────

function ActivityTab() {
  const user        = useStore(selectUser);
  const activities  = useStore(selectActivities);
  const addActivity = useStore((s) => s.addActivity);
  const pushToast   = useStore((s) => s.pushToast);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ActivityInput>({ resolver: zodResolver(activitySchema), defaultValues: { date: todayISO() } });

  async function onSubmit(data: ActivityInput) {
    await new Promise((r) => setTimeout(r, 400));
    addActivity({ id: generateId(), userId: user?.id ?? "", durationMin: data.durationMin, activityType: data.activityType, date: data.date, createdAt: new Date().toISOString() });
    pushToast("Activity logged!", "success");
    reset({ date: todayISO() });
  }

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-3xl">
        <h2 className="section-title mb-4">Log Activity</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <Input label="Activity Type" placeholder="e.g. Running, Yoga, Swimming" error={errors.activityType?.message} {...register("activityType")} />
          <Input label="Duration (minutes)" type="number" placeholder="e.g. 45" error={errors.durationMin?.message} {...register("durationMin")} />
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Button type="submit" className="w-full" isLoading={isSubmitting} leftIcon={<Plus size={14} />}>Log Activity</Button>
        </form>
      </div>

      {activities.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h2 className="section-title mb-3">History</h2>
          <ul className="space-y-2">
            {activities.slice(0, 8).map((e) => (
              <li key={e.id} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "var(--clr-border)" }}>
                <div>
                  <p className="text-sm font-semibold text-white">{e.activityType}</p>
                  <p className="text-[10px] text-muted">{formatDate(e.date)}</p>
                </div>
                <span className="badge badge-teal">{e.durationMin} min</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Meals Tab
// ─────────────────────────────────────────────────────────────────────────────

function MealsTab() {
  const user      = useStore(selectUser);
  const meals     = useStore(selectMeals);
  const addMeal   = useStore((s) => s.addMeal);
  const pushToast = useStore((s) => s.pushToast);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<MealInput>({ resolver: zodResolver(mealSchema), defaultValues: { date: todayISO() } });

  async function onSubmit(data: MealInput) {
    await new Promise((r) => setTimeout(r, 400));
    addMeal({ id: generateId(), userId: user?.id ?? "", mealType: data.mealType, description: data.description, calories: data.calories, date: data.date, createdAt: new Date().toISOString() });
    pushToast("Meal logged!", "success");
    reset({ date: todayISO() });
  }

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-3xl">
        <h2 className="section-title mb-4">Log Meal</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <Select label="Meal Type" placeholder="Select meal type…" error={errors.mealType?.message}
            options={[ {value:"breakfast",label:"Breakfast"}, {value:"lunch",label:"Lunch"}, {value:"snack",label:"Snack"}, {value:"dinner",label:"Dinner"} ]}
            defaultValue="" {...register("mealType")} />
          <Textarea label="What did you eat?" placeholder="e.g. Oats with berries, 2 eggs, black coffee" error={errors.description?.message} {...register("description")} />
          <Input label="Calories (optional)" type="number" placeholder="e.g. 450" error={errors.calories?.message} {...register("calories")} />
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <Button type="submit" className="w-full" isLoading={isSubmitting} leftIcon={<Plus size={14} />}>Log Meal</Button>
        </form>
      </div>

      {meals.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h2 className="section-title mb-3">Today&apos;s Log</h2>
          <ul className="space-y-2">
            {meals.slice(0, 8).map((e) => (
              <li key={e.id} className="py-2 border-b last:border-0" style={{ borderColor: "var(--clr-border)" }}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="badge badge-gold capitalize">{e.mealType}</span>
                  {e.calories && <span className="text-[10px] text-muted">{e.calories} kcal</span>}
                </div>
                <p className="text-xs text-white/75 mt-1">{e.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Notes Tab
// ─────────────────────────────────────────────────────────────────────────────

function NotesTab() {
  const user       = useStore(selectUser);
  const notes      = useStore(selectNotes);
  const addNote    = useStore((s) => s.addNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const pushToast  = useStore((s) => s.pushToast);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<NoteInput>({ resolver: zodResolver(noteSchema) });

  async function onSubmit(data: NoteInput) {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString();
    addNote({ id: generateId(), userId: user?.id ?? "", title: data.title, body: data.body, createdAt: now, updatedAt: now });
    pushToast("Note saved!", "success");
    reset();
  }

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-3xl">
        <h2 className="section-title mb-4">Add Note</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <Input label="Title" placeholder="e.g. Post-workout reflection" error={errors.title?.message} {...register("title")} />
          <Textarea label="Body" placeholder="Write anything — feelings, goals, observations…" error={errors.body?.message} {...register("body")} />
          <Button type="submit" className="w-full" isLoading={isSubmitting} leftIcon={<Plus size={14} />}>Save Note</Button>
        </form>
      </div>

      {notes.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h2 className="section-title mb-3">My Notes</h2>
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="py-2 border-b last:border-0" style={{ borderColor: "var(--clr-border)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-faint mt-1">{formatDate(n.createdAt, { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}</p>
                  </div>
                  <button onClick={() => { deleteNote(n.id); pushToast("Note deleted", "info"); }}
                    className="btn-icon shrink-0" aria-label="Delete note">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
