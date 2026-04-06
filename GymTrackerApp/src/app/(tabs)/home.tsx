import GradientButton from '@/components/GradientButton';
import StatCard from '@/components/StatCard';
import WorkoutCard from '@/components/WorkoutCard';
import { useAppTheme } from '@/constants/theme';
import { ActiveExercise } from '@/data/types';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useGymStore } from '@/stores/gymStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useRoutineStore } from '@/stores/routineStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { colors, headers, fonts } = useAppTheme();
  const { isActive: isWorkoutActive, startWorkout } = useWorkoutStore();
  const routines = useRoutineStore((s) => s.routines);
  // Select stable sessions reference; derive computed values in useMemo
  // to avoid Zustand getSnapshot infinite-loop (calling functions in selectors
  // returns a new object/array on every render).
  const sessions = useHistoryStore((s) => s.sessions);
  const getWeeklyStats = useHistoryStore((s) => s.getWeeklyStats);
  const recentSessions = useMemo(() => sessions.slice(0, 3), [sessions]);
  const weeklyStats = useMemo(() => getWeeklyStats(), [sessions, getWeeklyStats]);
  const { defaultGymId, getGym } = useGymStore();
  const getExercise = useExerciseStore((s) => s.getExercise);

  const defaultGym = getGym(defaultGymId);

  const handleQuickStart = (routineId: string) => {
    if (isWorkoutActive) return;
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    const exercises: ActiveExercise[] = routine.exercises.map((re) => ({
      exerciseId: re.exerciseId,
      sets: Array.from({ length: re.targetSets }, () => ({
        weight: 0,
        reps: re.targetReps,
        isWarmup: false,
        isCompleted: false,
      })),
    }));

    startWorkout({
      routineId: routine.id,
      routineName: routine.name,
      gymId: defaultGymId,
      exercises,
    });
  };

  const handleEmptyWorkout = () => {
    if (isWorkoutActive) return;
    startWorkout({
      routineId: null,
      routineName: 'Quick Workout',
      gymId: defaultGymId,
      exercises: [],
    });
  };

  const durationHours = Math.round(weeklyStats.totalDuration / 3600 * 10) / 10;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Gym indicator */}
      {defaultGym && (
        <View style={styles.gymIndicator}>
          <View style={[styles.gymDot, { backgroundColor: colors.brand.primary }]} />
          <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 13 }]}>
            {defaultGym.name}
          </Text>
        </View>
      )}

      {/* Hero */}
      <Text style={[headers.h1, { color: colors.onSurface.primary, marginBottom: 4 }]}>
        {getGreeting()} 💪
      </Text>
      <Text style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 15, marginBottom: 20 }]}>
        {isWorkoutActive ? 'Workout in progress — keep going!' : 'Ready to crush it today?'}
      </Text>

      {!isWorkoutActive && (
        <GradientButton
          title="Start Empty Workout"
          onPress={handleEmptyWorkout}
          variant="primary"
          size="large"
          style={{ marginBottom: 20 }}
        />
      )}

      {/* Quick start chips */}
      {!isWorkoutActive && routines.length > 0 && (
        <>
          <Text style={[headers.h4, { color: colors.onSurface.secondary, marginBottom: 8 }]}>
            Quick Start
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {routines.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => handleQuickStart(r.id)}
                style={[styles.chip, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}
              >
                <Text style={[fonts.medium, { color: colors.onSurface.primary, fontSize: 14 }]}>{r.name}</Text>
                <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 11 }]}>
                  {r.exercises.length} exercises
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      {/* Weekly stats */}
      <Text style={[headers.h3, { color: colors.onSurface.primary, marginTop: 24, marginBottom: 10 }]}>
        This Week
      </Text>
      <View style={styles.statsRow}>
        <StatCard label="Workouts" value={weeklyStats.workouts} icon="🏋️" />
        <StatCard label="Volume" value={weeklyStats.totalVolume >= 1000 ? `${(weeklyStats.totalVolume / 1000).toFixed(1)}k` : weeklyStats.totalVolume} icon="📊" />
        <StatCard label="Hours" value={durationHours} icon="⏱️" />
        <StatCard label="Streak" value={weeklyStats.streak} icon="🔥" accentColor={colors.accent.primary} />
      </View>

      {/* Recent workouts */}
      {recentSessions.length > 0 && (
        <>
          <Text style={[headers.h3, { color: colors.onSurface.primary, marginTop: 24, marginBottom: 10 }]}>
            Recent Workouts
          </Text>
          {recentSessions.map((session) => {
            const gymName = getGym(session.gymId)?.name ?? 'Unknown';
            const exerciseNames = session.exercises
              .map((e) => getExercise(e.exerciseId)?.name ?? 'Unknown')
              .slice(0, 3);
            return (
              <View key={session.id} style={{ marginBottom: 12 }}>
                <WorkoutCard session={session} gymName={gymName} exerciseNames={exerciseNames} />
              </View>
            );
          })}
        </>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  gymIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  gymDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipRow: {
    gap: 10,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});