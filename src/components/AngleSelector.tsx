/**
 * FILE: src/components/AngleSelector.tsx
 *
 * PURPOSE: Pick standard bend angles (10°–60°) via chip buttons.
 * INPUTS:  value (selected angle or null), onChange callback.
 * OUTPUTS: UI only — parent stores angle in state / passes to engine later.
 *
 * FUTURE REUSE: Offset, Rolling Offset, any calculator using standard angles.
 */

// IMPORTS
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  CalculatorRadii,
  CalculatorSpacing,
  CalculatorTypography,
  TOUCH_TARGET_MIN,
  useCalculatorTheme,
} from '@/theme';

// TYPES & CONSTANTS — exported so engines can type angles consistently
export const ANGLE_OPTIONS = [10, 22.5, 30, 45, 60] as const;
export type AngleOption = (typeof ANGLE_OPTIONS)[number];

export type AngleSelectorProps = {
  value: AngleOption | null;
  onChange: (angle: AngleOption) => void;
  disabled?: boolean;
  label?: string;
};

// UI
export function AngleSelector({
  value,
  onChange,
  disabled = false,
  label = 'Bend angle',
}: AngleSelectorProps) {
  const colors = useCalculatorTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        {ANGLE_OPTIONS.map((angle) => {
          const active = value === angle;
          return (
            <Pressable
              key={angle}
              disabled={disabled}
              onPress={() => onChange(angle)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active ? colors.chipActive : colors.chipInactive,
                  borderColor: active ? colors.chipActive : colors.cardBorder,
                  opacity: pressed && !disabled ? 0.85 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active, disabled }}>
              <Text style={[styles.chipLabel, { color: active ? '#FFFFFF' : colors.text }]}>
                {`${angle}°`}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  card: {
    borderRadius: CalculatorRadii.lg,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
    gap: CalculatorSpacing.md,
  },
  label: { ...CalculatorTypography.label },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: CalculatorSpacing.sm },
  chip: {
    minHeight: TOUCH_TARGET_MIN,
    minWidth: 56,
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CalculatorSpacing.md,
  },
  chipLabel: { ...CalculatorTypography.chip },
});

// EXPORTS — above
