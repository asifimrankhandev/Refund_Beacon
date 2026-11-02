import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/ui/tab-bar';
import type { IconName } from '@/components/ui/icon';
import { selectPendingReminders } from '@/features/reminders/reminder-repository';
import { usePreferences } from '@/features/settings/preferences-repository';
import { endOfDay, useNow } from '@/lib/use-now';
import { useTheme } from '@/theme/use-theme';

const TAB_ICONS: Record<string, IconName> = {
  index: 'cases',
  reminders: 'clock',
  archive: 'archive',
  settings: 'settings',
};

export default function TabsLayout() {
  const { colors } = useTheme();
  const preferences = usePreferences();
  const now = useNow();
  const { data: pending } = useLiveQuery(selectPendingReminders());

  if (!preferences['onboarding-complete']) return <Redirect href="/welcome" />;

  const dueBy = endOfDay(now);
  const badges = { reminders: pending.filter((row) => row.reminder.scheduledAt <= dueBy).length };

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} icons={TAB_ICONS} badges={badges} />}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Cases' }} />
      <Tabs.Screen name="reminders" options={{ title: 'Reminders' }} />
      <Tabs.Screen name="archive" options={{ title: 'Archive' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
