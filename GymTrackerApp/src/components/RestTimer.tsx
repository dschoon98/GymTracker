import { useAppTheme } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RestTimerProps = {
  endTime: string;
  onDismiss: () => void;
};

export default function RestTimer({ endTime, onDismiss }: RestTimerProps) {
  const { colors, fonts } = useAppTheme();
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const left = Math.max(0, Math.round((new Date(endTime).getTime() - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    update();
    intervalRef.current = setInterval(update, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTime]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface.level2, borderColor: colors.border.default }]}>
      <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 12 }]}>REST</Text>
      <Text style={[fonts.bold, { color: remaining > 0 ? colors.brand.primary : colors.accent.secondary, fontSize: 28 }]}>
        {remaining > 0 ? display : 'Go!'}
      </Text>
      <Pressable onPress={onDismiss} style={[styles.skipButton, { backgroundColor: colors.interactive.secondary }]}>
        <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 13 }]}>Skip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
});
