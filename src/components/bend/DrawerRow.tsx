/**
 * Figma: DrawerRow — collapsible / navigational optional sections.
 */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing, touchTarget } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type DrawerRowVariant = 'default' | 'primary';

export type DrawerRowProps = {
  title: string;
  subtitle?: string;
  isExpanded?: boolean;
  icon?: ReactNode;
  onPress: () => void;
  variant?: DrawerRowVariant;
  trailingLabel?: string;
};

export function DrawerRow({
  title,
  subtitle,
  isExpanded = false,
  icon,
  onPress,
  variant = 'default',
  trailingLabel,
}: DrawerRowProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isPrimary && styles.rowPrimary,
        pressed && styles.rowPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}>
      <View style={styles.left}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <View style={styles.textBlock}>
          <Text style={[styles.title, isPrimary && styles.titlePrimary]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.right}>
        {trailingLabel ? (
          <Text style={[styles.trailing, isPrimary && styles.trailingPrimary]}>
            {trailingLabel}
          </Text>
        ) : null}
        {trailingLabel === '+' ? null : (
          <Text style={[styles.chevron, isExpanded && styles.chevronExpanded]}>
            {isExpanded ? '⌄' : '›'}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: touchTarget + spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  rowPrimary: {
    backgroundColor: colors.surface,
    borderColor: colors.primaryBorder,
  },
  rowPressed: {
    opacity: 0.9,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  titlePrimary: {
    color: colors.primary,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.muted,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  trailing: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '500',
    color: colors.primary,
  },
  trailingPrimary: {
    color: colors.primary,
  },
  chevron: {
    fontSize: 26,
    lineHeight: 28,
    color: colors.muted,
  },
  chevronExpanded: {
    transform: [{ rotate: '0deg' }],
  },
});
