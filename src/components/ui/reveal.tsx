import { type ReactNode, useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export interface RevealProps {
  children: ReactNode;
  /** Position in a list: staggers entrances so content settles top to bottom. */
  index?: number;
  style?: StyleProp<ViewStyle>;
}

const STAGGER_MS = 45;
const MAX_STAGGER = 8;

/**
 * Entrance motion for content blocks: a short fade-and-rise, staggered by position. It follows
 * the system Reduce Motion setting. Driven by a shared value rather than a layout `entering`
 * animation: on Android those sometimes never start for a screen mounted mid-transition, which
 * left content invisible. No layout transitions: they cost frames in long scroll views.
 */
export function Reveal({ children, index = 0, style }: RevealProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        Math.min(index, MAX_STAGGER) * STAGGER_MS,
        withTiming(1, {
          duration: 320,
          easing: Easing.out(Easing.cubic),
          reduceMotion: ReduceMotion.System,
        }),
      ),
    );
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: 12 * (1 - progress.get()) }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
