import { router } from 'expo-router';
import { BottomTabBarHeightCallbackContext, type BottomTabBarProps } from 'expo-router/js-tabs';
import { use, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/use-theme';
import { fonts, spacing } from '@/theme/tokens';

import { AppText } from './app-text';
import { Icon, type IconName } from './icon';

export interface TabBarProps extends BottomTabBarProps {
  /** Icon for each route, keyed by route name. */
  icons: Readonly<Record<string, IconName>>;
  /** Optional count shown on a tab, keyed by route name; zero hides it. */
  badges?: Readonly<Record<string, number>>;
}

const BAR_HEIGHT = 62;
const BAR_PADDING = 5;
const BEACON_SIZE = BAR_HEIGHT;
/** How much wider the active tab grows than the others, to make room for its label. */
const ACTIVE_GROW = 2.5;
const LABEL_WIDTH = 92;
const FADE_HEIGHT = 64;
const SPRING = { damping: 20, stiffness: 240, mass: 0.8, reduceMotion: ReduceMotion.System };
const PRESS_SPRING = { damping: 14, stiffness: 400, reduceMotion: ReduceMotion.System };

/**
 * Glass capsule: a frosted floating bar of icons in which the active tab stretches into an ink
 * pill that names it, and a round orange beacon beside it that starts a new case.
 */
export function TabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
  icons,
  badges,
}: TabBarProps) {
  const { colors, scheme } = useTheme();
  const reportHeight = use(BottomTabBarHeightCallbackContext);
  const shadow =
    scheme === 'dark'
      ? '0 14px 30px -10px rgba(0,0,0,0.85)'
      : '0 2px 6px rgba(15,15,15,0.06), 0 18px 36px -14px rgba(15,15,15,0.4)';

  return (
    <View
      pointerEvents="box-none"
      onLayout={(event) => reportHeight?.(event.nativeEvent.layout.height)}
      style={[styles.outer, { paddingBottom: insets.bottom + spacing.md }]}
    >
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundImage: `linear-gradient(to bottom, transparent, ${colors.background} 45%)` },
        ]}
      />
      <View style={styles.row}>
        <View
          accessibilityRole="tablist"
          style={[
            styles.capsule,
            {
              backgroundColor: scheme === 'dark' ? 'rgba(34,34,31,0.94)' : 'rgba(255,255,255,0.94)',
              borderColor: colors.border,
              boxShadow: shadow,
            },
          ]}
        >
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            return (
              <TabItem
                key={route.key}
                label={descriptors[route.key]?.options.title ?? route.name}
                icon={icons[route.name] ?? 'more'}
                badge={badges?.[route.name] ?? 0}
                focused={focused}
                onPress={() => {
                  const event = emitter.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    haptics.select();
                    navigateToTab(route.key);
                  }
                }}
                onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              />
            );
          })}
        </View>
        <Beacon shadow={shadow} />
      </View>
    </View>
  );
}

interface TabItemProps {
  label: string;
  icon: IconName;
  badge: number;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ label, icon, badge, focused, onPress, onLongPress }: TabItemProps) {
  const { colors } = useTheme();
  const active = useSharedValue(focused ? 1 : 0);
  const press = useSharedValue(1);

  useEffect(() => {
    active.set(withSpring(focused ? 1 : 0, SPRING));
  }, [focused, active]);

  const slotStyle = useAnimatedStyle(() => ({
    flexGrow: 1 + (ACTIVE_GROW - 1) * active.get(),
    transform: [{ scale: press.get() }],
  }));
  const pillStyle = useAnimatedStyle(() => ({
    opacity: active.get(),
    transform: [{ scaleX: 0.6 + 0.4 * active.get() }],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    maxWidth: LABEL_WIDTH * active.get(),
    opacity: active.get(),
  }));

  return (
    <Animated.View style={[styles.slot, slotStyle]}>
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel={badge > 0 ? `${label}, ${badge} due` : label}
        accessibilityState={{ selected: focused }}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => press.set(withSpring(0.92, PRESS_SPRING))}
        onPressOut={() => press.set(withSpring(1, PRESS_SPRING))}
        style={styles.tab}
      >
        <Animated.View style={[styles.pill, { backgroundColor: colors.ink }, pillStyle]} />
        <View>
          <Icon name={icon} size={22} color={focused ? colors.accent : colors.muted} />
          {badge > 0 ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.accent, borderColor: colors.surface },
              ]}
            >
              <AppText style={[styles.badgeText, { color: colors.onAccent }]}>
                {badge > 9 ? '9+' : badge}
              </AppText>
            </View>
          ) : null}
        </View>
        <Animated.View style={[styles.labelClip, labelStyle]}>
          <AppText
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
            style={[styles.label, { color: colors.onInk }]}
          >
            {label}
          </AppText>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/** The round orange "+" beside the capsule; a faint ring leaves it now and then, like a beacon. */
function Beacon({ shadow }: { shadow: string }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  const press = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.set(
      withRepeat(
        withSequence(
          withDelay(3400, withTiming(1, { duration: 1700, easing: Easing.out(Easing.cubic) })),
          withTiming(0, { duration: 0 }),
        ),
        -1,
      ),
    );
  }, [reduceMotion, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: pulse.get() === 0 ? 0 : 0.5 * (1 - pulse.get()),
    transform: [{ scale: 1 + 0.4 * pulse.get() }],
  }));
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: press.get() }] }));

  return (
    <View>
      <Animated.View
        pointerEvents="none"
        style={[styles.ring, { borderColor: colors.accent }, ringStyle]}
      />
      <Animated.View style={pressStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New refund case"
          onPressIn={() => press.set(withSpring(0.9, PRESS_SPRING))}
          onPressOut={() => press.set(withSpring(1, PRESS_SPRING))}
          onPress={() => {
            haptics.tap();
            router.push('/case/new');
          }}
          style={[
            styles.beacon,
            {
              backgroundColor: colors.accent,
              boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.4), 0 12px 24px -10px ${colors.accent}, ${shadow}`,
            },
          ]}
        >
          <Icon name="add" size={28} color={colors.onAccent} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: FADE_HEIGHT,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  capsule: {
    flex: 1,
    flexDirection: 'row',
    height: BAR_HEIGHT,
    padding: BAR_PADDING,
    gap: 2,
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  slot: { flexBasis: 0 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  pill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: (BAR_HEIGHT - BAR_PADDING * 2) / 2,
  },
  labelClip: { overflow: 'hidden' },
  label: { fontFamily: fonts.semibold, fontSize: 13 },
  badge: {
    position: 'absolute',
    top: -7,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.semibold, fontSize: 10, lineHeight: 12 },
  ring: {
    position: 'absolute',
    width: BEACON_SIZE,
    height: BEACON_SIZE,
    borderRadius: BEACON_SIZE / 2,
    borderWidth: 2,
  },
  beacon: {
    width: BEACON_SIZE,
    height: BEACON_SIZE,
    borderRadius: BEACON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
