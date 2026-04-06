import { useAppTheme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'success';
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
};

export default function GradientButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
  size = 'medium',
}: GradientButtonProps) {
  const { colors, fonts } = useAppTheme();
  const gradientColors = colors.gradients[variant] as [string, string];

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, fontSize: 13 },
    medium: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, fontSize: 15 },
    large: { paddingVertical: 18, paddingHorizontal: 36, borderRadius: 20, fontSize: 17 },
  }[size];

  if (disabled) {
    return (
      <Pressable
        style={[
          styles.button,
          { backgroundColor: colors.interactive.disabled, paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal, borderRadius: sizeStyles.borderRadius },
          style,
        ]}
        disabled
      >
        <Text style={[fonts.bold, { color: colors.onInteractive.disabled, fontSize: sizeStyles.fontSize }]}>
          {title}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal, borderRadius: sizeStyles.borderRadius },
        ]}
      >
        <Text style={[fonts.bold, { color: '#fff', fontSize: sizeStyles.fontSize }]}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
