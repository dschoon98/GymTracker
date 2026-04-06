import { seedRoutines } from '@/data/seed';
import { Routine, RoutineExercise } from '@/data/types';
import { create } from 'zustand';

type RoutineStore = {
  routines: Routine[];
  getRoutine: (id: string) => Routine | undefined;
  addRoutine: (name: string, exercises: RoutineExercise[]) => Routine;
  updateRoutine: (id: string, updates: Partial<Pick<Routine, 'name' | 'exercises'>>) => void;
  deleteRoutine: (id: string) => void;
  markPerformed: (id: string) => void;
};

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routines: seedRoutines,

  getRoutine: (id) => get().routines.find((r) => r.id === id),

  addRoutine: (name, exercises) => {
    const newRoutine: Routine = {
      id: `routine-${Date.now()}`,
      name,
      exercises,
      createdAt: new Date().toISOString(),
      lastPerformedAt: null,
    };
    set((s) => ({ routines: [...s.routines, newRoutine] }));
    return newRoutine;
  },

  updateRoutine: (id, updates) =>
    set((s) => ({
      routines: s.routines.map((r) =>
        r.id === id
          ? { ...r, ...updates }
          : r
      ),
    })),

  deleteRoutine: (id) =>
    set((s) => ({ routines: s.routines.filter((r) => r.id !== id) })),

  markPerformed: (id) =>
    set((s) => ({
      routines: s.routines.map((r) =>
        r.id === id ? { ...r, lastPerformedAt: new Date().toISOString() } : r
      ),
    })),
}));
