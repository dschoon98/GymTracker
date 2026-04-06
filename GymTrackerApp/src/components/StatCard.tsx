import { useAppTheme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: string;
  accentColor?: string;
};

export default function StatCard({ label, value, icon, accentColor }: StatCardProps) {
  const { colors, fonts, headers } = useAppTheme();
  const accent = accentColor ?? colors.brand.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
      {icon && (
        <Text style={[styles.icon, { color: accent }]}>{icon}</Text>
      )}
      <Text style={[headers.h2, { color: colors.onSurface.primary, fontSize: 22 }]}>
        {value}
      </Text>
      <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 11, marginTop: 2 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
});
