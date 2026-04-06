import WorkoutCard from '@/components/WorkoutCard';
import { useAppTheme } from '@/constants/theme';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useGymStore } from '@/stores/gymStore';
import { useHistoryStore } from '@/stores/historyStore';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HistoryScreen() {
  const { colors, headers, fonts } = useAppTheme();
  const sessions = useHistoryStore((s) => s.sessions);
  // Derive workoutDays from the stable sessions reference via useMemo;
  // calling getWorkoutDays() inside a Zustand selector returns a new Set every
  // render which violates getSnapshot's stability requirement.
  const workoutDays = useMemo(() => {
    const days = new Set<string>();
    sessions.forEach((s) => days.add(s.startedAt.slice(0, 10)));
    return days;
  }, [sessions]);
  const getGym = useGymStore((s) => s.getGym);
  const getExercise = useExerciseStore((s) => s.getExercise);

  // Calendar strip: last 28 days
  const calendarDays = useMemo(() => {
    const days: { date: Date; key: string; hasWorkout: boolean }[] = [];
    const today = new Date('2026-03-28');
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: d, key, hasWorkout: workoutDays.has(key) });
    }
    return days;
  }, [workoutDays]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[headers.h1, { color: colors.onSurface.primary, paddingTop: 16, paddingBottom: 12, paddingHorizontal: 20 }]}>
        History
      </Text>

      {/* Calendar strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.calendarStrip}
      >
        {calendarDays.map((day) => {
          const isToday = day.key === '2026-03-28';
          return (
            <View key={day.key} style={styles.calendarDay}>
              <Text style={[styles.dayLabel, { color: colors.onSurface.disabled, ...fonts.medium }]}>
                {DAY_LABELS[day.date.getDay()]}
              </Text>
              <View
                style={[
                  styles.dayCircle,
                  {
                    backgroundColor: day.hasWorkout
                      ? colors.brand.primary
                      : isToday
                        ? colors.surface.level2
                        : 'transparent',
                    borderWidth: isToday && !day.hasWorkout ? 1.5 : 0,
                    borderColor: colors.brand.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    {
                      color: day.hasWorkout
                        ? colors.onInteractive.primary
                        : isToday
                          ? colors.onSurface.primary
                          : colors.onSurface.secondary,
                      ...fonts.medium,
                    },
                  ]}
                >
                  {day.date.getDate()}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Workout list */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {sessions.map((session) => {
          const gymName = getGym(session.gymId)?.name ?? 'Unknown Gym';
          const exerciseNames = session.exercises
            .map((e) => getExercise(e.exerciseId)?.name ?? 'Unknown')
            .slice(0, 4);

          return (
            <WorkoutCard
              key={session.id}
              session={session}
              gymName={gymName}
              exerciseNames={exerciseNames}
            />
          );
        })}

        {sessions.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.surface.level1 }]}>
            <Text style={[headers.h3, { color: colors.onSurface.secondary, textAlign: 'center' }]}>
              No workouts yet
            </Text>
            <Text style={[fonts.regular, { color: colors.onSurface.disabled, textAlign: 'center', marginTop: 8, fontSize: 14 }]}>
              Complete your first workout to see it here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  calendarStrip: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 4,
  },
  calendarDay: {
    alignItems: 'center',
    width: 40,
  },
  dayLabel: { fontSize: 10, marginBottom: 4 },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: { fontSize: 13 },
  list: { paddingHorizontal: 20, paddingBottom: 100, gap: 12 },
  empty: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 40,
  },
});
