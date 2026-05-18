# ZenFlow — Architecture Document

> **Version:** 2.0.0  
> **Stack:** Next.js 14 · TypeScript · Tailwind CSS · Zustand · Zod · React Hook Form  
> **Last updated:** December 2024

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Routing Architecture](#routing-architecture)
5. [State Management](#state-management)
6. [Data Flow Diagram](#data-flow-diagram)
7. [Component Architecture](#component-architecture)
8. [Design System](#design-system)
9. [Type System](#type-system)
10. [Form Validation](#form-validation)
11. [Mock Data Layer](#mock-data-layer)
12. [Feature Map](#feature-map)
13. [API Contracts (Future)](#api-contracts-future)
14. [Environment Variables](#environment-variables)
15. [Performance Decisions](#performance-decisions)
16. [Extending the App](#extending-the-app)

---

## Overview

ZenFlow is a mobile-first personal wellness platform that combines editorial content, daily tracking, AI coaching and subscription management into a single cohesive experience.

**Core principles:**
- **Mobile-first, desktop-capable** — designed for a 390px viewport, scales to desktop
- **Offline-tolerant** — critical state persisted to localStorage via Zustand
- **Content-first** — the Carousel system is the primary content delivery mechanism
- **Accessible** — every interactive component meets WCAG 2.1 AA
- **Type-safe end-to-end** — all domain models defined in `lib/types/index.ts`

---

## Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components, layout nesting, streaming |
| Language | TypeScript 5 (strict) | Catch bugs at compile time, better DX |
| Styling | Tailwind CSS 3 + CSS custom properties | Utility-first with centralized design tokens |
| State | Zustand 4 + `persist` middleware | Minimal boilerplate, localStorage persistence |
| Forms | React Hook Form 7 + Zod | Uncontrolled inputs, runtime schema validation |
| Icons | Lucide React | Consistent 24px SVG icon system |
| Dates | date-fns 3 | Tree-shakable, functional API |
| Fonts | Google Fonts: Cinzel + Nunito | Distinctive brand voice |

---

## Project Structure

```
zenflow/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group — unauthenticated layout
│   │   ├── layout.tsx            # Teal gradient background
│   │   ├── login/page.tsx        # Sign-in form
│   │   └── signup/page.tsx       # Registration form (collects biometrics)
│   │
│   ├── (app)/                    # Route group — authenticated layout
│   │   ├── layout.tsx            # Auth guard + TopBar + BottomNav + ToastContainer
│   │   ├── dashboard/page.tsx    # Home: 7 carousels + greeting + coach CTA
│   │   ├── explore/page.tsx      # Content discovery: search + filters + grid
│   │   ├── tracker/page.tsx      # Tabbed: Weight | Activity | Meals | Notes
│   │   ├── plan/page.tsx         # Calendar + daily plan form (meals, routines)
│   │   ├── coach/page.tsx        # AI coach chat with 3 personas
│   │   ├── membership/page.tsx   # Subscription tier selection
│   │   ├── checkout/page.tsx     # Stripe-ready payment form
│   │   ├── profile/page.tsx      # Edit profile, change password, logout
│   │   └── article/[slug]/       # Dynamic article reader + related carousel
│   │       └── page.tsx
│   │
│   ├── globals.css               # Design system base styles
│   ├── layout.tsx                # Root: fonts, SEO metadata, viewport
│   └── page.tsx                  # Redirect / → /login
│
├── components/
│   ├── carousel/
│   │   └── Carousel.tsx          # Generic reusable carousel (the core UI primitive)
│   ├── content/
│   │   ├── ArticleCard.tsx       # 3 variants: default | compact | featured
│   │   └── HeroBanner.tsx        # Full-width hero slide
│   ├── navigation/
│   │   ├── TopBar.tsx            # Desktop nav + user dropdown
│   │   └── BottomNav.tsx         # Mobile 6-tab bottom navigation
│   └── ui/
│       ├── index.tsx             # Atoms: Button, Input, Select, Textarea, Modal, Skeleton, Spinner
│       └── ToastContainer.tsx    # Global notification renderer
│
├── lib/
│   ├── store/
│   │   └── index.ts              # Zustand store (5 slices + selectors)
│   ├── types/
│   │   └── index.ts              # All domain types: User, Article, WeightEntry, DayPlan, etc.
│   └── utils/
│       ├── index.ts              # Pure helpers: cn(), generateId(), formatDate(), slugify()…
│       ├── schemas.ts            # Zod validation schemas + inferred TypeScript types
│       └── mockData.ts           # Rich static data: 12 articles, 4 authors, plans, coaches
│
├── next.config.js                # Next.js config (JS, not TS — required for v14)
├── tailwind.config.js            # Design tokens, animations, custom colours
├── tsconfig.json                 # TypeScript config (strict mode, path aliases)
├── postcss.config.js
├── .env.local.example
└── README.md
```

---

## Routing Architecture

```
/                   → redirect to /login
│
├── /login          (auth group — gradient layout)
├── /signup
│
└── (app group — authenticated shell: TopBar + BottomNav)
    ├── /dashboard           Home screen
    ├── /explore             Content discovery
    ├── /explore?category=X  Filtered by category
    ├── /article/[slug]      Article reader
    ├── /tracker             Tabbed data tracker
    ├── /plan                Calendar + day planner
    ├── /coach               AI chat interface
    ├── /membership          Subscription tiers
    ├── /checkout?plan=X     Payment form
    └── /profile             User account management
```

### Auth Guard

Located in `app/(app)/layout.tsx`. The guard reads `isAuthenticated` from Zustand on every render. If `false`, it calls `router.replace("/login")` and renders `null` (preventing a flash of protected content).

```typescript
// Simple, SSR-safe auth guard pattern
const isAuthenticated = useStore(selectIsAuthenticated);
useEffect(() => {
  if (!isAuthenticated) router.replace("/login");
}, [isAuthenticated, router]);
if (!isAuthenticated) return null;
```

---

## State Management

The Zustand store (`lib/store/index.ts`) is divided into **5 logical slices**:

```
ZenFlowStore
├── AuthSlice         user, token, isAuthenticated, login(), updateProfile(), logout()
├── TrackerSlice      weights[], activities[], meals[], notes[], add*, delete*, update*
├── PlanSlice         plans[], savePlan(), getPlanByDate(), markCompleted()
├── ChatSlice         messages[], addMessage(), clearHistory()
└── UISlice           isLoading, toasts[], setLoading(), pushToast(), dismissToast()
```

### Persistence Strategy

| Slice | Persisted | Reason |
|---|---|---|
| Auth | ✅ Yes | User must stay logged in across sessions |
| Tracker | ✅ Yes | Health data must survive page refreshes |
| Plan | ✅ Yes | Day plans are a core user artefact |
| Chat | ✅ Yes | Conversation history is contextual |
| UI | ❌ No | Toasts and loading flags are ephemeral |

Persisted to `localStorage` under the key `"zenflow-v2"` via `zustand/middleware`.

### Convenience Selectors

Named selector functions prevent inline arrow functions that break React's referential equality and cause unnecessary re-renders:

```typescript
// ✅ Correct — stable reference
const user = useStore(selectUser);

// ❌ Avoid — creates new function on every render
const user = useStore((s) => s.user);
```

---

## Data Flow Diagram

```
User Interaction
      │
      ▼
React Component (page or component)
      │
      ├─── Read state ──► useStore(selector) ──► Zustand Store
      │                                               │
      │                                          localStorage
      │
      ├─── Form submit ──► React Hook Form
      │                         │
      │                    Zod validation
      │                         │
      │              ┌──────────┴──────────┐
      │              │ Valid               │ Invalid
      │              ▼                     ▼
      │         API call (future)     Display field errors
      │              │
      │        Zustand action (add*, save*, update*)
      │              │
      │         pushToast() ──► ToastContainer (auto-dismiss 3.5s)
      │
      └─── Navigation ──► Next.js Router (router.push / router.replace)
```

---

## Component Architecture

### Carousel (`components/carousel/Carousel.tsx`)

The central UI primitive used across **8+ sections** in the app. Zero external dependencies — built on:

- **CSS `scroll-snap`** for smooth swipe behaviour
- **`IntersectionObserver`** to sync dot indicators with native scroll position
- **Keyboard navigation** (ArrowLeft/ArrowRight) for accessibility
- **Autoplay** with pause-on-hover

```
Carousel (generic shell)
├── Header (title + subtitle + "See all" link)
├── Track (scroll container)
│   └── children (each wrapped in a slide div with ARIA labels)
├── Prev/Next arrows (appear on desktop hover)
└── Dot indicators (tablist, updates via IntersectionObserver)
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | — | Section heading |
| `subtitle` | string | — | Sub-label |
| `seeAll` | {label, href} | — | "See all" link |
| `children` | ReactNode[] | required | Slide contents |
| `cols` | 1 \| 2 \| 3 | 1 | Visible columns |
| `autoplay` | boolean \| number | false | Auto-advance interval (ms) |
| `showDots` | boolean | auto | Force show/hide dots |

### ArticleCard (`components/content/ArticleCard.tsx`)

Three render variants controlled by the `variant` prop:

| Variant | Use case | Layout |
|---|---|---|
| `default` | Carousels, grids | Tall card with cover image + meta footer |
| `compact` | Lists, related articles | Horizontal thumbnail + title |
| `featured` | Hero grid | Wide card with large image overlay |

Premium articles rendered for free-tier users show a blur/lock overlay and redirect to `/membership`.

---

## Design System

All design tokens live in `tailwind.config.js` and CSS custom properties in `globals.css`.

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `teal-500` | `#00c4bc` | Primary interactive / CTA |
| `teal-700` | `#007a75` | Primary dark / pressed |
| `gold.DEFAULT` | `#e8a020` | Headings, accent, active states |
| `violet.DEFAULT` | `#7c4dba` | Premium / subscription screens |
| `teal-900` | `#002120` | Page background |
| `--clr-surface` | `rgba(255,255,255,0.07)` | Card/glass backgrounds |
| `--clr-border` | `rgba(255,255,255,0.13)` | Card borders |
| `--clr-muted` | `rgba(240,250,250,0.55)` | Secondary text |

### Typography

| Variable | Font | Weight | Usage |
|---|---|---|---|
| `--font-display` | Cinzel (serif) | 400/600/700 | `h1`–`h4`, section titles, logo |
| `--font-body` | Nunito (sans) | 300/400/600/700 | All body text, labels, buttons |

### Glass Morphism Pattern

All surface cards follow the `.glass` utility class:
```css
background: rgba(255, 255, 255, 0.07);
border: 1px solid rgba(255, 255, 255, 0.13);
border-radius: 22px;
backdrop-filter: blur(14px);
```

### Animation System

| Class | Keyframes | Duration | Use case |
|---|---|---|---|
| `animate-fade-in` | opacity 0→1 | 450ms | Page mounts |
| `animate-slide-up` | translateY(20px)→0 | 450ms | Modal, toasts, new messages |
| `animate-scale-in` | scale(0.94)→1 | 300ms | Dropdown menus |
| `animate-shimmer` | gradient shift | 1.8s loop | Skeleton loaders |

---

## Type System

All domain models are in `lib/types/index.ts`. **Never redeclare types inline in components.**

```
lib/types/index.ts
│
├── User                 Core user profile
├── SubscriptionTier     "free" | "monthly" | "annual"
├── Article              Full article with stats, author, tags
├── Author               Author profile
├── ContentCategory      "nutrition" | "movement" | "meditation" | …
├── ContentDifficulty    "beginner" | "intermediate" | "advanced"
├── WeightEntry          Single weight log
├── ActivityEntry        Single workout log
├── MealEntry            Single meal log
├── Note                 Free-text note
├── DayPlan              Full day plan (meals + activity + routines)
├── ChatMessage          Coach conversation message
├── SubscriptionPlan     Pricing tier definition
├── PaymentPayload       Checkout form data
├── ApiResponse<T>       Generic API wrapper
├── ApiError             API error shape
└── ToastState           Toast notification
```

---

## Form Validation

All forms use **React Hook Form + Zod** via `@hookform/resolvers/zod`.

The pattern is consistent across all forms:

```typescript
// 1. Schema defined in lib/utils/schemas.ts
export const weightSchema = z.object({
  valueKg: z.coerce.number().min(1, "Enter weight in kg"),
  date: z.string().min(1, "Select a date"),
});
export type WeightInput = z.infer<typeof weightSchema>;

// 2. Used in component
const { register, handleSubmit, formState: { errors } } =
  useForm<WeightInput>({ resolver: zodResolver(weightSchema) });
```

---

## Mock Data Layer

`lib/utils/mockData.ts` provides rich static data for all UI sections:

| Export | Count | Used in |
|---|---|---|
| `ARTICLES` | 12 articles | Dashboard, Explore, Article reader |
| `AUTHORS` | 4 profiles | ArticleCard meta |
| `HERO_SLIDES` | 4 slides | Dashboard hero carousel |
| `SUBSCRIPTION_PLANS` | 3 tiers | Membership, Checkout |
| `COACHES` | 3 personas | Coach chat, Dashboard CTA |
| `QUICK_TIPS` | 6 tips | Dashboard tips carousel |

In production, replace imports from `mockData.ts` with calls to the corresponding API endpoints.

---

## Feature Map

```
ZenFlow Features
│
├── 🔑 Authentication
│   ├── Login (username + password)
│   └── Signup (biometric data collection)
│
├── 🏠 Dashboard
│   ├── Personalised greeting
│   ├── Streak + stats chips
│   ├── Hero carousel (4 slides, autoplay)
│   ├── Quick tips carousel
│   ├── Trending articles carousel (2-col)
│   ├── Nutrition/Recipes carousel
│   ├── Movement carousel (2-col)
│   ├── Mindfulness carousel
│   ├── AI Coach CTA banner
│   └── Premium content teaser carousel
│
├── 🔍 Explore
│   ├── Full-text search
│   ├── Category filter pills
│   ├── Difficulty filter
│   ├── Recently added carousel
│   └── Responsive article grid
│
├── 📖 Article Reader
│   ├── Full article body
│   ├── Author profile
│   ├── Engagement stats
│   ├── Tag cloud
│   └── Related articles carousel
│
├── 📊 Tracker
│   ├── Weight log + history
│   ├── Activity log + history
│   ├── Meal log + history
│   └── Personal notes (CRUD)
│
├── 📅 Daily Plan
│   ├── Monthly calendar view
│   ├── Day plan form (meals + activity + routines)
│   └── Completion tracking
│
├── 🤖 AI Coach
│   ├── 3 coach personas (Strength / Mindfulness / Nutrition)
│   ├── Typing indicator simulation
│   ├── Conversation history (persisted)
│   └── Coach switching with context reset
│
├── 💳 Membership
│   ├── Free trial (7 days, no card)
│   ├── Monthly plan
│   ├── Annual plan (17% discount)
│   └── Expandable feature lists
│
├── 💰 Checkout
│   └── Stripe-ready payment form
│
└── 👤 Profile
    ├── Personal details editor
    ├── Password change
    └── Sign out
```

---

## API Contracts (Future)

When replacing mock data with a real backend, implement these endpoints:

```
POST   /api/auth/login               → { user, token }
POST   /api/auth/signup              → { user, token }
POST   /api/auth/logout

GET    /api/content/articles         → { data: Article[], meta: { total, page } }
GET    /api/content/articles/:slug   → { data: Article }

GET    /api/tracker/weights          → { data: WeightEntry[] }
POST   /api/tracker/weights          → { data: WeightEntry }
GET    /api/tracker/activities       → { data: ActivityEntry[] }
POST   /api/tracker/activities       → { data: ActivityEntry }
GET    /api/tracker/meals            → { data: MealEntry[] }
POST   /api/tracker/meals            → { data: MealEntry }
GET    /api/tracker/notes            → { data: Note[] }
POST   /api/tracker/notes            → { data: Note }
DELETE /api/tracker/notes/:id

GET    /api/plan/:date               → { data: DayPlan }
PUT    /api/plan/:date               → { data: DayPlan }

POST   /api/coach/chat               → { data: ChatMessage }

GET    /api/subscription/plans       → { data: SubscriptionPlan[] }
POST   /api/subscription/checkout    → { data: { clientSecret } }  ← Stripe
```

All responses follow `ApiResponse<T>` and errors follow `ApiError` from `lib/types/index.ts`.

---

## Environment Variables

```bash
# .env.local

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API (replace with your endpoint when ready)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Stripe (production checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Optional analytics
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## Performance Decisions

| Decision | Why |
|---|---|
| `"use client"` on page components only | Keeps server components where possible |
| `next/font/google` for fonts | Eliminates layout shift, hosts fonts locally |
| `next/image` config for Unsplash | Image optimisation, WebP/AVIF conversion |
| `scrollbar-hide` on all scroll containers | Clean UI without layout impact |
| CSS `scroll-snap` in Carousel | Hardware-accelerated, no JS needed for smooth swipe |
| `IntersectionObserver` for dot sync | O(1) vs polling, clean on unmount |
| Zustand `partialize` | Prevents storing ephemeral UI state in localStorage |
| Zod `z.coerce` on number inputs | Handles HTML string→number coercion transparently |

---

## Extending the App

### Adding a new page

1. Create `app/(app)/your-page/page.tsx`
2. Add the route to `components/navigation/BottomNav.tsx` tabs
3. Add the route to `components/navigation/TopBar.tsx` NAV_LINKS
4. Export new types from `lib/types/index.ts`
5. Add a Zod schema to `lib/utils/schemas.ts`
6. Add a Zustand slice if state needs to persist

### Adding a new carousel section

```tsx
// Any page — import and use directly
import { Carousel } from "@/components/carousel/Carousel";
import { ArticleCard } from "@/components/content/ArticleCard";

<Carousel
  title="Your Section Title"
  subtitle="Optional sub-label"
  seeAll={{ label: "See all", href: "/explore?category=your-category" }}
  cols={2}          // 1, 2, or 3 visible cards
  autoplay={5000}   // optional, milliseconds
>
  {yourItems.map(item => <ArticleCard key={item.id} article={item} />)}
</Carousel>
```

### Adding a new tracker type

1. Define the entry type in `lib/types/index.ts`
2. Add a Zod schema in `lib/utils/schemas.ts`
3. Add a slice in `lib/store/index.ts`
4. Add a new tab panel in `app/(app)/tracker/page.tsx`

---

*ZenFlow — architecture documentation maintained by the development team.*
