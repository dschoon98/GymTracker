import { useAppTheme } from '@/constants/theme';
import { Routine } from '@/data/types';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RoutineCardProps = {
  routine: Routine;
  exerciseNames: string[];
  totalExercises: number;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

export default function RoutineCard({
  routine,
  exerciseNames,
  totalExercises,
  onStart,
  onEdit,
  onDelete,
  disabled,
}: RoutineCardProps) {
  const { colors, fonts, headers } = useAppTheme();

  const lastPerformed = routine.lastPerformedAt
    ? formatRelativeDate(routine.lastPerformedAt)
    : 'Never';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={[headers.h3, { color: colors.onSurface.primary }]}>{routine.name}</Text>
          <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 12, marginTop: 2 }]}>
            {totalExercises} exercises · Last: {lastPerformed}
          </Text>
        </View>
        <Pressable
          onPress={onStart}
          disabled={disabled}
          style={[
            styles.startButton,
            { backgroundColor: disabled ? colors.interactive.disabled : colors.brand.primary },
          ]}
        >
          <Text style={[fonts.bold, { color: disabled ? colors.onInteractive.disabled : colors.onInteractive.primary, fontSize: 13 }]}>
            Start
          </Text>
        </Pressable>
      </View>

      <View style={[styles.exerciseList, { borderTopColor: colors.border.subtle }]}>
        {exerciseNames.map((name, i) => (
          <Text key={i} style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 13 }]}>
            • {name}
          </Text>
        ))}
        {totalExercises > exerciseNames.length && (
          <Text style={[fonts.regular, { color: colors.onSurface.disabled, fontSize: 12 }]}>
            +{totalExercises - exerciseNames.length} more
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.actionButton}>
          <Text style={[fonts.medium, { color: colors.brand.primary, fontSize: 13 }]}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={styles.actionButton}>
          <Text style={[fonts.medium, { color: colors.feedback.error, fontSize: 13 }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatRelativeDate(isoDate: string): string {
  const diff = new Date('2026-03-28').getTime() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  startButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exerciseList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 3,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 4,
  },
});
