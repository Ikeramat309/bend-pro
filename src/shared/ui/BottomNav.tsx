import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout, spacing, touchTarget, typography, useTheme, type ThemePalette } from '@/theme';

export type BendTabId = 'layout' | 'bends' | 'benders' | 'guide';

export type BottomNavProps = {
  activeTab: BendTabId;
  onTabChange: (tab: BendTabId) => void;
};

const TABS: { id: BendTabId; label: string }[] = [
  { id: 'layout', label: 'Layout' },
  { id: 'bends', label: 'Bends' },
  { id: 'benders', label: 'Benders' },
  { id: 'guide', label: 'Guide' },
];

/** Main hub bottom navigation. */
export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function makeStyles(colors: ThemePalette) {
  return StyleSheet.create({
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
      minHeight: touchTarget - 4,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      borderRadius: 8,
      marginHorizontal: 2,
    },
    tabActive: {
      backgroundColor: colors.primaryMuted,
    },
    tabLabel: {
      ...typography.tabLabel,
      color: colors.muted,
      fontWeight: '600',
      fontSize: 11,
      letterSpacing: 0.3,
    },
    tabLabelActive: {
      color: colors.primary,
      fontWeight: '700',
    },
  });
}
