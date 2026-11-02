import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { fonts, spacing } from '@/theme/tokens';

import { AppText } from './app-text';

/** Receipt lines under the beacon, longest first, as in the app icon. */
const LINE_WIDTHS = [20, 14, 8];

/** Wordmark: the app icon's beacon rising over receipt lines, then the name. */
export function BeaconMark() {
  const { colors } = useTheme();
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="header"
      accessibilityLabel="Refund Beacon"
    >
      <View style={styles.mark}>
        <View style={[styles.beacon, { backgroundColor: colors.accent }]} />
        {LINE_WIDTHS.map((width) => (
          <View key={width} style={[styles.line, { width, backgroundColor: colors.ink }]} />
        ))}
      </View>
      <AppText variant="subheading" style={styles.word}>
        Refund Beacon
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mark: { width: 20, alignItems: 'center', gap: 1.5 },
  beacon: { width: 20, height: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  line: { height: 2.5, borderRadius: 1.25 },
  word: { fontFamily: fonts.bold, fontSize: 17, letterSpacing: -0.4 },
});
