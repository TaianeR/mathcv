import type { AtsResume, MatchAnalysis, Profile } from "./schemas";
import { emptyProfile } from "./schemas";

const isBrowser = typeof window !== "undefined";

const KEYS = {
  profile: "matchcv.profile",
  resumeText: "matchcv.resumeText",
  jobDescription: "matchcv.jobDescription",
  lastAnalysis: "matchcv.lastAnalysis",
  lastAts: "matchcv.lastAts",
  lastCover: "matchcv.lastCover",
  history: "matchcv.history",
} as const;

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export const storage = {
  getProfile: (): Profile => read<Profile>(KEYS.profile, emptyProfile),
  setProfile: (p: Profile) => write(KEYS.profile, p),
  getResumeText: (): string => read<string>(KEYS.resumeText, ""),
  setResumeText: (t: string) => write(KEYS.resumeText, t),
  getJobDescription: (): string => read<string>(KEYS.jobDescription, ""),
  setJobDescription: (t: string) => write(KEYS.jobDescription, t),
  getLastAnalysis: (): MatchAnalysis | null => read<MatchAnalysis | null>(KEYS.lastAnalysis, null),
  setLastAnalysis: (a: MatchAnalysis | null) => write(KEYS.lastAnalysis, a),
  getLastAts: (): AtsResume | null => read<AtsResume | null>(KEYS.lastAts, null),
  setLastAts: (a: AtsResume | null) => write(KEYS.lastAts, a),
  getLastCover: (): string => read<string>(KEYS.lastCover, ""),
  setLastCover: (t: string) => write(KEYS.lastCover, t),
  getHistory: () => read<HistoryItem[]>(KEYS.history, []),
  pushHistory: (item: HistoryItem) => {
    const list = read<HistoryItem[]>(KEYS.history, []);
    list.unshift(item);
    write(KEYS.history, list.slice(0, 50));
  },
  clearAll: () => {
    if (!isBrowser) return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

export interface HistoryItem {
  id: string;
  type: "analysis" | "ats" | "cover";
  createdAt: number;
  title: string;
  score?: number;
  data: unknown;
}

export function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}