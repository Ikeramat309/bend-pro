import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing, touchTarget, typography, workspaceTheme } from '@/theme';

export type AppHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: ReactNode;
  onRightPress?: () => void;
  /** Compact bar for calculator screens — saves vertical space for the pipe workspace. */
  density?: 'default' | 'compact';
};

/** Top app bar for calculator and hub screens. */
export function AppHeader({
  title,
  subtitle,
  badge,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  density = 'default',
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const compact = density === 'compact';

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.screen,
          borderBottomColor: colors.border,
        },
      ]}>
      <View style={[styles.row, compact && styles.rowCompact]}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              onPress={onBackPress}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
          ) : (
            <View style={styles.logoDot} />
          )}

            <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={1}>
                {title}
              </Text>
              {badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ) : null}
            </View>
            {subtitle ? (
              <Text style={[styles.subtitle, compact && styles.subtitleCompact]} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Menu">
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  row: {
    minHeight: layout.topBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowCompact: {
    minHeight: workspaceTheme.header.minHeight,
    paddingVertical: workspaceTheme.header.paddingVertical,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  titleCompact: {
    fontSize: workspaceTheme.header.titleSize,
    lineHeight: 22,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.muted,
  },
  subtitleCompact: {
    fontSize: workspaceTheme.header.subtitleSize,
    lineHeight: 16,
  },
  badge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
  },
  iconButton: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '600',
  },
});
