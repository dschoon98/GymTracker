import { useAppTheme } from '@/constants/theme';
import { ActiveSet } from '@/data/types';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type SetInputRowProps = {
  setIndex: number;
  set: ActiveSet;
  onUpdate: (updates: Partial<ActiveSet>) => void;
  onComplete: () => void;
  onRemove: () => void;
};

export default function SetInputRow({ setIndex, set, onUpdate, onComplete, onRemove }: SetInputRowProps) {
  const { colors, fonts } = useAppTheme();

  return (
    <View style={[styles.row, { backgroundColor: set.isCompleted ? colors.accent.secondary + '12' : 'transparent' }]}>
      <Text style={[styles.setNum, fonts.medium, { color: set.isWarmup ? colors.accent.primary : colors.onSurface.secondary }]}>
        {set.isWarmup ? 'W' : setIndex + 1}
      </Text>

      <TextInput
        style={[styles.input, { color: colors.onSurface.primary, backgroundColor: colors.surface.level2, borderColor: colors.border.subtle, ...fonts.medium }]}
        value={set.weight > 0 ? String(set.weight) : ''}
        onChangeText={(t) => onUpdate({ weight: parseFloat(t) || 0 })}
        placeholder="kg"
        placeholderTextColor={colors.onSurface.disabled}
        keyboardType="numeric"
        editable={!set.isCompleted}
      />

      <Text style={[{ color: colors.onSurface.disabled, fontSize: 16 }]}>×</Text>

      <TextInput
        style={[styles.input, { color: colors.onSurface.primary, backgroundColor: colors.surface.level2, borderColor: colors.border.subtle, ...fonts.medium }]}
        value={set.reps > 0 ? String(set.reps) : ''}
        onChangeText={(t) => onUpdate({ reps: parseInt(t, 10) || 0 })}
        placeholder="reps"
        placeholderTextColor={colors.onSurface.disabled}
        keyboardType="numeric"
        editable={!set.isCompleted}
      />

      <Pressable
        onPress={onComplete}
        disabled={set.isCompleted}
        style={[
          styles.checkButton,
          {
            backgroundColor: set.isCompleted ? colors.accent.secondary : colors.interactive.secondary,
            borderColor: set.isCompleted ? colors.accent.secondary : colors.border.default,
          },
        ]}
      >
        <Text style={{ color: set.isCompleted ? colors.onAccent.secondary : colors.onSurface.secondary, fontSize: 14 }}>
          ✓
        </Text>
      </Pressable>

      <Pressable onPress={onRemove} style={styles.removeButton}>
        <Text style={{ color: colors.onSurface.disabled, fontSize: 12 }}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  setNum: {
    width: 24,
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  checkButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  removeButton: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
