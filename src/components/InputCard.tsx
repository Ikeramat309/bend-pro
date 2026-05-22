import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import {
  CalculatorRadii,
  CalculatorSpacing,
  CalculatorTypography,
  TOUCH_TARGET_MIN,
  useCalculatorTheme,
} from '@/theme';

export type InputCardProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  unitLabel?: string;
  error?: string;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
};

export function InputCard({
  label,
  value,
  onChangeText,
  placeholder = '0',
  unitLabel,
  error,
  inputProps,
}: InputCardProps) {
  const colors = useCalculatorTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: error ? colors.danger : colors.cardBorder,
        },
      ]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.inputBorder },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          returnKeyType="done"
          {...inputProps}
        />
        {unitLabel ? (
          <View style={[styles.unitBadge, { backgroundColor: colors.backgroundElevated }]}>
            <Text style={[styles.unitText, { color: colors.textSecondary }]}>{unitLabel}</Text>
          </View>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: CalculatorRadii.lg,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
    gap: CalculatorSpacing.sm,
  },
  label: {
    ...CalculatorTypography.label,
    padding: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CalculatorSpacing.md,
  },
  input: {
    flex: 1,
    ...CalculatorTypography.input,
    minHeight: TOUCH_TARGET_MIN,
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    paddingHorizontal: CalculatorSpacing.lg,
    paddingVertical: CalculatorSpacing.md,
  },
  unitBadge: {
    minHeight: TOUCH_TARGET_MIN,
    minWidth: 56,
    borderRadius: CalculatorRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CalculatorSpacing.md,
  },
  unitText: {
    ...CalculatorTypography.chip,
    padding: 0,
  },
  error: {
    fontSize: 13,
    padding: 0,
  },
});
