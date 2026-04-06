import { useAppTheme } from '@/constants/theme';
import { useGymStore } from '@/stores/gymStore';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type GymSelectorProps = {
  selectedGymId: string;
  onSelect: (gymId: string) => void;
  compact?: boolean;
};

export default function GymSelector({ selectedGymId, onSelect, compact }: GymSelectorProps) {
  const { colors, fonts } = useAppTheme();
  const gyms = useGymStore((s) => s.gyms);

  if (compact) {
    return (
      <View style={styles.compactRow}>
        {gyms.map((gym) => {
          const isSelected = gym.id === selectedGymId;
          return (
            <Pressable
              key={gym.id}
              onPress={() => onSelect(gym.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.brand.primary : colors.surface.level2,
                  borderColor: isSelected ? colors.brand.primary : colors.border.subtle,
                },
              ]}
            >
              <Text
                style={[
                  fonts.medium,
                  {
                    color: isSelected ? colors.onInteractive.primary : colors.onSurface.secondary,
                    fontSize: 12,
                  },
                ]}
              >
                {gym.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {gyms.map((gym) => {
        const isSelected = gym.id === selectedGymId;
        return (
          <Pressable
            key={gym.id}
            onPress={() => onSelect(gym.id)}
            style={[
              styles.button,
              {
                backgroundColor: isSelected ? colors.brand.primary : colors.surface.level1,
                borderColor: isSelected ? colors.brand.primary : colors.border.default,
              },
            ]}
          >
            <Text
              style={[
                fonts.medium,
                {
                  color: isSelected ? colors.onInteractive.primary : colors.onSurface.secondary,
                  fontSize: 14,
                },
              ]}
            >
              {gym.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
});
