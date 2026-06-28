import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { LengthInputSheet } from './LengthInputSheet';
import { spacing, uiTheme, useTheme, type ThemePalette } from '@/theme';

export type FieldInputVariant = 'default' | 'compact' | 'picker';
export type LengthInputMode = 'decimal' | 'imperial';

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
  /** Decimal pad for metric; sheet-based fraction keypad for imperial. */
  lengthInput?: LengthInputMode;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
};

function shellBorder(c: ThemePalette, error?: string, focused?: boolean) {
  if (error) return c.error;
  if (focused) return c.primaryBorder;
  return c.border;
}

function resolveKeyboardType(
  lengthInput: LengthInputMode | undefined,
  inputProps?: FieldInputProps['inputProps'],
): TextInputProps['keyboardType'] {
  if (lengthInput === 'imperial') return 'decimal-pad';
  return inputProps?.keyboardType ?? 'decimal-pad';
}

type FieldStyles = ReturnType<typeof makeStyles>;

function ImperialValueText({
  value,
  placeholder,
  compact,
  styles,
}: {
  value: string;
  placeholder: string;
  compact?: boolean;
  styles: FieldStyles;
}) {
  const isEmpty = value.trim() === '';
  return (
    <Text
      style={[
        compact ? styles.inputCompactDisplay : styles.inputDefaultDisplay,
        isEmpty && styles.placeholderDisplay,
      ]}
      numberOfLines={1}>
      {isEmpty ? placeholder : value}
    </Text>
  );
}

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
  lengthInput,
  inputProps,
}: FieldInputProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [lengthSheetVisible, setLengthSheetVisible] = useState(false);
  const useLengthSheet = lengthInput === 'imperial';
  const borderColor = shellBorder(colors, error, focused || lengthSheetVisible);
  const shellBackground =
    focused || lengthSheetVisible ? colors.surface : colors.surface2;
  const keyboardType = resolveKeyboardType(lengthInput, inputProps);

  const sharedInputProps: TextInputProps = {
    ...inputProps,
    value,
    onChangeText,
    placeholder,
    placeholderTextColor: colors.muted,
    keyboardType,
    returnKeyType: 'done',
    onFocus: (event) => {
      setFocused(true);
      inputProps?.onFocus?.(event);
    },
    onBlur: (event) => {
      setFocused(false);
      inputProps?.onBlur?.(event);
    },
  };

  function openLengthSheet() {
    setLengthSheetVisible(true);
  }

  function closeLengthSheet() {
    setLengthSheetVisible(false);
  }

  const lengthSheet = useLengthSheet ? (
    <LengthInputSheet
      visible={lengthSheetVisible}
      label={label}
      value={value}
      unit={unit}
      placeholder={placeholder}
      onCommit={(next) => {
        onChangeText(next);
        closeLengthSheet();
      }}
      onCancel={closeLengthSheet}
    />
  ) : null;

  if (variant === 'picker') {
    return (
      <View style={styles.wrapCompact}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.fieldShell,
            styles.fieldShellCompact,
            { borderColor, backgroundColor: shellBackground },
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
    if (useLengthSheet) {
      return (
        <View style={styles.wrapCompact}>
          <Pressable
            onPress={openLengthSheet}
            style={({ pressed }) => [
              styles.fieldShell,
              styles.fieldShellCompact,
              { borderColor, backgroundColor: shellBackground },
              pressed && styles.fieldShellPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${label}, edit length`}>
            <View style={styles.compactLabelBlock}>
              <Text style={styles.fieldLabel}>{label}</Text>
              {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
            </View>
            <View style={styles.compactValueRow}>
              <ImperialValueText value={value} placeholder={placeholder} compact styles={styles} />
              {unit ? <Text style={styles.unitCompact}>{unit}</Text> : null}
            </View>
          </Pressable>
          {lengthSheet}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      );
    }

    return (
      <View style={styles.wrapCompact}>
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={[styles.fieldShell, styles.fieldShellCompact, { borderColor, backgroundColor: shellBackground }]}
          accessibilityRole="none">
          <View style={styles.compactLabelBlock}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
          </View>
          <View style={styles.compactValueRow}>
            <TextInput ref={inputRef} style={styles.inputCompact} {...sharedInputProps} />
            {unit ? <Text style={styles.unitCompact}>{unit}</Text> : null}
          </View>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  if (useLengthSheet) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
        <Pressable
          onPress={openLengthSheet}
          style={({ pressed }) => [
            styles.fieldShell,
            styles.fieldShellDefault,
            { borderColor, backgroundColor: shellBackground },
            pressed && styles.fieldShellPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${label}, edit length`}>
          <ImperialValueText value={value} placeholder={placeholder} styles={styles} />
          {unit ? <Text style={styles.unitDefault}>{unit}</Text> : null}
        </Pressable>
        {lengthSheet}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      <View style={[styles.fieldShell, styles.fieldShellDefault, { borderColor, backgroundColor: shellBackground }]}>
        <TextInput style={styles.inputDefault} {...sharedInputProps} />
        {unit ? <Text style={styles.unitDefault}>{unit}</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
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
      borderRadius: uiTheme.field.shell.borderRadius,
    },
    fieldShellDefault: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: uiTheme.field.defaultMinHeight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
    },
    fieldShellCompact: {
      minHeight: uiTheme.field.compactMinHeight,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      justifyContent: 'space-between',
      gap: 3,
    },
    fieldShellPressed: {
      opacity: 0.88,
    },
    fieldLabel: { ...uiTheme.field.label, color: c.muted },
    compactLabelBlock: {
      gap: 1,
    },
    helperText: {
      fontSize: 11,
      lineHeight: 14,
      color: c.muted,
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
      fontSize: uiTheme.field.defaultValueSize,
      lineHeight: 32,
      fontWeight: '600',
      color: c.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
      fontVariant: ['tabular-nums'],
    },
    inputDefaultDisplay: {
      flex: 1,
      minWidth: 0,
      fontSize: uiTheme.field.defaultValueSize,
      lineHeight: 32,
      fontWeight: '600',
      color: c.text,
      fontVariant: ['tabular-nums'],
    },
    inputCompact: {
      flex: 1,
      minWidth: 48,
      fontSize: uiTheme.field.compactValueSize,
      lineHeight: 28,
      fontWeight: '600',
      color: c.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
      textAlign: 'right',
      fontVariant: ['tabular-nums'],
    },
    inputCompactDisplay: {
      flex: 1,
      minWidth: 48,
      fontSize: uiTheme.field.compactValueSize,
      lineHeight: 28,
      fontWeight: '600',
      color: c.text,
      textAlign: 'right',
      fontVariant: ['tabular-nums'],
    },
    placeholderDisplay: {
      color: c.muted,
    },
    unitDefault: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '600',
      color: c.primary,
      flexShrink: 0,
    },
    unitCompact: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '600',
      color: c.primary,
      flexShrink: 0,
    },
    pickerValue: {
      flex: 1,
      minWidth: 0,
      fontSize: uiTheme.field.compactValueSize,
      lineHeight: 28,
      fontWeight: '600',
      color: c.text,
      textAlign: 'right',
      fontVariant: ['tabular-nums'],
    },
    pickerChevron: {
      color: c.primary,
      fontSize: 22,
      lineHeight: 24,
      fontWeight: '600',
      flexShrink: 0,
    },
    error: {
      fontSize: 11,
      lineHeight: 14,
      color: c.error,
    },
  });
}
