import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontSize, fontWeight } from '@/theme/typography';
import type { MeasurementChipTone } from '@/theme/workspaceTheme';
import { workspaceColors, workspaceRadius, workspaceSpacing } from '@/theme/workspaceTheme';

type MeasurementChipProps = {
  label: string;
  value: string;
  unit?: string;
  tone?: MeasurementChipTone;
  active?: boolean;
  onPress?: () => void;
};

function toneStyles(tone: MeasurementChipTone, active: boolean) {
  if (active) {
    switch (tone) {
      case 'orange':
        return {
          container: {
            backgroundColor: workspaceColors.accentOrangeSoft,
            borderColor: workspaceColors.accentOrangeBorder,
          },
          label: { color: workspaceColors.accentOrange },
          value: { color: workspaceColors.textPrimary },
        };
      case 'warning':
        return {
          container: {
            backgroundColor: workspaceColors.warningSoft,
            borderColor: workspaceColors.warning,
          },
          label: { color: workspaceColors.warning },
          value: { color: workspaceColors.textPrimary },
        };
      case 'blue':
        return {
          container: {
            backgroundColor: workspaceColors.accentBlueSoft,
            borderColor: workspaceColors.accentBlueBorder,
          },
          label: { color: workspaceColors.accentBlue },
          value: { color: workspaceColors.textPrimary },
        };
      default:
        return {
          container: {
            backgroundColor: workspaceColors.surface,
            borderColor: workspaceColors.accentBlueBorder,
          },
          label: { color: workspaceColors.textMuted },
          value: { color: workspaceColors.textPrimary },
        };
    }
  }

  return {
    container: {
      backgroundColor: workspaceColors.surface,
      borderColor: workspaceColors.border,
    },
    label: { color: workspaceColors.textMuted },
    value: { color: workspaceColors.textSecondary },
  };
}

export function MeasurementChip({
  label,
  value,
  unit,
  tone = 'default',
  active = false,
  onPress,
}: MeasurementChipProps) {
  const palette = toneStyles(tone, active);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        palette.container,
        pressed && styles.chipPressed,
        active && styles.chipActive,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}>
      <Text style={[styles.label, palette.label]} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, palette.value]} numberOfLines={1}>
          {value}
        </Text>
        {unit ? <Text style={[styles.unit, palette.label]}>{unit}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    minWidth: 140,
    minHeight: 72,
    paddingHorizontal: workspaceSpacing.md,
    paddingVertical: workspaceSpacing.sm + 2,
    borderRadius: workspaceRadius.lg,
    borderWidth: 1,
    gap: workspaceSpacing.xs,
    justifyContent: 'center',
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipActive: {
    transform: [{ scale: 1.01 }],
  },
  label: {
    fontSize: fontSize.xs,
    lineHeight: 16,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: workspaceSpacing.xs,
  },
  value: {
    fontSize: fontSize.lg,
    lineHeight: 24,
    fontWeight: fontWeight.bold,
  },
  unit: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
  },
});
