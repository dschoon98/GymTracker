import { useAppTheme } from '@/constants/theme';
import { WorkoutSession } from '@/data/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type WorkoutCardProps = {
  session: WorkoutSession;
  gymName: string;
  exerciseNames: string[];
};

export default function WorkoutCard({ session, gymName, exerciseNames }: WorkoutCardProps) {
  const { colors, fonts, headers } = useAppTheme();

  const date = new Date(session.startedAt);
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const durationMin = Math.round(session.duration / 60);
  const totalSets = session.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const hasPR = session.exercises.some((e) => e.sets.some((s) => s.isPR));

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={[headers.h3, { color: colors.onSurface.primary }]}>{session.routineName}</Text>
            {hasPR && (
              <View style={[styles.prBadge, { backgroundColor: colors.accent.primary + '20' }]}>
                <Text style={[fonts.bold, { color: colors.onAccent.primary, fontSize: 10 }]}>🏆 PR</Text>
              </View>
            )}
          </View>
          <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 12, marginTop: 2 }]}>
            {dateStr}
          </Text>
        </View>
        <View style={[styles.gymBadge, { backgroundColor: colors.brand.primary + '15' }]}>
          <Text style={[fonts.medium, { color: colors.onBrand.primary, fontSize: 11 }]}>{gymName}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[fonts.bold, { color: colors.onSurface.primary, fontSize: 15 }]}>{durationMin}m</Text>
          <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 10 }]}>Duration</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border.subtle }]} />
        <View style={styles.stat}>
          <Text style={[fonts.bold, { color: colors.onSurface.primary, fontSize: 15 }]}>{session.exercises.length}</Text>
          <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 10 }]}>Exercises</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border.subtle }]} />
        <View style={styles.stat}>
          <Text style={[fonts.bold, { color: colors.onSurface.primary, fontSize: 15 }]}>{totalSets}</Text>
          <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 10 }]}>Sets</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border.subtle }]} />
        <View style={styles.stat}>
          <Text style={[fonts.bold, { color: colors.onSurface.primary, fontSize: 15 }]}>
            {session.totalVolume >= 1000 ? `${(session.totalVolume / 1000).toFixed(1)}k` : session.totalVolume}
          </Text>
          <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 10 }]}>Volume (kg)</Text>
        </View>
      </View>

      <View style={[styles.exerciseList, { borderTopColor: colors.border.subtle }]}>
        {exerciseNames.map((name, i) => (
          <Text key={i} style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 13 }]}>
            • {name}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gymBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  exerciseList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 3,
  },
});
