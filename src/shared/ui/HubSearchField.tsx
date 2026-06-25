import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { colors, spacing, typography, uiTheme } from '@/theme';

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

const styles = StyleSheet.create({
  input: {
    minHeight: uiTheme.hub.search.minHeight,
    borderRadius: uiTheme.hub.search.borderRadius,
    borderWidth: 1,
    borderColor: uiTheme.hub.search.borderColor,
    backgroundColor: uiTheme.hub.search.backgroundColor,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    ...typography.body,
  },
  inputFocused: {
    borderColor: uiTheme.hub.search.focusBorderColor,
    backgroundColor: uiTheme.field.shell.focusBackground,
  },
});
