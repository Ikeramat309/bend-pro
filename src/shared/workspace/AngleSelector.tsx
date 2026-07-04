import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, touchTarget, typography, useTheme, type ThemePalette } from '@/theme';

export const BEND_ANGLE_OPTIONS = [10, 22.5, 30, 45, 60] as const;
export type BendAngleOption = (typeof BEND_ANGLE_OPTIONS)[number];

export type BendAngleSelectorProps = {
  label?: string;
  selectedAngle: BendAngleOption;
  angles?: readonly BendAngleOption[];
  commonAngle?: BendAngleOption;
  onSelect: (angle: BendAngleOption) => void;
  disabled?: boolean;
};

export function AngleSelector({
  label = 'Angle',
  selectedAngle,
  angles = BEND_ANGLE_OPTIONS,
  commonAngle = 30,
  onSelect,
  disabled = false,
}: BendAngleSelectorProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {angles.map((angle) => {
          const selected = selectedAngle === angle;
          const isCommon = commonAngle === angle;
          return (
            <Pressable
              key={angle}
              disabled={disabled}
              onPress={() => onSelect(angle)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                isCommon && !selected && styles.chipCommon,
                pressed && !disabled && styles.chipPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}>
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                  isCommon && !selected && styles.chipTextCommon,
                ]}>
                {angle}°
              </Text>
            </Pressable>
          );
        })}
      </View>
      {commonAngle != null ? (
        <Text style={styles.hint}>Most common: {commonAngle}°</Text>
      ) : null}
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    wrap: {
      gap: spacing.md,
    },
    label: {
      ...typography.label,
      color: c.muted,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    chip: {
      flex: 1,
      minHeight: touchTarget - 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.lg,
      backgroundColor: c.surface2,
    },
    chipSelected: {
      backgroundColor: c.primary,
    },
    chipCommon: {
      backgroundColor: c.primaryMuted,
    },
    chipPressed: {
      opacity: 0.9,
    },
    chipText: {
      ...typography.chip,
      color: c.text,
      fontSize: 15,
    },
    chipTextSelected: {
      color: c.background,
    },
    chipTextCommon: {
      color: c.primary,
    },
    hint: {
      fontSize: 12,
      color: c.muted,
      fontWeight: '500',
    },
  });
}
