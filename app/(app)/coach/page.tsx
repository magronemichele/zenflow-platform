/**
 * @file app/(app)/coach/page.tsx
 * @description AI Wellness Coach chat interface.
 * Users pick a coach persona, then exchange messages.
 * In production, messages are forwarded to the /api/coach endpoint
 * which proxies to an LLM with the coach's system prompt.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import { useStore, selectMessages } from "@/lib/store";
import { COACHES } from "@/lib/utils/mockData";
import { generateId, timeAgo } from "@/lib/utils";
import { Button, Spinner } from "@/components/ui";
import type { CoachProfile } from "@/lib/utils/mockData";

const COACH_REPLIES: Record<string, string[]> = {
  "coach-franco": [
    "Great question! For your goal, I'd recommend a progressive overload approach — start at 3 sets of 8 reps, increase weight by 2.5% when you can complete all sets cleanly. 💪",
    "Rest days are just as important as training days. Your muscles grow during recovery, not during the workout itself. Schedule 48 hours of rest between strength sessions.",
    "Protein timing matters less than total daily intake. Hit 1.6-2.2g per kg of bodyweight spread across 3-4 meals and you'll maximise muscle protein synthesis.",
  ],
  "coach-anna": [
    "Start with just 5 minutes of breath awareness. Sit comfortably, close your eyes, and notice the sensation of air entering and leaving your nostrils. That's it. Simplicity is the practice. 🌿",
    "Stress is information, not an enemy. Ask: what is this feeling trying to protect me from? Listening with curiosity rather than resistance often dissolves the tension.",
    "For sleep, I recommend the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. Three cycles. Your nervous system will thank you.",
  ],
  "coach-luisa": [
    "Focus on food quality before quantity. Prioritise whole foods, adequate protein (1.6g/kg/day), fibre from plants, and healthy fats. Calories will naturally regulate. 🥗",
    "Your gut microbiome thrives on diversity. Aim for 30 different plant species per week — this includes herbs, spices, nuts and seeds, not just vegetables.",
    "Meal timing for weight management: eating within an 8-10 hour window (time-restricted eating) has shown modest benefits for metabolic health in multiple RCTs.",
  ],
};

export default function CoachPage() {
  const messages    = useStore(selectMessages);
  const addMessage  = useStore((s) => s.addMessage);
  const clearHistory = useStore((s) => s.clearHistory);
  const pushToast   = useStore((s) => s.pushToast);

  const [selectedCoach, setSelectedCoach] = useState<CoachProfile>(COACHES[0]);
  const [inputText, setInputText] = useState("");
  const [isTyping,  setIsTyping]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send initial greeting when coach changes
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id:         generateId(),
        role:       "coach",
        text:       selectedCoach.greeting,
        timestamp:  new Date().toISOString(),
        coachName:  selectedCoach.name,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage() {
    const text = inputText.trim();
    if (!text || isTyping) return;
    setInputText("");

    // User message
    addMessage({
      id: generateId(), role: "user",
      text, timestamp: new Date().toISOString(),
    });

    // Simulated coach typing + reply
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const replies = COACH_REPLIES[selectedCoach.id] ?? [];
    const reply   = replies[Math.floor(Math.random() * replies.length)] ??
      "I'm here to help! Could you share a bit more context so I can give you the best guidance?";

    addMessage({
      id: generateId(), role: "coach",
      text: reply, timestamp: new Date().toISOString(),
      coachName: selectedCoach.name,
    });
    setIsTyping(false);
  }

  function switchCoach(coach: CoachProfile) {
    setSelectedCoach(coach);
    clearHistory();
    addMessage({
      id: generateId(), role: "coach",
      text: coach.greeting,
      timestamp: new Date().toISOString(),
      coachName: coach.name,
    });
    pushToast(`Switched to ${coach.name}`, "info");
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col h-[calc(100vh-3.5rem-5rem)]">

      {/* ── Coach selector ─────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {COACHES.map((c) => (
            <button
              key={c.id}
              onClick={() => switchCoach(c)}
              className={`glass flex shrink-0 items-center gap-2.5 rounded-2xl px-3 py-2 transition-all ${
                selectedCoach.id === c.id
                  ? "border-gold/40 bg-gold/10"
                  : "hover:bg-white/8"
              }`}
            >
              <div
                className="h-9 w-9 rounded-full bg-cover bg-center border-2"
                style={{
                  backgroundImage: `url(${c.avatarUrl})`,
                  borderColor: selectedCoach.id === c.id
                    ? "var(--clr-accent)" : "rgba(255,255,255,0.15)",
                }}
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white">{c.name}</p>
                <p className="text-[10px] text-muted">{c.specialty[0]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            {/* Coach avatar */}
            {msg.role === "coach" && (
              <div
                className="mr-2 h-7 w-7 shrink-0 self-end rounded-full bg-cover bg-center border border-white/15"
                style={{ backgroundImage: `url(${selectedCoach.avatarUrl})` }}
              />
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-br-sm"
                  : "glass text-white rounded-bl-sm"
              }`}
            >
              {msg.role === "coach" && (
                <p className="text-[10px] font-bold text-gold mb-1">{msg.coachName}</p>
              )}
              <p>{msg.text}</p>
              <p className="mt-1 text-[9px] opacity-40 text-right">{timeAgo(msg.timestamp)}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="h-7 w-7 rounded-full bg-cover bg-center border border-white/15"
              style={{ backgroundImage: `url(${selectedCoach.avatarUrl})` }} />
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                {[0,1,2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/50 animate-pulse-soft"
                    style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ─────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 border-t" style={{ borderColor: "var(--clr-border)" }}>
        <div className="flex items-center gap-2">
          <button onClick={() => { clearHistory(); pushToast("Chat cleared", "info"); }}
            className="btn-icon" aria-label="Clear chat">
            <RotateCcw size={15} />
          </button>
          <input
            className="field flex-1 py-2.5"
            placeholder={`Ask ${selectedCoach.name} anything…`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            aria-label="Message input"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-3.5 py-2.5"
            aria-label="Send message"
          >
            {isTyping ? <Spinner size={15} /> : <Send size={15} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
