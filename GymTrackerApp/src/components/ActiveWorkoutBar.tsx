import { useAppTheme } from '@/constants/theme';
import { useWorkoutStore } from '@/stores/workoutStore';
import { Ionicons } from '@expo/vector-icons';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Standard native tab bar heights
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 120;
const BAR_BOTTOM_MARGIN = 10;
// Dot + ring size
const DOT_SIZE = 10;
const RING_SIZE = 22;

export default function ActiveWorkoutBar() {
  const { colors, fonts } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isActive, routineName, startedAt } = useWorkoutStore();

  // Live elapsed timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!isActive || !startedAt) {
      setElapsed(0);
      return;
    }
    const tick = () =>
      setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isActive, startedAt]);

  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  const timeLabel = `${min}:${sec.toString().padStart(2, '0')}`;

  // Slide animation
  const slideAnim = useRef(new Animated.Value(120)).current;
  const [shouldRender, setShouldRender] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 120,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start(() => setShouldRender(false));
    }
  }, [isActive]);

  // Ping/sonar ring: scale 0.5→1.8, opacity 0.8→0, repeating
  const ringScale = useRef(new Animated.Value(0.5)).current;
  const ringOpacity = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    if (!isActive) return;
    const fullLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.8, duration: 1100, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0, duration: 1100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.8, duration: 0, useNativeDriver: true }),
        ]),
        Animated.delay(300),
      ])
    );
    fullLoop.start();
    return () => fullLoop.stop();
  }, [isActive]);

  if (!shouldRender) return null;

  const bottomOffset = insets.bottom + TAB_BAR_HEIGHT + BAR_BOTTOM_MARGIN;

  return (
    <Animated.View
      style={[styles.wrapper, { bottom: bottomOffset, transform: [{ translateY: slideAnim }] }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => TrueSheet.present('active-workout-sheet')}
        style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bar}
        >
          {/* Sonar dot */}
          <View style={styles.dotContainer}>
            <Animated.View
              style={[
                styles.ring,
                {
                  borderColor: 'rgba(255,255,255,0.7)',
                  opacity: ringOpacity,
                  transform: [{ scale: ringScale }],
                },
              ]}
            />
            <View style={[styles.dot, { backgroundColor: '#fff' }]} />
          </View>

          <Text
            style={[fonts.medium, styles.name, { color: '#fff' }]}
            numberOfLines={1}
          >
            {routineName || 'Workout in progress'}
          </Text>
          <Text style={[fonts.bold, styles.timer, { color: '#fff' }]}>
            {timeLabel}
          </Text>
          <Ionicons name="chevron-up" size={18} color="rgba(255,255,255,0.8)" />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 999,
  },
  pressable: {
    borderRadius: 18,
    // Colored shadow — brand blue
    shadowColor: 'hsl(200, 90%, 42%)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 18,
    overflow: 'hidden',
  },
  dotContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1.5,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  timer: {
    fontSize: 16,
  },
});
