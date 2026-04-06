import { ActiveExercise, ActiveSet, CompletedSet, WorkoutExercise, WorkoutSession } from '@/data/types';
import { create } from 'zustand';

type WorkoutStore = {
  // State
  isActive: boolean;
  routineId: string | null;
  routineName: string;
  gymId: string;
  startedAt: string | null;
  exercises: ActiveExercise[];
  currentExerciseIndex: number;
  restTimerEnd: string | null;

  // Actions
  startWorkout: (params: { routineId: string | null; routineName: string; gymId: string; exercises: ActiveExercise[] }) => void;
  cancelWorkout: () => void;
  setCurrentExercise: (index: number) => void;
  addSet: (exerciseIndex: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, updates: Partial<ActiveSet>) => void;
  completeSet: (exerciseIndex: number, setIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  startRestTimer: (seconds: number) => void;
  clearRestTimer: () => void;
  setGymId: (gymId: string) => void;

  // Finalization
  finishWorkout: () => WorkoutSession | null;
};

const initialState = {
  isActive: false,
  routineId: null as string | null,
  routineName: '',
  gymId: '',
  startedAt: null as string | null,
  exercises: [] as ActiveExercise[],
  currentExerciseIndex: 0,
  restTimerEnd: null as string | null,
};

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  ...initialState,

  startWorkout: ({ routineId, routineName, gymId, exercises }) =>
    set({
      isActive: true,
      routineId,
      routineName,
      gymId,
      startedAt: new Date().toISOString(),
      exercises,
      currentExerciseIndex: 0,
      restTimerEnd: null,
    }),

  cancelWorkout: () => set(initialState),

  setCurrentExercise: (index) => set({ currentExerciseIndex: index }),

  addSet: (exerciseIndex) =>
    set((s) => {
      const exercises = [...s.exercises];
      const exercise = { ...exercises[exerciseIndex] };
      const lastSet = exercise.sets[exercise.sets.length - 1];
      exercise.sets = [
        ...exercise.sets,
        { weight: lastSet?.weight ?? 0, reps: lastSet?.reps ?? 0, isWarmup: false, isCompleted: false },
      ];
      exercises[exerciseIndex] = exercise;
      return { exercises };
    }),

  updateSet: (exerciseIndex, setIndex, updates) =>
    set((s) => {
      const exercises = [...s.exercises];
      const exercise = { ...exercises[exerciseIndex] };
      exercise.sets = exercise.sets.map((set, i) =>
        i === setIndex ? { ...set, ...updates } : set
      );
      exercises[exerciseIndex] = exercise;
      return { exercises };
    }),

  completeSet: (exerciseIndex, setIndex) =>
    set((s) => {
      const exercises = [...s.exercises];
      const exercise = { ...exercises[exerciseIndex] };
      exercise.sets = exercise.sets.map((set, i) =>
        i === setIndex ? { ...set, isCompleted: true } : set
      );
      exercises[exerciseIndex] = exercise;
      return { exercises };
    }),

  removeSet: (exerciseIndex, setIndex) =>
    set((s) => {
      const exercises = [...s.exercises];
      const exercise = { ...exercises[exerciseIndex] };
      exercise.sets = exercise.sets.filter((_, i) => i !== setIndex);
      exercises[exerciseIndex] = exercise;
      return { exercises };
    }),

  startRestTimer: (seconds) =>
    set({ restTimerEnd: new Date(Date.now() + seconds * 1000).toISOString() }),

  clearRestTimer: () => set({ restTimerEnd: null }),

  setGymId: (gymId) => set({ gymId }),

  finishWorkout: () => {
    const s = get();
    if (!s.isActive || !s.startedAt) return null;

    const now = new Date().toISOString();
    const duration = Math.round((new Date(now).getTime() - new Date(s.startedAt).getTime()) / 1000);

    const workoutExercises: WorkoutExercise[] = s.exercises
      .filter((e) => e.sets.some((set) => set.isCompleted))
      .map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets
          .filter((set) => set.isCompleted)
          .map<CompletedSet>((set) => ({
            weight: set.weight,
            reps: set.reps,
            isWarmup: set.isWarmup,
            isPR: false,
            timestamp: now,
          })),
      }));

    const totalVolume = workoutExercises.reduce(
      (sum, e) => sum + e.sets.reduce((s, set) => s + set.weight * set.reps, 0),
      0
    );

    const session: WorkoutSession = {
      id: `w-${Date.now()}`,
      routineId: s.routineId,
      routineName: s.routineName,
      gymId: s.gymId,
      startedAt: s.startedAt,
      completedAt: now,
      exercises: workoutExercises,
      totalVolume,
      duration,
    };

    set(initialState);
    return session;
  },
}));
