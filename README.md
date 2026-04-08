# EquaFit

A **personalized, animated fitness & wellness app** for college students. Login, set your details, pick goal-based 30-day routines (belly/abs, arms, legs, full body, cardio, flexibility, stress relief, period-friendly), complete daily workouts, get post-workout celebration and “how are you feeling” flow, and receive funny/witty reminder messages. Includes period tracker and light routines for cycle days.

## Features

- **Login / Sign up** — Simple auth (client-side for demo)
- **Onboarding** — Height, weight, age, gender, goals, optional period tracking
- **Routine groups** — Belly & abs, Arms, Legs, Full body, Cardio, Flexibility, Stress relief, **Period-friendly (light)**
- **30-day routines** — Each group has a 30-day program; tap a day to see exercises, watch video tutorials (YouTube), and mark complete
- **Post-workout** — Celebration, “How are you feeling?” (Great / Good / Okay / Tired), motivation to return next day
- **Reminders** — Toggle daily reminder and preview funny, witty motivational lines
- **Period tracker** — Log start/end dates, see “on period” hint and quick link to period-friendly routine
- **Progress** — Streak, longest streak, sessions done, days active, sessions-per-week bar chart (last 4 weeks)
- **Profile** — View details, export/import backup (JSON), and log out

### High-impact additions

- **Goal-based recommendations** — Home shows “Recommended for you” with routines sorted by your onboarding goals
- **Resume routine** — One-tap “Resume [Routine] · Day X” to pick up where you left off
- **Progress charts** — Sessions-per-week bar chart and longest streak stat
- **Export / import data** — Download backup or restore from another device
- **Video tutorials** — Each exercise has a “Watch tutorial” link that opens YouTube form tutorials

## Tech stack

- **Next.js 14** (App Router)
- **React** + **TypeScript**
- **Framer Motion** — Animations and transitions
- **Tailwind CSS** — Fitness theme (orange/coral + teal gradients)

## Getting started

```bash
cd equafit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up → complete onboarding → use Home, Routines, Progress, Cycle, Remind, Profile.

## Project structure

```
equafit/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard (home)
│   ├── login/                # Login
│   ├── signup/               # Sign up
│   ├── onboarding/           # Height, weight, goals, period opt-in
│   ├── routines/             # List of groups
│   ├── routines/[groupId]/   # 30-day grid
│   ├── routines/[groupId]/[day]/  # Day workout + mark complete
│   ├── complete/             # Celebration + feeling + return tomorrow
│   ├── progress/             # Streaks & stats
│   ├── period/               # Period tracker + light routine link
│   ├── reminders/            # Witty reminders on/off + preview
│   └── profile/              # Account & details
├── components/
│   ├── AppShell.tsx          # Auth + nav visibility
│   └── BottomNav.tsx         # Home, Routines, Progress, Cycle, Remind, Profile
├── lib/
│   ├── auth-context.tsx      # Auth state
│   ├── user-store.ts         # localStorage (user, profile, completed, period, reminders)
│   ├── routines.ts           # Groups + 30-day exercise data
│   └── reminders.ts          # Witty reminder copy
└── ...
```

## Reference

Based on CS161 Team 4 PRD (PulseFlow / EquaFit concept).
