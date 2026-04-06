import { seedHistory } from '@/data/seed';
import { WorkoutSession } from '@/data/types';
import { create } from 'zustand';

type HistoryStore = {
  sessions: WorkoutSession[];
  addSession: (session: WorkoutSession) => void;
  getSessionsByGym: (gymId: string) => WorkoutSession[];
  getSessionsForExercise: (exerciseId: string, gymId?: string) => WorkoutSession[];
  getRecentSessions: (count: number) => WorkoutSession[];
  getWeeklyStats: () => { workouts: number; totalVolume: number; totalDuration: number; streak: number };
  getWorkoutDays: () => Set<string>;
};

function getDateKey(iso: string): string {
  return iso.slice(0, 10);
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  sessions: seedHistory.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()),

  addSession: (session) =>
    set((s) => ({
      sessions: [session, ...s.sessions],
    })),

  getSessionsByGym: (gymId) => get().sessions.filter((s) => s.gymId === gymId),

  getSessionsForExercise: (exerciseId, gymId) =>
    get().sessions.filter(
      (s) =>
        (!gymId || s.gymId === gymId) &&
        s.exercises.some((e) => e.exerciseId === exerciseId)
    ),

  getRecentSessions: (count) => get().sessions.slice(0, count),

  getWeeklyStats: () => {
    const now = new Date('2026-03-28T23:59:59Z');
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const thisWeek = get().sessions.filter(
      (s) => new Date(s.startedAt) >= weekAgo && new Date(s.startedAt) <= now
    );

    // Streak: count consecutive days with workouts going backwards from today
    const allDates = get().sessions.map((s) => getDateKey(s.startedAt));
    const uniqueDates = [...new Set(allDates)].sort().reverse();
    let streak = 0;
    const today = new Date('2026-03-28');
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (getDateKey(expected.toISOString()) === uniqueDates[i]) {
        streak++;
      } else {
        break;
      }
    }

    return {
      workouts: thisWeek.length,
      totalVolume: thisWeek.reduce((sum, s) => sum + s.totalVolume, 0),
      totalDuration: thisWeek.reduce((sum, s) => sum + s.duration, 0),
      streak,
    };
  },

  getWorkoutDays: () => {
    const days = new Set<string>();
    get().sessions.forEach((s) => days.add(getDateKey(s.startedAt)));
    return days;
  },
}));
