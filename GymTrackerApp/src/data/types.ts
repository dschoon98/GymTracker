export type Gym = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
};

export type RoutineExercise = {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  notes: string;
  order: number;
};

export type Routine = {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
  lastPerformedAt: string | null;
};

export type CompletedSet = {
  weight: number;
  reps: number;
  isWarmup: boolean;
  isPR: boolean;
  timestamp: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  sets: CompletedSet[];
};

export type WorkoutSession = {
  id: string;
  routineId: string | null;
  routineName: string;
  gymId: string;
  startedAt: string;
  completedAt: string;
  exercises: WorkoutExercise[];
  totalVolume: number;
  duration: number; // in seconds
};

export type ActiveWorkoutState = {
  isActive: boolean;
  routineId: string | null;
  routineName: string;
  gymId: string;
  startedAt: string | null;
  exercises: ActiveExercise[];
  currentExerciseIndex: number;
  restTimerEnd: string | null;
};

export type ActiveExercise = {
  exerciseId: string;
  sets: ActiveSet[];
};

export type ActiveSet = {
  weight: number;
  reps: number;
  isWarmup: boolean;
  isCompleted: boolean;
};
