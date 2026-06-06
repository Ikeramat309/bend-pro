import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing, touchTarget, typography } from '@/theme';

export type FieldInputProps = {
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

/** Primary measurement field — large default or compact side-by-side layout. */
export function FieldInput({
  label,
  value,
  unit,
  variant = 'default',
  helperText,
  placeholder = '0',
  onChangeText,
  error,
  inputProps,
}: FieldInputProps) {
  const inputRef = useRef<TextInput>(null);

  if (variant === 'compact') {
    return (
      <View style={styles.wrapCompact}>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={({ pressed }) => [
            styles.inputRow,
            styles.inputRowCompact,
            { borderColor: error ? colors.error : colors.border },
            pressed && styles.inputRowCompactPressed,
          ]}
          accessibilityRole="none">
          <View style={styles.compactLabelBlock}>
            <Text style={[styles.label, styles.compactLabel]}>{label}</Text>
            {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
          </View>
          <View style={styles.compactValueRow}>
            <TextInput
              ref={inputRef}
              style={[styles.input, styles.inputCompact]}
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
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      <View style={[styles.inputRow, { borderColor: error ? colors.error : colors.border }]}>
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
  inputRowCompactPressed: {
    opacity: 0.92,
  },
  compactValueRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.inputLarge,
    color: colors.text,
    paddingVertical: spacing.lg,
  },
  inputCompact: {
    flex: 1,
    minWidth: 48,
    fontSize: 28,
    lineHeight: 32,
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlign: 'right',
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
