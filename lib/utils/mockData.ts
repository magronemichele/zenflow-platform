/**
 * @file lib/utils/mockData.ts
 * @description Rich static mock data used in development and as UI placeholders.
 *
 * In production these datasets are replaced by API responses from the backend.
 * All content strings are in English per product requirements.
 *
 * Data inventory:
 *  - ARTICLES       → 12 wellness articles across all categories
 *  - AUTHORS        → 4 expert author profiles
 *  - PLANS          → 3 subscription tiers
 *  - HERO_SLIDES    → 4 hero banner carousel slides
 *  - COACH_PROFILES → 3 AI coach personas
 *  - QUICK_TIPS     → 6 short tips for the dashboard widget
 */

import type { Article, Author, SubscriptionPlan } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Authors
// ─────────────────────────────────────────────────────────────────────────────

export const AUTHORS: Record<string, Author> = {
  marco: {
    id: "author-marco",
    name: "Marco Ferretti",
    title: "Certified Nutritionist & Head Chef",
    avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80",
  },
  luisa: {
    id: "author-luisa",
    name: "Dr. Luisa Bianchi",
    title: "Sports Medicine Physician",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80",
  },
  franco: {
    id: "author-franco",
    name: "Coach Franco Ricci",
    title: "Personal Trainer & Wellness Coach",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
  },
  anna: {
    id: "author-anna",
    name: "Anna Martini",
    title: "Mindfulness & Meditation Teacher",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Articles
// ─────────────────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [
  {
    id: "art-001",
    slug: "5-morning-rituals-to-boost-energy",
    title: "5 Morning Rituals That Will Transform Your Energy Levels",
    summary: "Science-backed morning habits that elite athletes and high performers swear by.",
    body: "Your morning sets the metabolic and psychological tone for everything that follows. The first ritual is hydration: consume 500ml of room-temperature water immediately upon waking to rehydrate cells after 7-8 hours of fasting and flush cortisol by-products. Next, 10 minutes of light mobility work — gentle spinal rotations, hip circles and shoulder rolls — awakens the musculoskeletal system without triggering a stress response. The third pillar is a protein-rich breakfast: eggs, Greek yoghurt or a whey smoothie stabilise blood glucose and sustain mental clarity for 4+ hours. Introduce 5 minutes of box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) to down-regulate the nervous system before the day's demands arrive. Finally, define your top 3 priorities in writing — this single habit is correlated with a 27% improvement in day-end satisfaction scores according to productivity research.",
    category: "mindfulness",
    coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    author: AUTHORS.anna,
    publishedAt: "2024-12-10",
    readingTime: 5,
    tags: ["morning", "energy", "routine", "habits"],
    difficulty: "beginner",
    isPremium: false,
    stats: { views: 12400, likes: 892, saves: 341 },
  },
  {
    id: "art-002",
    slug: "hiit-fat-burn-20-minutes",
    title: "HIIT Protocol: Maximum Fat Burn in 20 Minutes",
    summary: "The science-optimised interval training protocol used by professional athletes.",
    body: "High-Intensity Interval Training (HIIT) exploits the EPOC (Excess Post-Exercise Oxygen Consumption) effect — your metabolism remains elevated for up to 24 hours after a session. The protocol: 5-minute dynamic warm-up, then 6 rounds of 40 seconds work at 90% max heart rate alternated with 20 seconds of active rest (slow march). Choose 3 compound movements per round: burpees + mountain climbers + squat jumps is the canonical combination for maximal caloric expenditure. Finish with a 5-minute cool-down and 500ml water. Frequency: 3 sessions per week non-consecutive. Never train HIIT on back-to-back days — the recovery window is essential for muscle repair and hormonal balance. Progressive overload: increase work intervals by 5 seconds every 2 weeks.",
    category: "movement",
    coverUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    author: AUTHORS.franco,
    publishedAt: "2024-12-08",
    readingTime: 6,
    tags: ["hiit", "training", "fat-loss", "cardio"],
    difficulty: "intermediate",
    isPremium: true,
    stats: { views: 18900, likes: 1203, saves: 567 },
  },
  {
    id: "art-003",
    slug: "green-detox-smoothie-guide",
    title: "The Complete Green Smoothie Guide: Nutrients, Ratios & Recipes",
    summary: "Everything you need to build the perfect detoxifying green smoothie for any goal.",
    body: "A properly constructed green smoothie delivers chlorophyll, magnesium, vitamin K, folate and fibre in a single glass. The 40-40-20 ratio is your starting framework: 40% leafy greens (spinach, kale, Swiss chard), 40% fruit (banana, mango, apple) and 20% liquid (coconut water, almond milk, filtered water). Add a tablespoon of chia seeds for omega-3s and sustained satiety. Blend in this order: liquid first, then greens, then fruit and seeds — this sequence prevents air pockets and ensures a smoother texture. Consume within 15 minutes of preparation to preserve polyphenol activity. For a post-workout variant, add 25g vanilla whey protein and replace banana with frozen açaí for an anti-inflammatory boost.",
    category: "nutrition",
    coverUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800",
    author: AUTHORS.marco,
    publishedAt: "2024-12-05",
    readingTime: 4,
    tags: ["smoothie", "detox", "nutrition", "recipe"],
    difficulty: "beginner",
    isPremium: false,
    stats: { views: 9100, likes: 703, saves: 289 },
  },
  {
    id: "art-004",
    slug: "sleep-architecture-optimization",
    title: "Sleep Architecture: The Science of Optimal Recovery",
    summary: "How to engineer your sleep environment for maximum hormonal repair and cognitive restoration.",
    body: "Sleep is the single highest-leverage recovery intervention available to any human. During slow-wave sleep (N3), growth hormone is released in pulsatile bursts — this window is when muscle protein synthesis peaks and the glymphatic system clears metabolic waste from the brain. To optimise sleep architecture: maintain a fixed wake time (non-negotiable), eliminate blue-light exposure 90 minutes before bed, set bedroom temperature to 17-19°C, and consider 200mg magnesium glycinate before sleep. The 4-7-8 breathing technique (inhale 4s, hold 7s, exhale 8s) activates the parasympathetic nervous system within 4 cycles. Avoid alcohol within 3 hours of sleep — it suppresses REM and fragments sleep architecture even in small quantities.",
    category: "sleep",
    coverUrl: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=800",
    author: AUTHORS.luisa,
    publishedAt: "2024-12-03",
    readingTime: 7,
    tags: ["sleep", "recovery", "hormones", "neuroscience"],
    difficulty: "intermediate",
    isPremium: true,
    stats: { views: 22300, likes: 1847, saves: 934 },
  },
  {
    id: "art-005",
    slug: "mediterranean-bowl-recipe",
    title: "Power Mediterranean Bowl: 600 Kcal, 42g Protein",
    summary: "A restaurant-quality meal prep bowl ready in under 20 minutes.",
    body: "The Mediterranean diet consistently ranks as the world's most evidence-based dietary pattern for cardiovascular health and longevity. This bowl delivers a complete macro profile in a single container. Base: 80g dry quinoa (cook in vegetable broth for flavour), yields 220g cooked. Protein layer: 150g grilled chicken breast seasoned with za'atar, lemon zest and garlic. Vegetables: roasted red peppers, cucumber ribbons, halved cherry tomatoes, kalamata olives. Sauce: 2 tbsp hummus thinned with lemon juice. Finish: crumbled feta (30g), fresh parsley, extra virgin olive oil drizzle. Meal-prep tip: prepare all components Sunday evening; store the sauce separately to prevent sogginess. Shelf life: 4 days refrigerated.",
    category: "recipes",
    coverUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    author: AUTHORS.marco,
    publishedAt: "2024-11-30",
    readingTime: 4,
    tags: ["recipe", "meal-prep", "protein", "mediterranean"],
    difficulty: "beginner",
    isPremium: false,
    stats: { views: 14200, likes: 1102, saves: 812 },
  },
  {
    id: "art-006",
    slug: "box-breathing-stress-protocol",
    title: "Box Breathing: The Navy SEAL Stress Control Protocol",
    summary: "How tactical breathing techniques can reset your nervous system in under 4 minutes.",
    body: "Box breathing (Tactical Breathing or 4-4-4-4) was developed by the US Navy SEALs to maintain cognitive clarity under extreme stress. The mechanism: equal-duration breathing phases activate the vagus nerve, shifting the autonomic nervous system from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest) dominance. Technique: inhale through the nose for 4 counts, hold the breath in for 4, exhale through the mouth for 4, hold empty for 4. Repeat 4 cycles minimum. In clinical trials, 5 minutes of box breathing reduced salivary cortisol by 31% and improved sustained attention scores by 18%. Applications: pre-meeting anxiety, post-conflict decompression, pre-sleep wind-down, athletic pre-performance.",
    category: "mindfulness",
    coverUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    author: AUTHORS.anna,
    publishedAt: "2024-11-28",
    readingTime: 5,
    tags: ["breathing", "stress", "mindfulness", "protocol"],
    difficulty: "beginner",
    isPremium: false,
    stats: { views: 8700, likes: 612, saves: 278 },
  },
  {
    id: "art-007",
    slug: "strength-training-hypertrophy-fundamentals",
    title: "Hypertrophy Training: The Evidence-Based Fundamentals",
    summary: "Build lean muscle with the methods that exercise science actually validates.",
    body: "Muscle hypertrophy requires three simultaneous stimuli: mechanical tension, metabolic stress and muscle damage. The rep range myth has largely been debunked — studies show equivalent hypertrophy from 5-rep and 30-rep sets, provided effort approaches failure. What matters: total weekly volume (10-20 sets per muscle group), progressive overload (add reps or load each session), and proximity to failure (leave 1-2 reps in reserve). Optimal frequency: train each muscle group 2x per week. The anabolic window is longer than previously thought — total daily protein intake (1.6-2.2g/kg bodyweight) matters more than timing. Sleep 7-9 hours: growth hormone is released almost entirely during deep sleep. Track your lifts — if you can't measure it, you can't progress it.",
    category: "movement",
    coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    author: AUTHORS.franco,
    publishedAt: "2024-11-25",
    readingTime: 8,
    tags: ["strength", "muscle", "hypertrophy", "science"],
    difficulty: "advanced",
    isPremium: true,
    stats: { views: 31500, likes: 2401, saves: 1238 },
  },
  {
    id: "art-008",
    slug: "gut-microbiome-wellness-guide",
    title: "Your Gut: The Second Brain Driving Your Wellbeing",
    summary: "The emerging science of the gut-brain axis and how to optimise your microbiome.",
    body: "The gut microbiome — 38 trillion microorganisms in your intestinal tract — produces 90% of the body's serotonin and communicates bidirectionally with the brain via the vagus nerve. Dysbiosis (microbial imbalance) is now linked to depression, anxiety, obesity and autoimmune conditions. To cultivate a diverse microbiome: consume 30+ different plant species per week (variety is the key metric), include fermented foods daily (kefir, kimchi, sauerkraut, live yoghurt), limit ultra-processed foods which deplete Akkermansia muciniphila, and consider a broad-spectrum prebiotic. Antibiotics cause significant dysbiosis — always follow a course with 4+ weeks of probiotic supplementation. Stress reduces microbiome diversity via the cortisol-gut axis, making stress management a direct gut health intervention.",
    category: "nutrition",
    coverUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    author: AUTHORS.luisa,
    publishedAt: "2024-11-22",
    readingTime: 9,
    tags: ["gut", "microbiome", "digestion", "mental-health"],
    difficulty: "intermediate",
    isPremium: true,
    stats: { views: 19800, likes: 1543, saves: 892 },
  },
  {
    id: "art-009",
    slug: "yoga-morning-flow-beginners",
    title: "10-Minute Morning Yoga Flow for Complete Beginners",
    summary: "A gentle, evidence-based sequence to mobilise joints and set a calm tone for the day.",
    body: "This flow requires no equipment and fits in a 2x2m space. Begin in Child's Pose (Balasana) for 90 seconds, breathing into the lower back. Transition to Cat-Cow (5 rounds) to warm the spinal extensors. Move to Downward Dog — hold 45 seconds, pedalling the heels to stretch the calves and hamstrings. Step to Warrior I (Virabhadrasana I) on each side, holding 30 seconds per side. Return to centre for a Standing Forward Fold (Uttanasana), knees soft, for 60 seconds. Finish in Savasana for 2 minutes. This sequence activates the parasympathetic nervous system, reduces cortisol by 12-15% (per published yoga intervention studies), and improves thoracic mobility — a critical deficit for desk workers.",
    category: "movement",
    coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    author: AUTHORS.anna,
    publishedAt: "2024-11-19",
    readingTime: 4,
    tags: ["yoga", "flexibility", "morning", "beginners"],
    difficulty: "beginner",
    isPremium: false,
    stats: { views: 11200, likes: 934, saves: 521 },
  },
  {
    id: "art-010",
    slug: "cold-exposure-benefits-protocol",
    title: "Cold Exposure: The Data Behind the Hype",
    summary: "A measured look at cold water immersion — what the research actually says.",
    body: "Cold exposure (cold showers, ice baths, cold water immersion) has exploded in popularity. The evidence: acute cold exposure triggers noradrenaline release (+300% in 20°C water), improves mood, increases brown adipose tissue activity, and may improve insulin sensitivity with consistent practice. Protocol for beginners: 30 seconds cold at the end of your normal shower, progressive to 2-3 minutes at full cold over 4 weeks. Advanced: cold water immersion at 10-15°C for 3-5 minutes, 3x weekly. Critical caveat: post-resistance training cold immersion blunts muscle protein synthesis — wait 4+ hours after strength sessions. Contraindications: cardiovascular conditions, Raynaud's disease, cold urticaria. Always consult a physician.",
    category: "movement",
    coverUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800",
    author: AUTHORS.franco,
    publishedAt: "2024-11-16",
    readingTime: 6,
    tags: ["cold-exposure", "recovery", "noradrenaline", "protocol"],
    difficulty: "intermediate",
    isPremium: true,
    stats: { views: 25600, likes: 1987, saves: 1102 },
  },
  {
    id: "art-011",
    slug: "intuitive-eating-principles",
    title: "Intuitive Eating: Moving Beyond Diet Culture",
    summary: "The 10 principles of intuitive eating and the research supporting this framework.",
    body: "Intuitive eating, developed by dietitians Evelyn Tribole and Elyse Resch, is a framework of 10 principles that rejects external dietary rules in favour of internal hunger and satiety cues. Core principles: reject the diet mentality, honour your hunger, make peace with food (remove moralistic food labels), challenge the food police, respect your fullness, discover satisfaction, cope with emotions without using food, respect your body, exercise for how it feels, and honour your health with gentle nutrition. Research outcomes: lower BMI variability, improved psychological relationship with food, reduced binge eating episodes, and higher interoceptive awareness scores. This approach does not mean 'eat whatever, whenever' — it means developing the body literacy to understand genuine nutritional needs.",
    category: "mental-health",
    coverUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800",
    author: AUTHORS.luisa,
    publishedAt: "2024-11-12",
    readingTime: 7,
    tags: ["nutrition", "psychology", "eating", "body-image"],
    difficulty: "beginner",
    isPremium: false,
    stats: { views: 16400, likes: 1401, saves: 678 },
  },
  {
    id: "art-012",
    slug: "zone-2-cardio-longevity",
    title: "Zone 2 Cardio: The Longevity Protocol You're Probably Ignoring",
    summary: "Why the world's leading longevity physicians prescribe slow, conversational cardio above all else.",
    body: "Zone 2 training — sustained aerobic exercise at 60-70% of maximum heart rate, where you can hold a full conversation — is the most powerful metabolic conditioning tool available. At Zone 2 intensity, the body primarily oxidises fat as fuel, improving mitochondrial density, mitochondrial efficiency, and insulin sensitivity with unmatched specificity. Dr. Peter Attia, Dr. Iñigo San Millán and other longevity medicine leaders recommend 3-4 hours of Zone 2 per week as the foundation of any exercise programme. Modalities: cycling (lowest joint stress), walking on an incline, rowing, swimming. For a 35-year-old, Zone 2 heart rate is approximately 115-135 bpm — use a wrist monitor. Minimum effective dose: 45-minute sessions, 3x weekly. Results take 8-12 weeks of consistency to manifest metabolically.",
    category: "movement",
    coverUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    author: AUTHORS.franco,
    publishedAt: "2024-11-09",
    readingTime: 8,
    tags: ["cardio", "zone2", "longevity", "mitochondria"],
    difficulty: "intermediate",
    isPremium: true,
    stats: { views: 28900, likes: 2289, saves: 1456 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hero Carousel Slides
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  tag: string;
  headline: string;
  subline: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    tag: "New · Movement",
    headline: "Your Strongest Self Starts Today",
    subline: "Science-backed workout plans designed around your body, your schedule, your goals.",
    ctaLabel: "Start Training",
    ctaHref: "/explore?category=movement",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900",
  },
  {
    id: "hero-2",
    tag: "Featured · Nutrition",
    headline: "Eat With Intention, Not Restriction",
    subline: "Over 100 evidence-based recipes and meal plans curated by certified nutritionists.",
    ctaLabel: "Explore Recipes",
    ctaHref: "/explore?category=recipes",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
  },
  {
    id: "hero-3",
    tag: "Premium · Mindfulness",
    headline: "Quieter Mind, Sharper Life",
    subline: "Daily meditation guides, breathing protocols and sleep rituals backed by neuroscience.",
    ctaLabel: "Begin Practice",
    ctaHref: "/explore?category=mindfulness",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900",
  },
  {
    id: "hero-4",
    tag: "Trending · Sleep",
    headline: "Sleep Is Your Superpower",
    subline: "Optimise your sleep architecture with personalised wind-down routines and environment guides.",
    ctaLabel: "Improve Sleep",
    ctaHref: "/explore?category=sleep",
    imageUrl: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=900",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Subscription Plans
// ─────────────────────────────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Trial",
    price: 0,
    interval: "trial",
    features: [
      "7-day full access — no card required",
      "All beginner articles & recipes",
      "Weight & activity tracker",
      "Daily plan calendar",
      "No advertisements",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 15,
    interval: "month",
    isPopular: true,
    features: [
      "Unlimited access to all content",
      "Premium & advanced articles",
      "AI Wellness Coach (unlimited messages)",
      "Personalised daily plan generation",
      "Advanced nutrition & macro tracking",
      "Progress analytics & charts",
      "No advertisements",
    ],
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: 150,
    interval: "year",
    features: [
      "Everything in Monthly",
      "Save 17% vs. monthly billing",
      "Early access to new features",
      "Priority support",
      "Monthly live webinars with coaches",
      "Exclusive annual member community",
      "No advertisements",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Coach Profiles
// ─────────────────────────────────────────────────────────────────────────────

export interface CoachProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  specialty: string[];
  greeting: string;
}

export const COACHES: CoachProfile[] = [
  {
    id: "coach-franco",
    name: "Coach Franco",
    title: "Strength & Conditioning Specialist",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    specialty: ["Strength Training", "HIIT", "Body Composition"],
    greeting: "Hey! Ready to crush today? Tell me your goal and I'll build a plan around it. 💪",
  },
  {
    id: "coach-anna",
    name: "Coach Anna",
    title: "Mindfulness & Stress Management",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    specialty: ["Meditation", "Breathing", "Sleep Optimisation"],
    greeting: "Welcome. Let's find some stillness together. What's weighing on your mind today? 🌿",
  },
  {
    id: "coach-luisa",
    name: "Dr. Luisa",
    title: "Nutritionist & Metabolic Health",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    specialty: ["Nutrition", "Gut Health", "Hormonal Balance"],
    greeting: "Hi! I'm here to help you fuel your best self. What does your current diet look like? 🥗",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Quick Tips (Dashboard widget)
// ─────────────────────────────────────────────────────────────────────────────

export interface QuickTip {
  id: string;
  emoji: string;
  tip: string;
  category: string;
}

export const QUICK_TIPS: QuickTip[] = [
  { id: "qt-1", emoji: "💧", tip: "Drink 500ml of water first thing in the morning before any coffee or food.", category: "Hydration" },
  { id: "qt-2", emoji: "🌅", tip: "Get 10 minutes of natural sunlight within an hour of waking to anchor your circadian rhythm.", category: "Sleep" },
  { id: "qt-3", emoji: "🧘", tip: "Five slow, deep breaths activates the vagus nerve and reduces cortisol within 60 seconds.", category: "Stress" },
  { id: "qt-4", emoji: "🥗", tip: "Aim for 30 different plant species per week — diversity is the key microbiome metric.", category: "Nutrition" },
  { id: "qt-5", emoji: "🏃", tip: "Walking 8,000-10,000 steps daily reduces all-cause mortality risk by up to 40%.", category: "Movement" },
  { id: "qt-6", emoji: "📵", tip: "Keep your phone out of the bedroom. Screen-free sleep improves REM by up to 15%.", category: "Sleep" },
];
