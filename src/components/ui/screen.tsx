import { useScrollToTop } from 'expo-router';
import { BottomTabBarHeightContext } from 'expo-router/js-tabs';
import { type ComponentRef, type ReactNode, use, useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/use-theme';
import { spacing } from '@/theme/tokens';

export interface ScreenProps {
  children: ReactNode;
  /** Fixed header rendered above the scrolling content. */
  header?: ReactNode;
  /** Sticky footer (actions); the content scrolls behind it. */
  footer?: ReactNode;
  /** Without scrolling, the children own their list padding (including tab bar clearance). */
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
}

/** Page scaffold: themed background, safe areas, keyboard avoidance and optional footer. */
export function Screen({
  children,
  header,
  footer,
  scroll = true,
  edges = ['top'],
  contentStyle,
}: ScreenProps) {
  const { colors } = useTheme();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  // Inside the tabs the floating tab bar overlaps the screen, so leave room to scroll past it.
  const tabBarHeight = use(BottomTabBarHeightContext) ?? 0;
  const tabBarClearance = tabBarHeight > 0 ? { paddingBottom: tabBarHeight + spacing.lg } : null;
  // Tapping the active tab again scrolls its root screen back to the top.
  useScrollToTop(scrollRef);
  const content = scroll ? (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[styles.scrollContent, contentStyle, tabBarClearance]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      contentInsetAdjustmentBehavior="never"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.fill, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.fill}
        // Edge-to-edge Android no longer resizes the window for the keyboard, so pad on both.
        behavior="padding"
      >
        {header}
        {content}
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.xl },
});
