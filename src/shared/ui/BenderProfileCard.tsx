import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BenderProfile } from '@/data/benders';
import { formatChartKindLabel, formatProfileStub90Summary } from '@/data/benders';
import { colors, spacing, uiTheme } from '@/theme';

import { HubStatusBadge } from './HubStatusBadge';

export type BenderProfileCardProps = {
  profile: BenderProfile;
  isActive: boolean;
  onSelect: () => void;
  onViewChart?: () => void;
  onEdit?: () => void;
};

function formatCategory(category: BenderProfile['category']): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/** Selectable bender profile card for the bender database hub. */
export function BenderProfileCard({
  profile,
  isActive,
  onSelect,
  onViewChart,
  onEdit,
}: BenderProfileCardProps) {
  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <Pressable
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        style={({ pressed }) => [styles.body, pressed && styles.pressed]}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{profile.name}</Text>
            <Text style={styles.category}>{formatCategory(profile.category)}</Text>
            <Text style={styles.chartKind}>{formatChartKindLabel(profile.chartKind)}</Text>
          </View>
          {isActive ? <HubStatusBadge label="Active" tone="primary" /> : null}
        </View>

        <Text style={styles.description}>{profile.description}</Text>
        <Pressable
          onPress={onViewChart ?? onSelect}
          accessibilityRole="button"
          accessibilityLabel={`View ${profile.name} chart`}
          style={({ pressed }) => [styles.deductRow, pressed && styles.pressed]}>
          <View style={styles.deductText}>
            <Text style={styles.deductLabel}>Stub 90 deduct</Text>
            <Text style={styles.deductValue}>{formatProfileStub90Summary(profile)}</Text>
          </View>
          {onViewChart ? <Text style={styles.chartLink}>Chart ›</Text> : null}
        </Pressable>
      </Pressable>

      {onEdit ? (
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${profile.name}`}
          style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: uiTheme.benderCard.borderRadius,
    borderWidth: 1,
    borderColor: uiTheme.benderCard.borderColor,
    backgroundColor: uiTheme.benderCard.backgroundColor,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: uiTheme.benderCard.activeBorderColor,
    backgroundColor: uiTheme.benderCard.activeBackgroundColor,
  },
  body: {
    gap: spacing.sm,
    padding: uiTheme.benderCard.padding,
  },
  pressed: {
    opacity: 0.88,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
  },
  category: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  chartKind: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  deductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deductText: {
    flex: 1,
    gap: 2,
  },
  deductLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.55,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  deductValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  chartLink: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.primary,
    flexShrink: 0,
  },
  editButton: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface2,
  },
  editText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
