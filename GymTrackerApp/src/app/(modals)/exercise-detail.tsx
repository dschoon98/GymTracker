import GymSelector from '@/components/GymSelector';
import { useAppTheme } from '@/constants/theme';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useGymStore } from '@/stores/gymStore';
import { useHistoryStore } from '@/stores/historyStore';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExerciseDetailModal() {
  const { colors, headers, fonts, isDark } = useAppTheme();
  const router = useRouter();
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  // Select the stable exercises array and derive the specific exercise in useMemo
  // to avoid calling a function inside the Zustand selector (returns new reference
  // on every render → getSnapshot infinite-loop).
  const exercises = useExerciseStore((s) => s.exercises);
  const exercise = useMemo(
    () => exercises.find((e) => e.id === (exerciseId ?? '')),
    [exercises, exerciseId]
  );
  const sessions = useHistoryStore((s) => s.sessions);
  const { defaultGymId, gyms, getGym } = useGymStore();

  const [selectedGymId, setSelectedGymId] = useState(defaultGymId);

  // Compute progression data for selected gym
  const progressionData = useMemo(() => {
    if (!exerciseId) return [];

    const relevantSessions = sessions.filter(
      (s) => s.gymId === selectedGymId && s.exercises.some((e) => e.exerciseId === exerciseId)
    );

    return relevantSessions
      .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
      .map((session) => {
        const ex = session.exercises.find((e) => e.exerciseId === exerciseId)!;
        // Estimated 1RM using Epley formula: weight * (1 + reps / 30)
        let best1RM = 0;
        ex.sets.forEach((set) => {
          if (!set.isWarmup) {
            const e1rm = set.weight * (1 + set.reps / 30);
            if (e1rm > best1RM) best1RM = e1rm;
          }
        });
        return {
          value: Math.round(best1RM * 10) / 10,
          label: new Date(session.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: session.startedAt,
        };
      });
  }, [exerciseId, selectedGymId, sessions]);

  // Recent sets for this exercise at selected gym
  const recentSets = useMemo(() => {
    if (!exerciseId) return [];

    return sessions
      .filter(
        (s) => s.gymId === selectedGymId && s.exercises.some((e) => e.exerciseId === exerciseId)
      )
      .slice(0, 5)
      .map((session) => {
        const ex = session.exercises.find((e) => e.exerciseId === exerciseId)!;
        const gymName = getGym(session.gymId)?.name ?? 'Unknown';
        return {
          date: new Date(session.startedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          gymName,
          sets: ex.sets.filter((s) => !s.isWarmup),
        };
      });
  }, [exerciseId, selectedGymId, sessions, getGym]);

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface.level0 }]}>
        <Text style={[headers.h2, { color: colors.onSurface.primary, padding: 20 }]}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface.level0 }]}>
      {/* Handle bar + close */}
      <View style={styles.topBar}>
        <View style={[styles.handle, { backgroundColor: colors.onSurface.disabled }]} />
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={[fonts.bold, { color: colors.onSurface.secondary, fontSize: 16 }]}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exercise GIF */}
        <View style={[styles.gifContainer, { backgroundColor: colors.surface.level1 }]}>
          <Image
            source={{ uri: exercise.gifUrl }}
            style={styles.gif}
            contentFit="contain"
            transition={300}
          />
        </View>

        {/* Metadata */}
        <Text style={[headers.h1, { color: colors.onSurface.primary, marginTop: 16 }]}>
          {exercise.name}
        </Text>
        <View style={styles.metaRow}>
          <MetaBadge label={exercise.bodyPart} colors={colors} fonts={fonts} />
          <MetaBadge label={exercise.target} colors={colors} fonts={fonts} />
          <MetaBadge label={exercise.equipment} colors={colors} fonts={fonts} />
        </View>

        {exercise.secondaryMuscles.length > 0 && (
          <Text style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 13, marginTop: 6 }]}>
            Secondary: {exercise.secondaryMuscles.join(', ')}
          </Text>
        )}

        {/* Gym selector for chart */}
        <Text style={[headers.h3, { color: colors.onSurface.primary, marginTop: 24, marginBottom: 8 }]}>
          Progression (Est. 1RM)
        </Text>
        <GymSelector selectedGymId={selectedGymId} onSelect={setSelectedGymId} compact />

        {/* Progression chart */}
        {progressionData.length > 1 ? (
          <View style={[styles.chartContainer, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
            <LineChart
              data={progressionData}
              width={SCREEN_WIDTH - 80}
              height={180}
              color={colors.brand.primary}
              dataPointsColor={colors.brand.primary}
              thickness={2}
              startFillColor={colors.brand.primary}
              startOpacity={0.15}
              endOpacity={0}
              areaChart
              curved
              yAxisTextStyle={{ color: colors.onSurface.disabled, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: colors.onSurface.disabled, fontSize: 9, rotation: 0 }}
              hideRules
              yAxisColor="transparent"
              xAxisColor={colors.border.subtle}
              noOfSections={4}
              spacing={(SCREEN_WIDTH - 100) / Math.max(progressionData.length - 1, 1)}
            />
          </View>
        ) : (
          <View style={[styles.noData, { backgroundColor: colors.surface.level1 }]}>
            <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 13, textAlign: 'center' }]}>
              {progressionData.length === 1
                ? 'Need at least 2 sessions to show a chart'
                : 'No data at this gym yet'}
            </Text>
          </View>
        )}

        {/* Recent history table */}
        {recentSets.length > 0 && (
          <>
            <Text style={[headers.h3, { color: colors.onSurface.primary, marginTop: 24, marginBottom: 8 }]}>
              Recent History
            </Text>
            {recentSets.map((entry, idx) => (
              <View key={idx} style={[styles.historyEntry, { borderBottomColor: colors.border.subtle }]}>
                <Text style={[fonts.medium, { color: colors.onSurface.primary, fontSize: 13, marginBottom: 4 }]}>
                  {entry.date}
                </Text>
                {entry.sets.map((set, si) => (
                  <Text key={si} style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 12 }]}>
                    {set.weight}kg × {set.reps} {set.isPR ? '🏆' : ''}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Instructions */}
        {exercise.instructions.length > 0 && (
          <>
            <Text style={[headers.h3, { color: colors.onSurface.primary, marginTop: 24, marginBottom: 8 }]}>
              Instructions
            </Text>
            {exercise.instructions.map((inst, i) => (
              <Text key={i} style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 14, marginBottom: 4 }]}>
                {i + 1}. {inst}
              </Text>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function MetaBadge({ label, colors, fonts }: { label: string; colors: any; fonts: any }) {
  return (
    <View style={[metaStyles.badge, { backgroundColor: colors.surface.level2 }]}>
      <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 12 }]}>
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    alignItems: 'center',
    paddingTop: 12,
    position: 'relative',
  },
  handle: { width: 40, height: 4, borderRadius: 2 },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 20, paddingTop: 12 },
  gifContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  gif: {
    width: '100%',
    height: 240,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  chartContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  noData: {
    marginTop: 12,
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
  },
  historyEntry: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});
