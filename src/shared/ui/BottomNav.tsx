import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing, touchTarget, typography } from '@/theme';

export type BendTabId = 'layout' | 'bends' | 'benders' | 'guide';

export type BottomNavProps = {
  activeTab: BendTabId;
  onTabChange: (tab: BendTabId) => void;
};

const TABS: { id: BendTabId; label: string; icon: string }[] = [
  { id: 'layout', label: 'Layout', icon: '▦' },
  { id: 'bends', label: 'Bends', icon: '⚡' },
  { id: 'benders', label: 'Benders', icon: '🔧' },
  { id: 'guide', label: 'Guide', icon: '📖' },
];

/** Main hub bottom navigation. */
export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          backgroundColor: colors.screen,
          borderTopColor: colors.border,
        },
      ]}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => {
                if (!active) {
                  onTabChange(tab.id);
                }
              }}
              style={[styles.tab, active && styles.tabActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.tabIcon, { color: active ? colors.primary : colors.muted }]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, { color: active ? colors.primary : colors.muted }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    minHeight: layout.bottomNavHeight,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: colors.primaryMuted,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    ...typography.tabLabel,
  },
});
