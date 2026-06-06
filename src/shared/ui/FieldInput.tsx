import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export type FieldInputVariant = 'default' | 'compact' | 'picker';

export type FieldInputProps = {
  label: string;
  value: string;
  unit?: string;
  variant?: FieldInputVariant;
  helperText?: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  error?: string;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
};

const fieldLabelStyle = {
  fontSize: 10,
  lineHeight: 13,
  fontWeight: '600' as const,
  letterSpacing: 0.65,
  textTransform: 'uppercase' as const,
  color: colors.muted,
};

/** Primary measurement field — default, compact row, or picker row. */
export function FieldInput({
  label,
  value,
  unit = '',
  variant = 'default',
  helperText,
  placeholder = '0',
  onChangeText,
  onPress,
  error,
  inputProps,
}: FieldInputProps) {
  const inputRef = useRef<TextInput>(null);
  const borderColor = error ? colors.error : colors.border;

  if (variant === 'picker') {
    return (
      <View style={styles.wrapCompact}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.fieldShell,
            styles.fieldShellCompact,
            { borderColor },
            pressed && styles.fieldShellPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={label}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <View style={styles.compactValueRow}>
            <Text style={styles.pickerValue}>{value}</Text>
            <Text style={styles.pickerChevron}>›</Text>
          </View>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <View style={styles.wrapCompact}>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={({ pressed }) => [
            styles.fieldShell,
            styles.fieldShellCompact,
            { borderColor },
            pressed && styles.fieldShellPressed,
          ]}
          accessibilityRole="none">
          <View style={styles.compactLabelBlock}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
          </View>
          <View style={styles.compactValueRow}>
            <TextInput
              ref={inputRef}
              style={styles.inputCompact}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              returnKeyType="done"
              {...inputProps}
            />
            {unit ? <Text style={styles.unitCompact}>{unit}</Text> : null}
          </View>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      <View style={[styles.fieldShell, styles.fieldShellDefault, { borderColor }]}>
        <TextInput
          style={styles.inputDefault}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          returnKeyType="done"
          {...inputProps}
        />
        {unit ? <Text style={styles.unitDefault}>{unit}</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  wrapCompact: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  fieldShell: {
    borderWidth: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surface2,
    paddingHorizontal: spacing.md,
  },
  fieldShellDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  fieldShellCompact: {
    minHeight: 72,
    paddingVertical: 10,
    justifyContent: 'space-between',
    gap: 3,
  },
  fieldShellPressed: {
    opacity: 0.88,
  },
  fieldLabel: fieldLabelStyle,
  compactLabelBlock: {
    gap: 1,
  },
  helperText: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: '500',
  },
  compactValueRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  inputDefault: {
    flex: 1,
    minWidth: 0,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '600',
    color: colors.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontVariant: ['tabular-nums'],
  },
  inputCompact: {
    flex: 1,
    minWidth: 48,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  unitDefault: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.primary,
    flexShrink: 0,
  },
  unitCompact: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.primary,
    flexShrink: 0,
  },
  pickerValue: {
    flex: 1,
    minWidth: 0,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  pickerChevron: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
    flexShrink: 0,
  },
  error: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.error,
  },
});
