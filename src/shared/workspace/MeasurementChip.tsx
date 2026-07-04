import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useTheme, type ThemePalette } from '@/theme';

export type MeasurementChipTone = 'default' | 'primary' | 'warning';

export type MeasurementChipProps = {
  label: string;
  value: string;
  tone?: MeasurementChipTone;
  size?: 'default' | 'compact';
  onPress?: () => void;
};

function toneStyles(
  c: ThemePalette,
): Record<MeasurementChipTone, { border: string; bg: string; label: string; value: string }> {
  return {
    default: {
      border: c.border,
      bg: c.surface2,
      label: c.muted,
      value: c.text,
    },
    primary: {
      border: c.primaryBorder,
      bg: c.primaryMuted,
      label: c.primary,
      value: c.text,
    },
    warning: {
      border: c.warningTintBorder,
      bg: c.warningTint,
      label: c.warning,
      value: c.text,
    },
  };
}

/** Compact field readout for marks, distances, and secondary results. */
export function MeasurementChip({ label, value, tone = 'default', size = 'default', onPress }: MeasurementChipProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const palette = toneStyles(colors)[tone];
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

  const wrapperStyle = compact ? styles.wrapperCompact : styles.wrapper;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [wrapperStyle, pressed && styles.pressed]}>
        {readout}
      </Pressable>
    );
  }

  return <View style={wrapperStyle}>{readout}</View>;
}

function makeStyles(_c: ThemePalette) {
  return StyleSheet.create({
    wrapper: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: '47%',
      minWidth: 112,
      maxWidth: '100%',
    },
    wrapperCompact: {
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 'auto',
      minWidth: 0,
      maxWidth: '100%',
    },
    readoutCompact: {
      minWidth: 88,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
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
      fontSize: 14,
      lineHeight: 17,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
