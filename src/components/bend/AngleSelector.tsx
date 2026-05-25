/**
 * Figma: workbench/AngleSelector — standard bend angle chips (separate from legacy calculator-ui).
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing, touchTarget } from '@/theme/spacing';
import { typography } from '@/theme/typography';

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
  label = 'Bend angle',
  selectedAngle,
  angles = BEND_ANGLE_OPTIONS,
  commonAngle = 30,
  onSelect,
  disabled = false,
}: BendAngleSelectorProps) {
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

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipCommon: {
    borderColor: colors.warning,
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipText: {
    ...typography.chip,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.background,
  },
  chipTextCommon: {
    color: colors.warning,
  },
  hint: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
});
