import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UnitSystem } from '@/engine/types';
import {
  CalculatorRadii,
  CalculatorSpacing,
  CalculatorTypography,
  TOUCH_TARGET_MIN,
  useCalculatorTheme,
} from '@/theme';

export type UnitToggleProps = {
  value: UnitSystem;
  onChange: (system: UnitSystem) => void;
  disabled?: boolean;
};

const OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: 'imperial', label: 'Imperial' },
  { value: 'metric', label: 'Metric' },
];

export function UnitToggle({ value, onChange, disabled = false }: UnitToggleProps) {
  const colors = useCalculatorTheme();

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: colors.segmentInactive, borderColor: colors.cardBorder },
      ]}>
      {OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <Pressable
            key={option.value}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              {
                backgroundColor: active ? colors.segmentActive : 'transparent',
                opacity: pressed && !disabled ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}>
            <Text
              style={[
                styles.segmentLabel,
                { color: active ? colors.accentText : colors.textSecondary },
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    padding: CalculatorSpacing.xs,
    gap: CalculatorSpacing.xs,
  },
  segment: {
    flex: 1,
    minHeight: TOUCH_TARGET_MIN,
    borderRadius: CalculatorRadii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CalculatorSpacing.lg,
  },
  segmentLabel: {
    ...CalculatorTypography.segment,
  },
});
