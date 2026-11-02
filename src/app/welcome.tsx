import { router, useLocalSearchParams } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { BeaconMark } from '@/components/ui/beacon-mark';
import { BottomBar } from '@/components/ui/bottom-bar';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { createSampleCase } from '@/features/cases/case-service';
import {
  BeaconArt,
  EvidenceArt,
  NextStepArt,
  RecordArt,
  ReminderArt,
} from '@/features/onboarding/walkthrough-art';
import { setPreference } from '@/features/settings/preferences-repository';
import { haptics } from '@/lib/haptics';
import { showError } from '@/lib/dialogs';
import { useTheme } from '@/theme/use-theme';
import { spacing } from '@/theme/tokens';

interface Page {
  label: string;
  title: string;
  body: string;
  art: ReactNode;
}

const PAGES: readonly Page[] = [
  {
    label: 'Welcome',
    title: 'A clear next step for stuck refunds.',
    body: 'Refund Beacon keeps each return in one place, so you always know what happened and what to do next.',
    art: <BeaconArt />,
  },
  {
    label: 'Record the return',
    title: 'Log it in under 90 seconds.',
    body: 'Add the retailer, item, amount and dates. Note how you sent it back, the carrier and the tracking number.',
    art: <RecordArt />,
  },
  {
    label: 'Keep the evidence',
    title: 'Proof, all in one case.',
    body: 'Attach receipts, return labels, tracking screenshots and retailer messages. A checklist shows what’s missing.',
    art: <EvidenceArt />,
  },
  {
    label: 'Know the next step',
    title: 'One suggestion, with the reasons.',
    body: 'Each case suggests a next step and the facts behind it. Draft a polite follow-up in seconds; you choose whether to send it.',
    art: <NextStepArt />,
  },
  {
    label: 'Stay on top of it',
    title: 'Reminders, kept private.',
    body: 'Set a reminder for the day to check in. Everything stays on this device. Refund Beacon doesn’t issue refunds or contact retailers for you.',
    art: <ReminderArt />,
  },
];

/**
 * First-launch walkthrough, also reachable from Settings with `replay=1`. Pages swipe
 * horizontally; the art drifts and fades with the finger, and the dots stretch toward the page.
 */
export default function WelcomeScreen() {
  const { replay } = useLocalSearchParams<{ replay?: string }>();
  const replaying = replay === '1';
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const [page, setPage] = useState(0);
  const last = page === PAGES.length - 1;

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.set(event.contentOffset.x);
  });

  const goTo = (next: number) => {
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    if (next !== page) haptics.select();
    setPage(next);
  };

  const finishOnboarding = () => setPreference('onboarding-complete', true);

  const createFirstCase = () => {
    finishOnboarding();
    router.replace('/');
    router.push('/case/new');
  };

  const exploreSample = () => {
    try {
      const id = createSampleCase();
      finishOnboarding();
      router.replace('/');
      router.push({ pathname: '/case/[id]', params: { id } });
    } catch (error) {
      showError('Couldn’t create the sample case', error);
    }
  };

  const close = () => {
    if (replaying) {
      router.back();
      return;
    }
    goTo(PAGES.length - 1);
  };

  return (
    <Screen
      scroll={false}
      header={
        <View style={styles.topBar}>
          <BeaconMark />
          {replaying || !last ? (
            <Pressable
              accessibilityRole="button"
              onPress={close}
              hitSlop={12}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <AppText variant="bodyStrong" tone="muted">
                {replaying ? 'Close' : 'Skip'}
              </AppText>
            </Pressable>
          ) : null}
        </View>
      }
      footer={
        <BottomBar>
          <View style={styles.actions}>
            <Dots count={PAGES.length} scrollX={scrollX} width={width} />
            {!last ? (
              <Button
                label="Next"
                icon="next"
                iconPlacement="tile"
                onPress={() => goTo(page + 1)}
              />
            ) : replaying ? (
              <Button
                label="Done"
                icon="check"
                iconPlacement="tile"
                onPress={() => router.back()}
              />
            ) : (
              <>
                <Button
                  label="Create my first case"
                  icon="next"
                  iconPlacement="tile"
                  onPress={createFirstCase}
                />
                <Button
                  label="Explore a sample case"
                  variant="secondary"
                  size="medium"
                  onPress={exploreSample}
                />
              </>
            )}
          </View>
        </BottomBar>
      }
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x / width);
          if (next !== page) {
            haptics.select();
            setPage(next);
          }
        }}
        style={{ backgroundColor: colors.background }}
      >
        {PAGES.map((item, index) => (
          <PageView key={item.label} page={item} index={index} scrollX={scrollX} width={width} />
        ))}
      </Animated.ScrollView>
    </Screen>
  );
}

interface PageViewProps {
  page: Page;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}

function PageView({ page, index, scrollX, width }: PageViewProps) {
  const artStyle = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.get(), range, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(scrollX.get(), range, [width * 0.35, 0, -width * 0.35]) },
        { scale: interpolate(scrollX.get(), range, [0.92, 1, 0.92], Extrapolation.CLAMP) },
      ],
    };
  });
  const textStyle = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return { opacity: interpolate(scrollX.get(), range, [0, 1, 0], Extrapolation.CLAMP) };
  });

  return (
    <View style={[styles.page, { width }]}>
      <Animated.View style={[styles.art, artStyle]}>{page.art}</Animated.View>
      <Animated.View style={[styles.copy, textStyle]}>
        <AppText variant="label" tone="muted">
          {`0${index + 1} / 0${PAGES.length} · ${page.label}`}
        </AppText>
        <AppText variant="headline" accessibilityRole="header">
          {page.title}
        </AppText>
        <AppText variant="body" tone="muted">
          {page.body}
        </AppText>
      </Animated.View>
    </View>
  );
}

interface DotsProps {
  count: number;
  scrollX: SharedValue<number>;
  width: number;
}

function Dots({ count, scrollX, width }: DotsProps) {
  return (
    <View
      style={styles.dots}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} width={width} />
      ))}
    </View>
  );
}

function Dot({ index, scrollX, width }: Omit<DotsProps, 'count'> & { index: number }) {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.get(), range, [6, 24, 6], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.get(), range, [0.35, 1, 0.35], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, { backgroundColor: colors.ink }, style]} />;
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  pressed: { opacity: 0.55 },
  page: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.xl },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  copy: { gap: spacing.sm },
  actions: { flex: 1, gap: spacing.md },
  dots: { flexDirection: 'row', alignSelf: 'center', gap: 6, paddingBottom: spacing.xs },
  dot: { height: 6, borderRadius: 3 },
});
