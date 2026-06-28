import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { spacing, typography, uiTheme, useTheme, type ThemePalette } from '@/theme';

export type HubSearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
};

export function HubSearchField({
  value,
  onChangeText,
  placeholder = 'Search',
  inputProps,
}: HubSearchFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      style={[styles.input, focused && styles.inputFocused]}
      returnKeyType="search"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...inputProps}
    />
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    input: {
      minHeight: uiTheme.hub.search.minHeight,
      borderRadius: uiTheme.hub.search.borderRadius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface2,
      paddingHorizontal: spacing.lg,
      color: c.text,
      ...typography.body,
    },
    inputFocused: {
      borderColor: c.primaryBorder,
      backgroundColor: c.surface,
    },
  });
}
