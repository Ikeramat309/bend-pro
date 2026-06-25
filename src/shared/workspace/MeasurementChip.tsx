import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export type MeasurementChipTone = 'default' | 'primary' | 'warning';

export type MeasurementChipProps = {
  label: string;
  value: string;
  tone?: MeasurementChipTone;
  size?: 'default' | 'compact';
  onPress?: () => void;
};

const toneStyles: Record<
  MeasurementChipTone,
  { border: string; bg: string; label: string; value: string }
> = {
  default: {
    border: colors.border,
    bg: colors.surface2,
    label: colors.muted,
    value: colors.text,
  },
  primary: {
    border: colors.primaryBorder,
    bg: colors.primaryMuted,
    label: colors.primary,
    value: colors.text,
  },
  warning: {
    border: 'rgba(255, 210, 46, 0.28)',
    bg: 'rgba(255, 210, 46, 0.06)',
    label: colors.warning,
    value: colors.text,
  },
};

/** Compact field readout for marks, distances, and secondary results. */
export function MeasurementChip({ label, value, tone = 'default', size = 'default', onPress }: MeasurementChipProps) {
  const palette = toneStyles[tone];
  const compact = size === 'compact';
  const readout = (
    <View style={[styles.readout, compact && styles.readoutCompact, { borderColor: palette.border, backgroundColor: palette.bg }]}>
      <Text style={[styles.label, compact && styles.labelCompact, { color: palette.label }]} numberOfLines={2}>
        {label}
      </Text>
      <Text
        style={[styles.value, compact && styles.valueCompact, { color: palette.value }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}>
        {value}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}>
        {readout}
      </Pressable>
    );
  }

  return <View style={styles.wrapper}>{readout}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '47%',
    minWidth: 112,
    maxWidth: '100%',
  },
  readoutCompact: {
    minWidth: 96,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  readout: {
    width: '100%',
    gap: 3,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.65,
    textTransform: 'uppercase',
  },
  labelCompact: {
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  valueCompact: {
    fontSize: 15,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.88,
  },
});
