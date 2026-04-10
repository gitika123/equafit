const STORAGE_KEYS = {
  user: "equafit_user",
  profile: "equafit_profile",
  onboardingDone: "equafit_onboarding_done",
  completedDays: "equafit_completed_days",
  periodLog: "equafit_period_log",
  reminders: "equafit_reminders",
  weightLog: "equafit_weight_log",
} as const;

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserProfile {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: "male" | "female" | "other";
  goals: string[];
  periodTrackingEnabled: boolean;
}

export interface CompletedDay {
  groupId: string;
  day: number;
  date: string;
  feeling?: "great" | "good" | "okay" | "tired";
}

export interface PeriodEntry {
  startDate: string;
  endDate: string;
  notes?: string;
  flow?: "light" | "medium" | "heavy";
  symptoms?: string[];
}

export interface WeightEntry {
  date: string;
  weightKg: number;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string;
  messages: string[];
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: StoredUser | null): void {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.user);
}

export function isOnboardingDone(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.onboardingDone) === "true";
}

export function setOnboardingDone(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.onboardingDone, "true");
}

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.profile);
  return raw ? JSON.parse(raw) : null;
}

export function setProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

export function getCompletedDays(): CompletedDay[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.completedDays);
  return raw ? JSON.parse(raw) : [];
}

export function addCompletedDay(day: CompletedDay): void {
  const list = getCompletedDays();
  const exists = list.some((d) => d.groupId === day.groupId && d.day === day.day && d.date === day.date);
  if (!exists) {
    list.push(day);
    localStorage.setItem(STORAGE_KEYS.completedDays, JSON.stringify(list));
  }
}

export function getPeriodLog(): PeriodEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.periodLog);
  return raw ? JSON.parse(raw) : [];
}

export function addPeriodEntry(entry: PeriodEntry): void {
  const list = getPeriodLog();
  list.push(entry);
  list.sort((a, b) => a.startDate.localeCompare(b.startDate));
  localStorage.setItem(STORAGE_KEYS.periodLog, JSON.stringify(list));
}

export function getReminderSettings(): ReminderSettings {
  if (typeof window === "undefined")
    return { enabled: false, time: "09:00", messages: [] };
  const raw = localStorage.getItem(STORAGE_KEYS.reminders);
  if (!raw) return { enabled: false, time: "09:00", messages: [] };
  return JSON.parse(raw);
}

export function setReminderSettings(settings: ReminderSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(settings));
}

export function getWeightLog(): WeightEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.weightLog);
  return raw ? JSON.parse(raw) : [];
}

export function addWeightEntry(entry: WeightEntry): void {
  const list = getWeightLog();
  const idx = list.findIndex((e) => e.date === entry.date);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  list.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(STORAGE_KEYS.weightLog, JSON.stringify(list));
}

export const STORAGE_KEYS_ARR = [
  STORAGE_KEYS.user,
  STORAGE_KEYS.profile,
  STORAGE_KEYS.onboardingDone,
  STORAGE_KEYS.completedDays,
  STORAGE_KEYS.periodLog,
  STORAGE_KEYS.reminders,
  STORAGE_KEYS.weightLog,
] as const;

export type ExportedData = Record<string, string | null>;

export function getProgressStats(completed: CompletedDay[]) {
  const byDate = new Map<string, number>();
  completed.forEach((d) => {
    byDate.set(d.date, (byDate.get(d.date) || 0) + 1);
  });
  const sortedDates = Array.from(byDate.keys()).sort();
  let longestStreak = 0;
  let current = 0;
  let lastDate: string | null = null;
  for (const d of sortedDates) {
    const prev = lastDate ? new Date(lastDate).getTime() : 0;
    const curr = new Date(d).getTime();
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) current++;
    else current = 1;
    lastDate = d;
    longestStreak = Math.max(longestStreak, current);
  }
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weeks: { label: string; count: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const end = new Date(now - i * oneWeek);
    const start = new Date(end.getTime() - oneWeek);
    const count = completed.filter((d) => {
      const t = new Date(d.date).getTime();
      return t >= start.getTime() && t < end.getTime();
    }).length;
    weeks.push({
      label: i === 0 ? "This week" : `Week -${i}`,
      count,
    });
  }
  return { longestStreak, weeks };
}

export function exportAllData(): ExportedData {
  if (typeof window === "undefined") return {};
  const out: ExportedData = {};
  STORAGE_KEYS_ARR.forEach((key) => {
    out[key] = localStorage.getItem(key);
  });
  return out;
}

export function importAllData(data: ExportedData): void {
  if (typeof window === "undefined") return;
  STORAGE_KEYS_ARR.forEach((key) => {
    const v = data[key];
    if (v !== undefined && v !== null) localStorage.setItem(key, v);
  });
}
