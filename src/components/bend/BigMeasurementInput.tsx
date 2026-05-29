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
  variant?: 'default' | 'compact';
  helperText?: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  error?: string;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
};

export function BigMeasurementInput({
  label,
  value,
  unit,
  variant = 'default',
  helperText,
  placeholder = '0',
  onChangeText,
  error,
  inputProps,
}: BigMeasurementInputProps) {
  if (variant === 'compact') {
    const compactValueText = value || placeholder;
    const compactInputWidth = Math.max(48, Math.min(104, compactValueText.length * 15 + 18));

    return (
      <View style={styles.wrapCompact}>
        <View
          style={[
            styles.inputRow,
            styles.inputRowCompact,
            { borderColor: error ? colors.error : colors.border },
          ]}>
          <View style={styles.compactLabelBlock}>
            <Text style={[styles.label, styles.compactLabel]}>{label}</Text>
            {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
          </View>
          <View style={styles.compactValueRow}>
            <TextInput
              style={[styles.input, styles.inputCompact, { width: compactInputWidth }]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              returnKeyType="done"
              {...inputProps}
            />
            <Text style={[styles.unit, styles.unitCompact]}>{unit}</Text>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
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
    gap: spacing.md,
  },
  wrapCompact: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.muted,
  },
  compactLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  compactLabelBlock: {
    gap: 1,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget + spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  inputRowCompact: {
    minHeight: 92,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  compactValueRow: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.inputLarge,
    color: colors.text,
    paddingVertical: spacing.lg,
  },
  inputCompact: {
    flex: 0,
    minWidth: 0,
    fontSize: 28,
    lineHeight: 32,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  unit: {
    ...typography.resultUnit,
    color: colors.primary,
    marginLeft: spacing.md,
    fontWeight: '700',
  },
  unitCompact: {
    fontSize: 20,
    lineHeight: 24,
    marginLeft: 0,
    flexShrink: 0,
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
});
