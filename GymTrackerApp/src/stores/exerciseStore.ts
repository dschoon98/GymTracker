import { seedExercises } from '@/data/seed';
import { Exercise } from '@/data/types';
import { create } from 'zustand';

type ExerciseStore = {
  exercises: Exercise[];
  getExercise: (id: string) => Exercise | undefined;
  searchExercises: (query: string) => Exercise[];
  getByBodyPart: (bodyPart: string) => Exercise[];
  bodyParts: () => string[];
};

export const useExerciseStore = create<ExerciseStore>((_, get) => ({
  exercises: seedExercises,

  getExercise: (id) => get().exercises.find((e) => e.id === id),

  searchExercises: (query) => {
    const q = query.toLowerCase();
    return get().exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.bodyPart.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q)
    );
  },

  getByBodyPart: (bodyPart) =>
    get().exercises.filter((e) => e.bodyPart.toLowerCase() === bodyPart.toLowerCase()),

  bodyParts: () => [...new Set(get().exercises.map((e) => e.bodyPart))],
}));
