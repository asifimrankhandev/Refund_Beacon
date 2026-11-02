import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { StatusTag } from '@/components/ui/status-tag';
import { useTheme } from '@/theme/use-theme';
import { radius, spacing } from '@/theme/tokens';

/**
 * Miniature versions of real Refund Beacon screens for the walkthrough. They are decorative:
 * each page's text says the same thing for screen readers.
 */

function Frame({ children }: { children: React.ReactNode }) {
  const { colors, scheme } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.frame,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          boxShadow:
            scheme === 'dark'
              ? '0 18px 40px -16px rgba(0,0,0,0.9)'
              : '0 2px 6px rgba(15,15,15,0.05), 0 24px 44px -20px rgba(15,15,15,0.35)',
        },
      ]}
    >
      {children}
    </View>
  );
}

/** The beacon from the app icon: a rising half-sun over receipt lines. */
export function BeaconArt() {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.beacon}
    >
      <View style={[styles.glow, { backgroundColor: colors.accentHalo }]} />
      <View style={[styles.sun, { backgroundColor: colors.accent }]} />
      {[148, 104, 60].map((width) => (
        <View key={width} style={[styles.ray, { width, backgroundColor: colors.ink }]} />
      ))}
    </View>
  );
}

export function RecordArt() {
  const { colors } = useTheme();
  return (
    <Frame>
      <AppText variant="label" tone="muted">
        Northwind Outdoor · NW-48213
      </AppText>
      <View style={styles.rowBetween}>
        <AppText variant="heading" style={styles.flex}>
          Trail running shoes
        </AppText>
        <AppText variant="subheading">$129.00</AppText>
      </View>
      <View style={styles.tagRow}>
        <StatusTag label="Return in transit" />
      </View>
      <View style={[styles.facts, { borderTopColor: colors.line }]}>
        <Fact icon="calendar" label="Ordered" value="Oct 4" />
        <Fact icon="truck" label="Handed to UPS" value="Oct 14" />
      </View>
      <View style={styles.progress}>
        {[colors.ink, colors.ink, colors.accent, colors.line].map((color, index) => (
          <View key={index} style={[styles.segment, { backgroundColor: color }]} />
        ))}
      </View>
    </Frame>
  );
}

function Fact({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.fact}>
      <Icon name={icon} size={16} color={colors.muted} />
      <AppText variant="caption" tone="muted" style={styles.flex}>
        {label}
      </AppText>
      <AppText variant="mono">{value}</AppText>
    </View>
  );
}

export function EvidenceArt() {
  const { colors } = useTheme();
  const items = [
    { label: 'Purchase receipt', done: true },
    { label: 'Return label', done: true },
    { label: 'Tracking screenshot', done: true },
    { label: 'Retailer messages', done: false },
  ];
  return (
    <Frame>
      <View style={styles.rowBetween}>
        <AppText variant="label" tone="muted">
          Evidence
        </AppText>
        <AppText variant="label">3 / 4</AppText>
      </View>
      {items.map((item) => (
        <View key={item.label} style={[styles.check, { borderBottomColor: colors.line }]}>
          <View
            style={[
              styles.box,
              item.done
                ? { backgroundColor: colors.ink, borderColor: colors.ink }
                : { borderColor: colors.faint },
            ]}
          >
            {item.done ? <Icon name="check" size={14} color={colors.onInk} /> : null}
          </View>
          <AppText variant="bodyStrong" tone={item.done ? 'ink' : 'muted'} style={styles.flex}>
            {item.label}
          </AppText>
          {item.done ? null : (
            <View style={[styles.addChip, { borderColor: colors.ink }]}>
              <AppText variant="small" style={styles.addText}>
                Add
              </AppText>
            </View>
          )}
        </View>
      ))}
    </Frame>
  );
}

export function NextStepArt() {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.frame, styles.inkFrame, { backgroundColor: colors.inverseSurface }]}
    >
      <View style={styles.eyebrow}>
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <AppText variant="label" style={{ color: colors.inverseText }}>
          Next step
        </AppText>
      </View>
      <AppText variant="heading" style={{ color: colors.inverseText }}>
        Contact the retailer
      </AppText>
      <View style={[styles.why, { borderTopColor: colors.inverseLine }]}>
        {['Expected refund Oct 28 (retailer message)', 'No refund recorded since then'].map(
          (line) => (
            <AppText key={line} variant="caption" style={{ color: colors.inverseMuted }}>
              {`•  ${line}`}
            </AppText>
          ),
        )}
      </View>
      <View style={[styles.cta, { backgroundColor: colors.accent }]}>
        <AppText variant="bodyStrong" style={{ color: colors.onAccent }}>
          Draft follow-up
        </AppText>
      </View>
    </View>
  );
}

export function ReminderArt() {
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      <Frame>
        <View style={styles.rowBetween}>
          <StatusTag label="Follow up" tone="accent" />
          <AppText variant="mono" tone="muted">
            Due 9:00 AM
          </AppText>
        </View>
        <AppText variant="heading">Contact Northwind Outdoor</AppText>
        <AppText variant="caption" tone="muted">
          Trail running shoes
        </AppText>
      </Frame>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.privacy, { backgroundColor: colors.surfaceMuted }]}
      >
        <Icon name="shield" size={18} color={colors.ink} />
        <AppText variant="caption" style={styles.flex}>
          Stored only on this device. No account.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  frame: {
    width: '100%',
    maxWidth: 340,
    padding: spacing.xl,
    gap: spacing.sm,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  inkFrame: { gap: spacing.md, borderWidth: 0 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tagRow: { flexDirection: 'row' },
  facts: { borderTopWidth: 1, marginTop: spacing.xs, paddingTop: spacing.md, gap: spacing.sm },
  fact: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progress: { flexDirection: 'row', gap: 4, marginTop: spacing.sm },
  segment: { flex: 1, height: 3, borderRadius: 2 },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addChip: { borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 4 },
  addText: { fontWeight: '600' },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  why: { borderTopWidth: 1, paddingTop: spacing.md, gap: spacing.xs },
  cta: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  stack: { width: '100%', maxWidth: 340, gap: spacing.md },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
  },
  beacon: { alignItems: 'center', gap: 10, paddingTop: spacing.xl },
  glow: { position: 'absolute', top: -20, width: 260, height: 260, borderRadius: 130 },
  sun: { width: 180, height: 90, borderTopLeftRadius: 90, borderTopRightRadius: 90 },
  ray: { height: 12, borderRadius: 6 },
});
