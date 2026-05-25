/**
 * Figma: BigMeasurementInput — primary field measurement entry.
 */
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing, touchTarget } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type BigMeasurementInputProps = {
  label: string;
  value: string;
  unit: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  error?: string;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
};

export function BigMeasurementInput({
  label,
  value,
  unit,
  placeholder = '0',
  onChangeText,
  error,
  inputProps,
}: BigMeasurementInputProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          { borderColor: error ? colors.error : colors.border },
        ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          returnKeyType="done"
          {...inputProps}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget + spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    ...typography.inputLarge,
    color: colors.text,
    paddingVertical: spacing.lg,
  },
  unit: {
    ...typography.resultUnit,
    color: colors.muted,
    marginLeft: spacing.md,
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
});
