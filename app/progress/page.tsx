"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getCompletedDays, getProfile, getWeightLog, addWeightEntry } from "@/lib/user-store";

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function msToDays(ms: number) {
  return Math.floor(ms / 86400000);
}

function AnimCount({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 800;
    function tick() {
      const p = Math.min(1, (Date.now() - start) / duration);
      setVal(Math.round(p * to));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to]);
  return <>{val}{suffix}</>;
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [daysActive, setDaysActive] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weekCounts, setWeekCounts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [heatmap, setHeatmap] = useState<{ date: string; count: number }[]>([]);
  const [weights, setWeights] = useState<{ date: string; weightKg: number }[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [profile, setProfile] = useState<ReturnType<typeof getProfile>>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const completed = getCompletedDays();
    const p = getProfile();
    setProfile(p);
    setSessions(completed.length);
    setCalories(completed.length * 280);

    const byDate = new Set(completed.map((d) => d.date));
    setDaysActive(byDate.size);

    let s = 0;
    const today = new Date().toISOString().slice(0, 10);
    const sorted = Array.from(byDate).sort().reverse();
    for (const d of sorted) {
      if (msToDays(new Date(today).getTime() - new Date(d).getTime()) === s) s++;
      else break;
    }
    setStreak(s);

    // Week counts for last 7 days (bar chart)
    const wc = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    completed.forEach((d) => {
      const diff = msToDays(now.getTime() - new Date(d.date).getTime());
      if (diff >= 0 && diff < 7) wc[6 - diff]++;
    });
    setWeekCounts(wc);

    // Heatmap: last 35 days
    const hm: { date: string; count: number }[] = [];
    for (let i = 34; i >= 0; i--) {
      const dt = new Date(now);
      dt.setDate(dt.getDate() - i);
      const key = formatDate(dt);
      hm.push({ date: key, count: completed.filter((c) => c.date === key).length });
    }
    setHeatmap(hm);

    setWeights(getWeightLog());
  }, []);

  function logWeight() {
    const kg = parseFloat(newWeight);
    if (!kg || kg < 20 || kg > 300) return;
    addWeightEntry({ date: formatDate(new Date()), weightKg: kg });
    setWeights(getWeightLog());
    setNewWeight("");
    weightInputRef.current?.blur();
  }

  // BMI
  const heightCm = profile?.heightCm ?? 0;
  const latestWeight = weights.length ? weights[weights.length - 1].weightKg : profile?.weightKg ?? 0;
  const bmi = heightCm && latestWeight ? latestWeight / ((heightCm / 100) ** 2) : 0;
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = bmi < 18.5 ? "#0EA5E9" : bmi < 25 ? "#10B981" : bmi < 30 ? "#F59E0B" : "#EF4444";
  const bmiPct = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));

  // Weight SVG chart
  const WW = 420, WH = 120;
  const chartWeights = weights.slice(-10);
  let weightPath = "";
  if (chartWeights.length > 1) {
    const min = Math.min(...chartWeights.map((w) => w.weightKg)) - 2;
    const max = Math.max(...chartWeights.map((w) => w.weightKg)) + 2;
    weightPath = chartWeights.map((w, i) => {
      const x = (i / (chartWeights.length - 1)) * WW;
      const y = WH - ((w.weightKg - min) / (max - min)) * (WH - 20) - 10;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const maxWeek = Math.max(...weekCounts, 1);

  const statsRow = [
    { icon: "🔥", value: streak,     label: "Day streak",   sub: "Current", cls: "from-orange-50 to-red-50 border-orange-100",     val: "text-primary" },
    { icon: "💪", value: sessions,   label: "Sessions done", sub: "All time", cls: "from-white to-slate-50 border-slate-100",        val: "text-dark" },
    { icon: "⚡", value: Math.round(calories), label: "kcal burned", sub: "Estimated", cls: "from-amber-50 to-yellow-50 border-amber-100", val: "text-amber-600" },
    { icon: "📅", value: daysActive, label: "Days active",   sub: "All time", cls: "from-teal-50 to-cyan-50 border-teal-100",       val: "text-accent" },
  ];

  return (
    <main className="w-full px-4 sm:px-6 lg:px-10 pt-6 pb-28 md:pb-10 min-h-screen">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-dark leading-tight">Progress</h1>
        <p className="text-muted text-sm mt-1">Track your activity, streaks, weight, and body metrics.</p>
      </motion.div>

      {/* ── 4 Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8">
        {statsRow.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`card p-5 md:p-6 bg-gradient-to-br border ${s.cls}`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-semibold text-muted bg-white/80 px-2.5 py-1 rounded-full">{s.sub}</span>
            </div>
            <p className={`text-4xl font-black leading-none ${s.val}`}>
              <AnimCount to={typeof s.value === "number" ? s.value : 0} />
            </p>
            <p className="text-sm text-muted font-medium mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">

        {/* ── Left column ── */}
        <div className="space-y-6">

          {/* Sessions per week bar chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-black text-dark text-lg">Sessions — last 7 days</h2>
                <p className="text-muted text-sm mt-0.5">Daily workout activity</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary">{weekCounts.reduce((a, b) => a + b, 0)}</p>
                <p className="text-xs text-muted">this week</p>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {weekCounts.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-dark">{count > 0 ? count : ""}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, (count / maxWeek) * 96)}px` }}
                    transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 200 }}
                    className={`w-full rounded-lg ${count > 0 ? "bg-gradient-fitness shadow-primary" : "bg-slate-100"}`}
                  />
                  <span className="text-xs text-muted">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity heatmap */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-black text-dark text-lg">Activity heatmap</h2>
                <p className="text-muted text-sm mt-0.5">Last 35 days</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted">less</span>
                {[0, 1, 2, 3].map((v) => (
                  <div key={v} className="w-3 h-3 rounded-sm" style={{ background: v === 0 ? "#F1F5F9" : `rgba(216,67,21,${0.2 + v * 0.27})` }} />
                ))}
                <span className="text-xs text-muted">more</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {heatmap.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} session(s)`}
                  className="aspect-square rounded-md cursor-default transition-transform hover:scale-110"
                  style={{ background: day.count === 0 ? "#F1F5F9" : `rgba(244,81,30,${Math.min(0.9, 0.25 + day.count * 0.3)})` }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted">
              <span>{heatmap[0]?.date}</span>
              <span>{heatmap[heatmap.length - 1]?.date}</span>
            </div>
          </motion.div>

          {/* Calories burned */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Estimated energy burned</p>
                <p className="text-5xl font-black text-amber-600">
                  <AnimCount to={calories} /> <span className="text-2xl">kcal</span>
                </p>
                <p className="text-sm text-amber-700/70 mt-2">Based on {sessions} completed sessions × 280 kcal avg.</p>
              </div>
              <span className="text-6xl opacity-25">⚡</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Weight tracker */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card p-6">
            <h2 className="font-black text-dark text-lg mb-1">Weight tracker</h2>
            <p className="text-muted text-sm mb-5">Log daily to see your trend</p>

            {chartWeights.length > 1 ? (
              <div className="mb-5 overflow-hidden rounded-xl bg-slate-50">
                <svg width="100%" viewBox={`0 0 ${WW} ${WH}`} preserveAspectRatio="none" className="h-28">
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d84315" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#d84315" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${weightPath} L${WW},${WH} L0,${WH} Z`}
                    fill="url(#wGrad)"
                  />
                  <path d={weightPath} fill="none" stroke="#d84315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <div className="h-28 mb-5 rounded-xl bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-muted">Log 2+ entries to see your chart</p>
              </div>
            )}

            {/* Last few entries */}
            {weights.length > 0 && (
              <div className="space-y-2 mb-5">
                {weights.slice(-4).reverse().map((w) => (
                  <div key={w.date} className="flex justify-between items-center text-sm py-1 border-b border-slate-100 last:border-0">
                    <span className="text-muted">{w.date}</span>
                    <span className="font-bold text-dark">{w.weightKg} kg</span>
                  </div>
                ))}
              </div>
            )}

            {/* Log weight */}
            <div className="flex gap-2">
              <input
                ref={weightInputRef}
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && logWeight()}
                placeholder="e.g. 68.5 kg"
                className="flex-1 input-base text-sm"
              />
              <button
                onClick={logWeight}
                className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Log
              </button>
            </div>
          </motion.div>

          {/* BMI */}
          {bmi > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card p-6">
              <h2 className="font-black text-dark text-lg mb-1">BMI</h2>
              <p className="text-muted text-sm mb-5">Body Mass Index</p>

              <div className="flex items-end gap-3 mb-5">
                <p className="text-5xl font-black leading-none" style={{ color: bmiColor }}>
                  {bmi.toFixed(1)}
                </p>
                <div className="mb-1">
                  <span className="pill text-xs font-bold px-3 py-1" style={{ background: bmiColor + "20", color: bmiColor }}>{bmiLabel}</span>
                </div>
              </div>

              {/* BMI bar */}
              <div className="relative h-3 rounded-full overflow-hidden mb-2" style={{ background: "linear-gradient(to right, #0EA5E9 0%, #10B981 30%, #F59E0B 60%, #EF4444 100%)" }}>
                <motion.div
                  initial={{ left: "0%" }}
                  animate={{ left: `${bmiPct}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-dark shadow-md"
                  style={{ borderColor: bmiColor }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-xs text-muted mb-0.5">Weight</p>
                  <p className="font-bold text-dark">{latestWeight} kg</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-xs text-muted mb-0.5">Height</p>
                  <p className="font-bold text-dark">{heightCm} cm</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Streak history */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="card p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Current streak</p>
            <p className="text-5xl font-black text-primary">
              <AnimCount to={streak} />
              <span className="text-2xl ml-1">🔥</span>
            </p>
            <p className="text-sm text-orange-700/70 mt-2">{streak > 0 ? `${streak} day${streak !== 1 ? "s" : ""} in a row — incredible!` : "Do a session today to start your streak!"}</p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
