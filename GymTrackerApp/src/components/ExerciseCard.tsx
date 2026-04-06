import { useAppTheme } from '@/constants/theme';
import { Exercise } from '@/data/types';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ExerciseCardProps = {
  exercise: Exercise;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

export default function ExerciseCard({ exercise, onPress, rightElement }: ExerciseCardProps) {
  const { colors, fonts } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}
    >
      <Image
        source={{ uri: exercise.gifUrl }}
        style={[styles.thumbnail, { backgroundColor: colors.surface.level2 }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.info}>
        <Text style={[fonts.medium, { color: colors.onSurface.primary, fontSize: 15 }]} numberOfLines={1}>
          {exercise.name}
        </Text>
        <Text style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 12, marginTop: 2 }]}>
          {capitalize(exercise.target)} · {capitalize(exercise.equipment)}
        </Text>
      </View>
      {rightElement}
    </Pressable>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
});
