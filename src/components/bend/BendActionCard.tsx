/**
 * Hero calculator card for Bend Pro field mode.
 *
 * Combines the main action/result with the compact visual reference so each
 * future bend calculator can follow the same screen pattern.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

import { BendVisual, type BendVisualType } from './BendVisual';

export type BendActionCardProps = {
  title: string;
  primaryValue: string;
  primaryUnit?: string;
  helperText: string;
  bendType: BendVisualType;
  mark1Label: string;
  mark1Value: string;
  mark2Label: string;
  mark2Value: string;
  distanceValue: string;
  angleDeg: number;
  shrinkValue: string;
  shrinkHelperText: string;
  layoutValue: string;
  layoutHelperText: string;
  isEmpty?: boolean;
  onPress?: () => void;
};

export function BendActionCard({
  title,
  primaryValue,
  primaryUnit,
  helperText,
  bendType,
  mark1Label,
  mark1Value,
  mark2Label,
  mark2Value,
  distanceValue,
  angleDeg,
  shrinkValue,
  shrinkHelperText,
  layoutValue,
  layoutHelperText,
  isEmpty = false,
  onPress,
}: BendActionCardProps) {
  const content = (
    <>
      <View style={styles.resultBlock}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.primaryValue}>{primaryValue}</Text>
          {primaryUnit ? <Text style={styles.primaryUnit}>{primaryUnit}</Text> : null}
        </View>
        <Text style={styles.helper}>{helperText}</Text>
      </View>

      <View style={styles.divider} />

      <BendVisual
        bendType={bendType}
        mark1Label={mark1Label}
        mark1Value={mark1Value}
        mark2Label={mark2Label}
        mark2Value={mark2Value}
        distanceValue={distanceValue}
        angleDeg={angleDeg}
        isEmpty={isEmpty}
      />

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>↕</Text>
          <View style={styles.metaText}>
            <Text style={styles.metaLabel}>SHRINK</Text>
            <Text style={styles.metaValue}>{shrinkValue}</Text>
            {shrinkHelperText ? <Text style={styles.metaHelper}>{shrinkHelperText}</Text> : null}
          </View>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⌁</Text>
          <View style={styles.metaText}>
            <Text style={styles.metaLabel}>{layoutValue || '2-Bend Offset'}</Text>
            <Text style={styles.metaHelper}>{layoutHelperText}</Text>
          </View>
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`View ${title} layout`}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface2,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  cardPressed: {
    opacity: 0.92,
  },
  resultBlock: {
    gap: spacing.xs,
  },
  title: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  primaryValue: {
    fontSize: 46,
    lineHeight: 50,
    fontWeight: '800',
    color: colors.primary,
  },
  primaryUnit: {
    ...typography.resultUnit,
    color: colors.muted,
  },
  helper: {
    ...typography.body,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryBorder,
  },
  metaRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  metaDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  metaIcon: {
    width: 24,
    color: colors.primary,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  metaText: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    ...typography.tabLabel,
    color: colors.muted,
  },
  metaValue: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
  },
  metaHelper: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
});
