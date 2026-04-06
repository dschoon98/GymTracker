import { Exercise, Gym, Routine, WorkoutSession } from './types';

// ── Gyms ──
export const seedGyms: Gym[] = [
  { id: 'gym-1', name: 'Iron Paradise', isDefault: true },
  { id: 'gym-2', name: 'City Fitness', isDefault: false },
];

// ── Exercises (ExerciseDB format) ──
export const seedExercises: Exercise[] = [
  {
    id: '0001',
    name: 'Barbell Bench Press',
    bodyPart: 'chest',
    target: 'pectorals',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/I-nh7OJVbl3Mv8',
    secondaryMuscles: ['triceps', 'anterior deltoids'],
    instructions: ['Lie on bench', 'Grip barbell slightly wider than shoulders', 'Lower to chest', 'Press up'],
  },
  {
    id: '0002',
    name: 'Barbell Squat',
    bodyPart: 'upper legs',
    target: 'quads',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/8VORi3VMU6Dymr',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    instructions: ['Bar on upper back', 'Feet shoulder-width apart', 'Squat to parallel', 'Drive up through heels'],
  },
  {
    id: '0003',
    name: 'Deadlift',
    bodyPart: 'back',
    target: 'spine',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/UnfKmyJKr4hBD6',
    secondaryMuscles: ['glutes', 'hamstrings', 'forearms'],
    instructions: ['Stand with feet hip-width', 'Bend at hips and knees to grip bar', 'Lift by extending hips and knees', 'Lock out at top'],
  },
  {
    id: '0004',
    name: 'Overhead Press',
    bodyPart: 'shoulders',
    target: 'deltoids',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/GNztqH1yEWVnLk',
    secondaryMuscles: ['triceps', 'upper chest'],
    instructions: ['Stand with bar at shoulders', 'Press overhead', 'Lock out arms', 'Lower with control'],
  },
  {
    id: '0005',
    name: 'Barbell Row',
    bodyPart: 'back',
    target: 'upper back',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/IOI-VEjfFLhYpd',
    secondaryMuscles: ['biceps', 'rear deltoids'],
    instructions: ['Hinge at hips', 'Pull bar to lower chest', 'Squeeze shoulder blades', 'Lower with control'],
  },
  {
    id: '0006',
    name: 'Dumbbell Curl',
    bodyPart: 'upper arms',
    target: 'biceps',
    equipment: 'dumbbell',
    gifUrl: 'https://v2.exercisedb.io/image/1vSMPYyfdQjVDo',
    secondaryMuscles: ['forearms'],
    instructions: ['Stand with dumbbells at sides', 'Curl up with control', 'Squeeze at top', 'Lower slowly'],
  },
  {
    id: '0007',
    name: 'Tricep Pushdown',
    bodyPart: 'upper arms',
    target: 'triceps',
    equipment: 'cable',
    gifUrl: 'https://v2.exercisedb.io/image/D1JOI5UYEY1hMb',
    secondaryMuscles: [],
    instructions: ['Grip cable bar', 'Push down until arms are straight', 'Squeeze triceps', 'Return with control'],
  },
  {
    id: '0008',
    name: 'Lat Pulldown',
    bodyPart: 'back',
    target: 'lats',
    equipment: 'cable',
    gifUrl: 'https://v2.exercisedb.io/image/d4pLnqvLH0QHMA',
    secondaryMuscles: ['biceps', 'rear deltoids'],
    instructions: ['Grip bar wide', 'Pull down to upper chest', 'Squeeze lats', 'Return with control'],
  },
  {
    id: '0009',
    name: 'Leg Press',
    bodyPart: 'upper legs',
    target: 'quads',
    equipment: 'machine',
    gifUrl: 'https://v2.exercisedb.io/image/sOU-h78XUBMFL9',
    secondaryMuscles: ['glutes', 'hamstrings'],
    instructions: ['Sit in machine', 'Place feet shoulder-width on platform', 'Press until legs extended', 'Lower with control'],
  },
  {
    id: '0010',
    name: 'Romanian Deadlift',
    bodyPart: 'upper legs',
    target: 'hamstrings',
    equipment: 'barbell',
    gifUrl: 'https://v2.exercisedb.io/image/SJz4-5f29OFZy2',
    secondaryMuscles: ['glutes', 'lower back'],
    instructions: ['Hold bar at hips', 'Hinge at hips keeping legs slightly bent', 'Lower bar along legs', 'Drive hips forward to return'],
  },
  {
    id: '0011',
    name: 'Lateral Raise',
    bodyPart: 'shoulders',
    target: 'deltoids',
    equipment: 'dumbbell',
    gifUrl: 'https://v2.exercisedb.io/image/xc9JjU0IKBdsJr',
    secondaryMuscles: ['traps'],
    instructions: ['Hold dumbbells at sides', 'Raise arms to sides until parallel', 'Lower with control'],
  },
  {
    id: '0012',
    name: 'Incline Dumbbell Press',
    bodyPart: 'chest',
    target: 'pectorals',
    equipment: 'dumbbell',
    gifUrl: 'https://v2.exercisedb.io/image/h09pu3d9-pQQjL',
    secondaryMuscles: ['triceps', 'anterior deltoids'],
    instructions: ['Set bench to 30-45 degrees', 'Press dumbbells up', 'Lower to chest', 'Press up'],
  },
  {
    id: '0013',
    name: 'Cable Fly',
    bodyPart: 'chest',
    target: 'pectorals',
    equipment: 'cable',
    gifUrl: 'https://v2.exercisedb.io/image/VTiDrKzS04DCWV',
    secondaryMuscles: ['anterior deltoids'],
    instructions: ['Stand between cables', 'Bring hands together in arc', 'Squeeze chest', 'Return with control'],
  },
  {
    id: '0014',
    name: 'Leg Curl',
    bodyPart: 'upper legs',
    target: 'hamstrings',
    equipment: 'machine',
    gifUrl: 'https://v2.exercisedb.io/image/9nUP-bJWQD2E2z',
    secondaryMuscles: ['calves'],
    instructions: ['Lie face down on machine', 'Curl weight up', 'Squeeze hamstrings', 'Lower with control'],
  },
  {
    id: '0015',
    name: 'Calf Raise',
    bodyPart: 'lower legs',
    target: 'calves',
    equipment: 'machine',
    gifUrl: 'https://v2.exercisedb.io/image/K7bOB-rnhNAuWm',
    secondaryMuscles: [],
    instructions: ['Stand on platform', 'Rise onto toes', 'Squeeze calves at top', 'Lower slowly'],
  },
  {
    id: '0016',
    name: 'Face Pull',
    bodyPart: 'shoulders',
    target: 'rear deltoids',
    equipment: 'cable',
    gifUrl: 'https://v2.exercisedb.io/image/DCDFA3kBt0VrKl',
    secondaryMuscles: ['traps', 'rhomboids'],
    instructions: ['Cable at face height', 'Pull rope to face', 'Externally rotate at end', 'Return with control'],
  },
];

// ── Routines ──
export const seedRoutines: Routine[] = [
  {
    id: 'routine-1',
    name: 'Push Day',
    createdAt: '2026-03-01T10:00:00Z',
    lastPerformedAt: '2026-03-26T08:00:00Z',
    exercises: [
      { exerciseId: '0001', targetSets: 4, targetReps: 8, notes: '', order: 0 },
      { exerciseId: '0012', targetSets: 3, targetReps: 10, notes: 'Slow negatives', order: 1 },
      { exerciseId: '0004', targetSets: 3, targetReps: 8, notes: '', order: 2 },
      { exerciseId: '0013', targetSets: 3, targetReps: 12, notes: '', order: 3 },
      { exerciseId: '0011', targetSets: 3, targetReps: 15, notes: '', order: 4 },
      { exerciseId: '0007', targetSets: 3, targetReps: 12, notes: '', order: 5 },
    ],
  },
  {
    id: 'routine-2',
    name: 'Pull Day',
    createdAt: '2026-03-01T10:00:00Z',
    lastPerformedAt: '2026-03-25T08:00:00Z',
    exercises: [
      { exerciseId: '0003', targetSets: 4, targetReps: 5, notes: '', order: 0 },
      { exerciseId: '0005', targetSets: 4, targetReps: 8, notes: '', order: 1 },
      { exerciseId: '0008', targetSets: 3, targetReps: 10, notes: '', order: 2 },
      { exerciseId: '0006', targetSets: 3, targetReps: 12, notes: '', order: 3 },
      { exerciseId: '0016', targetSets: 3, targetReps: 15, notes: '', order: 4 },
    ],
  },
  {
    id: 'routine-3',
    name: 'Leg Day',
    createdAt: '2026-03-01T10:00:00Z',
    lastPerformedAt: '2026-03-24T08:00:00Z',
    exercises: [
      { exerciseId: '0002', targetSets: 4, targetReps: 6, notes: 'Belt on working sets', order: 0 },
      { exerciseId: '0009', targetSets: 3, targetReps: 10, notes: '', order: 1 },
      { exerciseId: '0010', targetSets: 3, targetReps: 10, notes: '', order: 2 },
      { exerciseId: '0014', targetSets: 3, targetReps: 12, notes: '', order: 3 },
      { exerciseId: '0015', targetSets: 4, targetReps: 15, notes: '', order: 4 },
    ],
  },
  {
    id: 'routine-4',
    name: 'Upper Body',
    createdAt: '2026-03-10T10:00:00Z',
    lastPerformedAt: null,
    exercises: [
      { exerciseId: '0001', targetSets: 3, targetReps: 8, notes: '', order: 0 },
      { exerciseId: '0005', targetSets: 3, targetReps: 8, notes: '', order: 1 },
      { exerciseId: '0004', targetSets: 3, targetReps: 10, notes: '', order: 2 },
      { exerciseId: '0008', targetSets: 3, targetReps: 10, notes: '', order: 3 },
      { exerciseId: '0006', targetSets: 2, targetReps: 12, notes: '', order: 4 },
      { exerciseId: '0007', targetSets: 2, targetReps: 12, notes: '', order: 5 },
    ],
  },
];

// ── Workout History (dummy: 3 weeks of PPL split across 2 gyms) ──
function makeDate(daysAgo: number): string {
  const d = new Date('2026-03-28T08:00:00Z');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function makeEnd(daysAgo: number, durationMin: number): string {
  const d = new Date('2026-03-28T08:00:00Z');
  d.setDate(d.getDate() - daysAgo);
  d.setMinutes(d.getMinutes() + durationMin);
  return d.toISOString();
}

export const seedHistory: WorkoutSession[] = [
  // Week 1 (most recent)
  {
    id: 'w-01', routineId: 'routine-1', routineName: 'Push Day', gymId: 'gym-1',
    startedAt: makeDate(2), completedAt: makeEnd(2, 62), duration: 3720, totalVolume: 14250,
    exercises: [
      { exerciseId: '0001', sets: [
        { weight: 80, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(2) },
        { weight: 80, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(2) },
        { weight: 82.5, reps: 6, isWarmup: false, isPR: true, timestamp: makeDate(2) },
        { weight: 75, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(2) },
      ]},
      { exerciseId: '0012', sets: [
        { weight: 28, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(2) },
        { weight: 28, reps: 9, isWarmup: false, isPR: false, timestamp: makeDate(2) },
        { weight: 26, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(2) },
      ]},
      { exerciseId: '0004', sets: [
        { weight: 50, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(2) },
        { weight: 50, reps: 7, isWarmup: false, isPR: false, timestamp: makeDate(2) },
        { weight: 47.5, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(2) },
      ]},
    ],
  },
  {
    id: 'w-02', routineId: 'routine-2', routineName: 'Pull Day', gymId: 'gym-1',
    startedAt: makeDate(3), completedAt: makeEnd(3, 58), duration: 3480, totalVolume: 12800,
    exercises: [
      { exerciseId: '0003', sets: [
        { weight: 120, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(3) },
        { weight: 120, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(3) },
        { weight: 125, reps: 4, isWarmup: false, isPR: true, timestamp: makeDate(3) },
        { weight: 110, reps: 6, isWarmup: false, isPR: false, timestamp: makeDate(3) },
      ]},
      { exerciseId: '0005', sets: [
        { weight: 70, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(3) },
        { weight: 70, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(3) },
        { weight: 70, reps: 7, isWarmup: false, isPR: false, timestamp: makeDate(3) },
      ]},
    ],
  },
  {
    id: 'w-03', routineId: 'routine-3', routineName: 'Leg Day', gymId: 'gym-2',
    startedAt: makeDate(4), completedAt: makeEnd(4, 55), duration: 3300, totalVolume: 16200,
    exercises: [
      { exerciseId: '0002', sets: [
        { weight: 100, reps: 6, isWarmup: false, isPR: false, timestamp: makeDate(4) },
        { weight: 100, reps: 6, isWarmup: false, isPR: false, timestamp: makeDate(4) },
        { weight: 105, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(4) },
        { weight: 95, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(4) },
      ]},
      { exerciseId: '0009', sets: [
        { weight: 180, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(4) },
        { weight: 180, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(4) },
        { weight: 200, reps: 8, isWarmup: false, isPR: true, timestamp: makeDate(4) },
      ]},
    ],
  },
  // Week 2
  {
    id: 'w-04', routineId: 'routine-1', routineName: 'Push Day', gymId: 'gym-2',
    startedAt: makeDate(7), completedAt: makeEnd(7, 60), duration: 3600, totalVolume: 13500,
    exercises: [
      { exerciseId: '0001', sets: [
        { weight: 77.5, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(7) },
        { weight: 77.5, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(7) },
        { weight: 80, reps: 6, isWarmup: false, isPR: false, timestamp: makeDate(7) },
        { weight: 72.5, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(7) },
      ]},
      { exerciseId: '0012', sets: [
        { weight: 26, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(7) },
        { weight: 26, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(7) },
        { weight: 24, reps: 12, isWarmup: false, isPR: false, timestamp: makeDate(7) },
      ]},
    ],
  },
  {
    id: 'w-05', routineId: 'routine-2', routineName: 'Pull Day', gymId: 'gym-1',
    startedAt: makeDate(9), completedAt: makeEnd(9, 55), duration: 3300, totalVolume: 11600,
    exercises: [
      { exerciseId: '0003', sets: [
        { weight: 115, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(9) },
        { weight: 115, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(9) },
        { weight: 120, reps: 4, isWarmup: false, isPR: false, timestamp: makeDate(9) },
      ]},
      { exerciseId: '0005', sets: [
        { weight: 67.5, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(9) },
        { weight: 67.5, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(9) },
        { weight: 67.5, reps: 7, isWarmup: false, isPR: false, timestamp: makeDate(9) },
      ]},
    ],
  },
  {
    id: 'w-06', routineId: 'routine-3', routineName: 'Leg Day', gymId: 'gym-1',
    startedAt: makeDate(10), completedAt: makeEnd(10, 50), duration: 3000, totalVolume: 15000,
    exercises: [
      { exerciseId: '0002', sets: [
        { weight: 97.5, reps: 6, isWarmup: false, isPR: false, timestamp: makeDate(10) },
        { weight: 97.5, reps: 6, isWarmup: false, isPR: false, timestamp: makeDate(10) },
        { weight: 100, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(10) },
        { weight: 90, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(10) },
      ]},
    ],
  },
  // Week 3
  {
    id: 'w-07', routineId: 'routine-1', routineName: 'Push Day', gymId: 'gym-1',
    startedAt: makeDate(14), completedAt: makeEnd(14, 58), duration: 3480, totalVolume: 12800,
    exercises: [
      { exerciseId: '0001', sets: [
        { weight: 75, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(14) },
        { weight: 75, reps: 8, isWarmup: false, isPR: false, timestamp: makeDate(14) },
        { weight: 77.5, reps: 6, isWarmup: false, isPR: false, timestamp: makeDate(14) },
        { weight: 70, reps: 10, isWarmup: false, isPR: false, timestamp: makeDate(14) },
      ]},
    ],
  },
  {
    id: 'w-08', routineId: 'routine-2', routineName: 'Pull Day', gymId: 'gym-2',
    startedAt: makeDate(16), completedAt: makeEnd(16, 52), duration: 3120, totalVolume: 10500,
    exercises: [
      { exerciseId: '0003', sets: [
        { weight: 110, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(16) },
        { weight: 110, reps: 5, isWarmup: false, isPR: false, timestamp: makeDate(16) },
        { weight: 115, reps: 4, isWarmup: false, isPR: false, timestamp: makeDate(16) },
      ]},
    ],
  },
];
