import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export type MeasurementChipTone = 'default' | 'primary' | 'warning';

export type MeasurementChipProps = {
  label: string;
  value: string;
  tone?: MeasurementChipTone;
  onPress?: () => void;
};

const toneStyles: Record<MeasurementChipTone, { border: string; bg: string; label: string; value: string }> = {
  default: {
    border: colors.border,
    bg: colors.surface,
    label: colors.muted,
    value: colors.text,
  },
  primary: {
    border: colors.primaryBorder,
    bg: colors.primaryMuted,
    label: colors.primary,
    value: colors.primary,
  },
  warning: {
    border: colors.warning,
    bg: 'rgba(245, 158, 11, 0.12)',
    label: colors.warning,
    value: colors.text,
  },
};

/** Compact label + value chip for marks, distances, and secondary results. */
export function MeasurementChip({ label, value, tone = 'default', onPress }: MeasurementChipProps) {
  const palette = toneStyles[tone];
  const content = (
    <View style={[styles.chip, { borderColor: palette.border, backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
      <Text style={[styles.value, { color: palette.value }]}>{value}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 88,
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  label: {
    ...typography.tabLabel,
  },
  value: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.9,
  },
});
