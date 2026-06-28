import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { radius, spacing, typography, useTheme, type ThemePalette } from '@/theme';

export type HubAddButtonProps = {
  label: string;
  onPress: () => void;
};

export function HubAddButton({ label, onPress }: HubAddButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button">
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.primaryBorder,
      backgroundColor: c.primaryMuted,
      paddingVertical: spacing.md,
    },
    pressed: {
      opacity: 0.88,
    },
    label: {
      ...typography.body,
      color: c.primary,
      fontWeight: '700',
    },
  });
}
