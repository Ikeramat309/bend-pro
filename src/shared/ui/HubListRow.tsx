import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, uiTheme } from '@/theme';

import { HubStatusBadge } from './HubStatusBadge';

export type HubListRowProps = {
  title: string;
  description?: string;
  badge?: string;
  active?: boolean;
  dimmed?: boolean;
  isLast?: boolean;
  onPress: () => void;
};

export function HubListRow({
  title,
  description,
  badge,
  active = true,
  dimmed = false,
  isLast = false,
  onPress,
}: HubListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowBorder,
        dimmed && styles.rowDimmed,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button">
      <View style={styles.text}>
        <View style={styles.titleLine}>
          <Text style={styles.title}>{title}</Text>
          {badge ? <HubStatusBadge label={badge} tone="warning" /> : null}
        </View>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Text style={[styles.chevron, active ? styles.chevronActive : styles.chevronMuted]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: uiTheme.hub.listRow.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: uiTheme.hub.listRow.paddingHorizontal,
    paddingVertical: uiTheme.hub.listRow.paddingVertical,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowDimmed: {
    opacity: 0.72,
  },
  pressed: {
    opacity: 0.88,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  chevron: {
    fontSize: uiTheme.hub.chevronSize,
    lineHeight: 30,
  },
  chevronActive: {
    color: colors.primary,
  },
  chevronMuted: {
    color: colors.muted,
  },
});
