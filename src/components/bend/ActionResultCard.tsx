/**
 * Figma: workbench/ResultCard → ActionResultCard — field-action results.
 */
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type ActionResultVariant = 'primary' | 'secondary' | 'mark';

export type ActionResultCardProps = {
  label: string;
  value: string;
  unit?: string;
  helperText: string;
  variant?: ActionResultVariant;
};

const valueColors: Record<ActionResultVariant, string> = {
  primary: colors.primary,
  mark: colors.mark,
  secondary: colors.text,
};

export function ActionResultCard({
  label,
  value,
  unit,
  helperText,
  variant = 'mark',
}: ActionResultCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: valueColors[variant] }]}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <Text style={styles.helper}>{helperText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.muted,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  value: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  unit: {
    ...typography.resultUnit,
    color: colors.muted,
  },
  helper: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
