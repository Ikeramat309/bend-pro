/**
 * Figma: navigation/AppTopBar — screen header with optional back, title, actions.
 */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { layout, spacing, touchTarget } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type AppTopBarProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: ReactNode;
  onRightPress?: () => void;
};

export function AppTopBar({
  title,
  subtitle,
  badge,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
}: AppTopBarProps) {
  const insets = useSafeAreaInsets();

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
      <View style={styles.row}>
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
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ) : null}
            </View>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
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
  subtitle: {
    ...typography.subtitle,
    color: colors.muted,
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
