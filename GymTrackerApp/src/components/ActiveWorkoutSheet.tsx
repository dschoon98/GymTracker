import RestTimer from '@/components/RestTimer';
import SetInputRow from '@/components/SetInputRow';
import { useAppTheme } from '@/constants/theme';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Mini bar: 14px handle area + 52px info row = 66px, fraction of screen

export default function ActiveWorkoutSheet() {
  const { colors, fonts, headers } = useAppTheme();
  const router = useRouter();
  const sheetRef = useRef<TrueSheet>(null);

  const {
    isActive,
    routineName,
    exercises,
    currentExerciseIndex,
    restTimerEnd,
    startedAt,
    setCurrentExercise,
    addSet,
    updateSet,
    completeSet,
    removeSet,
    startRestTimer,
    clearRestTimer,
    finishWorkout,
  } = useWorkoutStore();

  const getExercise = useExerciseStore((s) => s.getExercise);

  useEffect(() => {
    let mounted = true;

    const updateSheet = async () => {
      if (!mounted) return;
      try {
        if (isActive) {
          await sheetRef.current?.present();
        } else {
          await sheetRef.current?.dismiss();
        }
      } catch (error) {
        // Ignore errors if sheet is already in the requested state
        if (!mounted) return;
      }
    };

    updateSheet();

    return () => {
      mounted = false;
    };
  }, [isActive]);

  const handleFinish = useCallback(async () => {
    try {
      await sheetRef.current?.dismiss();
    } catch (error) {
      console.error('Error dismissing sheet:', error, 'swallowing and proceeding to complete workout');
    }
    router.push('/(modals)/workout-complete');
  }, [router]);

  const currentExercise = exercises[currentExerciseIndex];
  const exerciseInfo = currentExercise ? getExercise(currentExercise.exerciseId) : null;

  // Elapsed time
  const elapsed = startedAt
    ? Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)
    : 0;
  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = elapsed % 60;

  return (
    <TrueSheet
      ref={sheetRef}
      name="active-workout-sheet"
      detents={[0.92]}
      cornerRadius={16}
      grabber={false}
      backgroundBlur="dark"
      blurOptions={{
        intensity: 80,
        interaction: false,
      }}
      backgroundColor={Platform.OS === 'android' ? colors.background : undefined} // ios uses liquid glass effect
      dimmed
      dismissible={true}
    >
      {/* Custom handle + mini bar — always visible at collapsed size */}
      <Pressable onPress={() => sheetRef.current?.resize(1)} style={styles.miniBar}>
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: colors.onSurface.disabled }]} />
        </View>
        <View style={styles.miniBarContent}>
          <View style={[styles.activeDot, { backgroundColor: colors.accent.primary }]} />
          <Text style={[fonts.medium, { color: colors.onSurface.primary, fontSize: 14, flex: 1 }]} numberOfLines={1}>
            {routineName}{exerciseInfo ? ` — ${exerciseInfo.name}` : ''}
          </Text>
          <Text style={[fonts.medium, { color: colors.brand.primary, fontSize: 14 }]}>
            {elapsedMin}:{elapsedSec.toString().padStart(2, '0')}
          </Text>
        </View>
      </Pressable>

      {/* Expanded content — visible only when sheet is at full size */}
      <View style={styles.expandedContent}>
        {/* Exercise tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exerciseTabs}
        >
          {exercises.map((ex, i) => {
            const info = getExercise(ex.exerciseId);
            const isActiveTab = i === currentExerciseIndex;
            const allDone = ex.sets.every((s) => s.isCompleted);
            return (
              <Pressable
                key={i}
                onPress={() => setCurrentExercise(i)}
                style={[
                  styles.exerciseTab,
                  {
                    backgroundColor: isActiveTab ? colors.brand.primary : colors.surface.level2,
                    borderColor: allDone ? colors.accent.secondary : isActiveTab ? colors.brand.primary : colors.border.subtle,
                  },
                ]}
              >
                <Text
                  style={[
                    fonts.medium,
                    {
                      color: isActiveTab ? colors.onInteractive.primary : colors.onSurface.secondary,
                      fontSize: 12,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {info?.name ?? 'Exercise'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Rest timer */}
        {restTimerEnd && (
          <RestTimer endTime={restTimerEnd} onDismiss={clearRestTimer} />
        )}

        {/* Current exercise sets */}
        {currentExercise && exerciseInfo && (
          <View style={styles.exerciseSection}>
            <Text style={[headers.h2, { color: colors.onSurface.primary, marginBottom: 4 }]}>
              {exerciseInfo.name}
            </Text>
            <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 12, marginBottom: 12 }]}>
              {exerciseInfo.target} · {exerciseInfo.equipment}
            </Text>

            {/* Set header */}
            <View style={styles.setHeader}>
              <Text style={[styles.setHeaderText, fonts.medium, { color: colors.onSurface.disabled }]}>Set</Text>
              <Text style={[styles.setHeaderText, fonts.medium, { color: colors.onSurface.disabled, flex: 1 }]}>kg</Text>
              <Text style={[{ color: colors.onSurface.disabled, fontSize: 11 }]}>×</Text>
              <Text style={[styles.setHeaderText, fonts.medium, { color: colors.onSurface.disabled, flex: 1 }]}>Reps</Text>
              <View style={{ width: 58 }} />
            </View>

            <ScrollView style={styles.setList} showsVerticalScrollIndicator={false}>
              {currentExercise.sets.map((set, si) => (
                <SetInputRow
                  key={si}
                  setIndex={si}
                  set={set}
                  onUpdate={(updates) => updateSet(currentExerciseIndex, si, updates)}
                  onComplete={() => {
                    completeSet(currentExerciseIndex, si);
                    startRestTimer(90);
                  }}
                  onRemove={() => removeSet(currentExerciseIndex, si)}
                />
              ))}
            </ScrollView>

            <Pressable
              onPress={() => addSet(currentExerciseIndex)}
              style={[styles.addSetButton, { borderColor: colors.border.default }]}
            >
              <Text style={[fonts.medium, { color: colors.brand.primary, fontSize: 14 }]}>+ Add Set</Text>
            </Pressable>
          </View>
        )}

        {exercises.length === 0 && (
          <View style={styles.emptyExercise}>
            <Text style={[headers.h3, { color: colors.onSurface.secondary, textAlign: 'center' }]}>
              No exercises added
            </Text>
            <Text style={[fonts.regular, { color: colors.onSurface.disabled, textAlign: 'center', marginTop: 4, fontSize: 13 }]}>
              Start a workout from a routine to have pre-loaded exercises
            </Text>
          </View>
        )}

        {/* Finish button */}
        <View style={styles.finishRow}>
          <Pressable
            onPress={handleFinish}
            style={[styles.finishButton, { backgroundColor: colors.accent.primary }]}
          >
            <Text style={[fonts.bold, { color: '#fff', fontSize: 16 }]}>Finish Workout</Text>
          </Pressable>
        </View>
      </View>
    </TrueSheet>
  );
}

const styles = StyleSheet.create({
  miniBar: {
    // Total 68px: 16px handle + 52px info row
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  miniBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    height: 52,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  exerciseTabs: {
    gap: 8,
    paddingVertical: 8,
  },
  exerciseTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    maxWidth: 140,
  },
  exerciseSection: {
    marginTop: 8,
  },
  setHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 8,
    marginBottom: 6,
  },
  setHeaderText: {
    fontSize: 11,
    width: 24,
    textAlign: 'center',
  },
  setList: {
    maxHeight: SCREEN_HEIGHT * 0.38,
  },
  addSetButton: {
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    marginTop: 8,
  },
  emptyExercise: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  finishRow: {
    paddingVertical: 16,
  },
  finishButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
});
