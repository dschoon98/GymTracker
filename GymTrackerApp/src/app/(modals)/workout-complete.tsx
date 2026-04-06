import GradientButton from '@/components/GradientButton';
import GymSelector from '@/components/GymSelector';
import { useAppTheme } from '@/constants/theme';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useRoutineStore } from '@/stores/routineStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function WorkoutCompleteModal() {
  const { colors, headers, fonts } = useAppTheme();
  const router = useRouter();
  const workoutStore = useWorkoutStore();
  const addSession = useHistoryStore((s) => s.addSession);
  const markPerformed = useRoutineStore((s) => s.markPerformed);
  const getExercise = useExerciseStore((s) => s.getExercise);

  const [selectedGymId, setSelectedGymId] = useState(workoutStore.gymId);

  const completedExercises = workoutStore.exercises.filter((e) => e.sets.some((s) => s.isCompleted));
  const totalSets = completedExercises.reduce((sum, e) => sum + e.sets.filter((s) => s.isCompleted).length, 0);
  const totalVolume = completedExercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.isCompleted).reduce((s2, set) => s2 + set.weight * set.reps, 0),
    0
  );
  const elapsed = workoutStore.startedAt
    ? Math.round((Date.now() - new Date(workoutStore.startedAt).getTime()) / 1000)
    : 0;
  const durationMin = Math.round(elapsed / 60);

  const handleSave = () => {
    // Update gym in store before finishing
    workoutStore.setGymId(selectedGymId);
    const session = workoutStore.finishWorkout();
    if (session) {
      // Override gymId with selected one
      const finalSession = { ...session, gymId: selectedGymId };
      addSession(finalSession);
      if (finalSession.routineId) {
        markPerformed(finalSession.routineId);
      }
    }
    router.back();
  };

  const handleDiscard = () => {
    workoutStore.cancelWorkout();
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface.level0 }]}>
      {/* Handle bar */}
      <View style={styles.handleBar}>
        <View style={[styles.handle, { backgroundColor: colors.onSurface.disabled }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[headers.h1, { color: colors.onSurface.primary, textAlign: 'center' }]}>
          Workout Complete! 🎉
        </Text>
        <Text style={[fonts.regular, { color: colors.onSurface.secondary, textAlign: 'center', marginTop: 4, fontSize: 15 }]}>
          {workoutStore.routineName}
        </Text>

        {/* Summary stats */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
          <View style={styles.summaryRow}>
            <SummaryStat label="Duration" value={`${durationMin}m`} colors={colors} fonts={fonts} />
            <SummaryStat label="Exercises" value={String(completedExercises.length)} colors={colors} fonts={fonts} />
            <SummaryStat label="Sets" value={String(totalSets)} colors={colors} fonts={fonts} />
            <SummaryStat label="Volume" value={totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : String(totalVolume)} colors={colors} fonts={fonts} />
          </View>
        </View>

        {/* Exercises performed */}
        <Text style={[headers.h3, { color: colors.onSurface.primary, marginTop: 20, marginBottom: 8 }]}>
          Exercises
        </Text>
        {completedExercises.map((ex, i) => {
          const info = getExercise(ex.exerciseId);
          const completedSets = ex.sets.filter((s) => s.isCompleted);
          return (
            <View key={i} style={[styles.exerciseRow, { borderBottomColor: colors.border.subtle }]}>
              <Text style={[fonts.medium, { color: colors.onSurface.primary, fontSize: 14, flex: 1 }]}>
                {info?.name ?? 'Exercise'}
              </Text>
              <Text style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 13 }]}>
                {completedSets.length} sets
              </Text>
            </View>
          );
        })}

        {/* Gym selector */}
        <Text style={[headers.h3, { color: colors.onSurface.primary, marginTop: 24, marginBottom: 8 }]}>
          Save to Gym
        </Text>
        <GymSelector selectedGymId={selectedGymId} onSelect={setSelectedGymId} />

        {/* Actions */}
        <View style={styles.actions}>
          <GradientButton title="Save Workout" onPress={handleSave} variant="primary" size="large" />
          <Pressable onPress={handleDiscard} style={styles.discardButton}>
            <Text style={[fonts.medium, { color: colors.feedback.error, fontSize: 14 }]}>Discard Workout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryStat({ label, value, colors, fonts }: { label: string; value: string; colors: any; fonts: any }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={[fonts.bold, { color: colors.onSurface.primary, fontSize: 20 }]}>{value}</Text>
      <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 11 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  handleBar: { alignItems: 'center', paddingTop: 12 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  summaryCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  actions: {
    marginTop: 32,
    gap: 12,
    alignItems: 'center',
  },
  discardButton: {
    paddingVertical: 10,
  },
});
