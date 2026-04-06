import RoutineCard from '@/components/RoutineCard';
import { useAppTheme } from '@/constants/theme';
import { ActiveExercise } from '@/data/types';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useGymStore } from '@/stores/gymStore';
import { useRoutineStore } from '@/stores/routineStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RoutinesScreen() {
  const { colors, headers, fonts } = useAppTheme();
  const { routines, deleteRoutine } = useRoutineStore();
  const getExercise = useExerciseStore((s) => s.getExercise);
  const { startWorkout, isActive } = useWorkoutStore();
  const defaultGymId = useGymStore((s) => s.defaultGymId);
  const router = useRouter();

  const handleStartWorkout = (routineId: string) => {
    if (isActive) return;
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

  const handleEdit = (routineId: string) => {
    router.push({ pathname: '/(modals)/routine-editor', params: { routineId } });
  };

  const handleCreate = () => {
    router.push({ pathname: '/(modals)/routine-editor' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[headers.h1, { color: colors.onSurface.primary }]}>Routines</Text>
        <Pressable
          onPress={handleCreate}
          style={[styles.addButton, { backgroundColor: colors.brand.primary }]}
        >
          <Text style={[fonts.bold, { color: colors.onInteractive.primary, fontSize: 14 }]}>+ New</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {routines.map((routine) => {
          const exerciseNames = routine.exercises
            .map((re) => getExercise(re.exerciseId)?.name ?? 'Unknown')
            .slice(0, 3);

          return (
            <RoutineCard
              key={routine.id}
              routine={routine}
              exerciseNames={exerciseNames}
              totalExercises={routine.exercises.length}
              onStart={() => handleStartWorkout(routine.id)}
              onEdit={() => handleEdit(routine.id)}
              onDelete={() => deleteRoutine(routine.id)}
              disabled={isActive}
            />
          );
        })}

        {routines.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.surface.level1 }]}>
            <Text style={[headers.h3, { color: colors.onSurface.secondary, textAlign: 'center' }]}>
              No routines yet
            </Text>
            <Text style={[fonts.regular, { color: colors.onSurface.disabled, textAlign: 'center', marginTop: 8, fontSize: 14 }]}>
              Create your first routine to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  list: { paddingBottom: 100, gap: 12 },
  empty: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 40,
  },
});
