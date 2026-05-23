/**
 * FILE: src/components/RoundingSelector.tsx
 *
 * PURPOSE: Choose how results are rounded (1/16", 1 mm, Exact, etc.).
 * INPUTS:  value, onChange, unitSystem (imperial vs metric options differ).
 * OUTPUTS: Selected rounding id — engines read this when calling roundLength().
 *
 * DEPENDENCIES: UnitSystem from @/engine/types
 */

// IMPORTS
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UnitSystem } from '@/engine/types';
import {
  CalculatorRadii,
  CalculatorSpacing,
  CalculatorTypography,
  TOUCH_TARGET_MIN,
  useCalculatorTheme,
} from '@/theme';

// TYPES & CONSTANTS
export const IMPERIAL_ROUNDING_OPTIONS = [
  { id: 'exact', label: 'Exact' },
  { id: '1/16', label: '1/16"' },
  { id: '1/8', label: '1/8"' },
  { id: '1/4', label: '1/4"' },
] as const;

export const METRIC_ROUNDING_OPTIONS = [
  { id: 'exact', label: 'Exact' },
  { id: '1mm', label: '1 mm' },
  { id: '5mm', label: '5 mm' },
  { id: '10mm', label: '10 mm' },
] as const;

export type ImperialRoundingId = (typeof IMPERIAL_ROUNDING_OPTIONS)[number]['id'];
export type MetricRoundingId = (typeof METRIC_ROUNDING_OPTIONS)[number]['id'];
export type RoundingId = ImperialRoundingId | MetricRoundingId;

export type RoundingSelectorProps = {
  value: RoundingId;
  onChange: (id: RoundingId) => void;
  unitSystem: UnitSystem;
  disabled?: boolean;
  label?: string;
};

// UI
export function RoundingSelector({
  value,
  onChange,
  unitSystem,
  disabled = false,
  label = 'Rounding',
}: RoundingSelectorProps) {
  const colors = useCalculatorTheme();
  const options = unitSystem === 'metric' ? METRIC_ROUNDING_OPTIONS : IMPERIAL_ROUNDING_OPTIONS;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const active = value === option.id;
          return (
            <Pressable
              key={option.id}
              disabled={disabled}
              onPress={() => onChange(option.id)}
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
                {option.label}
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
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CalculatorSpacing.md,
    paddingVertical: CalculatorSpacing.sm,
  },
  chipLabel: { ...CalculatorTypography.chip },
});

// EXPORTS — above
