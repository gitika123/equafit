"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  DIET_FUEL_WEEKS,
  getCurrentDietFuelWeek,
  getISOWeekNumber,
  type DietFuelWeek,
} from "@/lib/diet-fuel-guide";

function WeekCard({
  week,
  highlight,
}: {
  week: DietFuelWeek;
  highlight: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card overflow-hidden ${highlight ? "ring-2 ring-primary/40 shadow-card-md" : ""}`}
    >
      {highlight && (
        <div className="h-1 bg-gradient-emerald" />
      )}
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl" aria-hidden>
            {week.icon}
          </span>
          <div>
            {highlight && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">This week</p>
            )}
            <h2 className="text-lg font-black text-dark leading-tight">{week.title}</h2>
            <p className="text-sm text-muted mt-0.5">{week.subtitle}</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-4">
          {week.budgetNote}
        </p>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Tips</p>
        <ul className="space-y-2 mb-5">
          {week.tips.map((t, i) => (
            <li key={i} className="text-sm text-dark leading-relaxed pl-3 border-l-2 border-emerald-200">
              {t}
            </li>
          ))}
        </ul>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Shopping ideas</p>
        <div className="flex flex-wrap gap-2">
          {week.shoppingIdeas.map((s) => (
            <span
              key={s}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function DietFuelPage() {
  const today = new Date();
  const isoWeek = getISOWeekNumber(today);
  const current = getCurrentDietFuelWeek(today);
  const currentIndex = DIET_FUEL_WEEKS.findIndex((w) => w.id === current.id);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted font-semibold text-sm mb-4 hover:text-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Home
        </Link>
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-emerald text-white">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 -translate-x-1/4 translate-y-1/4" />
          <div className="relative z-10">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Nutrition</p>
            <h1 className="text-3xl md:text-4xl font-black leading-tight">Diet Fuel Guide</h1>
            <p className="text-white/90 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              Budget-friendly ideas that rotate each week — no paywalls, just practical fuel for students and busy routines.
            </p>
            <p className="text-white/70 text-xs mt-4 font-medium">
              Calendar week {isoWeek} · Theme &quot;{current.title}&quot;
            </p>
          </div>
        </div>
      </motion.div>

      <p className="text-sm text-muted mb-4 max-w-2xl">
        Eight themes cycle through the year (by ISO week), so you see a new focus weekly for two months before it repeats. Your &quot;this week&quot; card is highlighted; browse the rest anytime.
      </p>

      <div className="grid gap-5 md:grid-cols-2 mb-6">
        {DIET_FUEL_WEEKS.map((week, i) => (
          <WeekCard key={week.id} week={week} highlight={i === currentIndex} />
        ))}
      </div>

      <p className="text-xs text-muted text-center max-w-md mx-auto leading-relaxed">
        Tips are general wellness ideas, not medical advice. Adjust for allergies, culture, and what&apos;s affordable where you live.
      </p>
    </main>
  );
}
