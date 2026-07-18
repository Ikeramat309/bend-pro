import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { spacing, useTheme, type ThemePalette } from '@/theme';

export type OptionalFieldButtonProps = {
  label: string;
  onPress: () => void;
};

/** Add control for optional calculator fields (Mark 1, Leg, etc.). */
export function OptionalFieldButton({ label, onPress }: OptionalFieldButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      accessibilityRole="button">
      <Text style={styles.icon}>+</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    button: {
      minHeight: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      alignSelf: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    buttonPressed: {
      opacity: 0.88,
    },
    icon: {
      color: c.primary,
      fontSize: 15,
      lineHeight: 18,
      fontWeight: '700',
    },
    label: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      color: c.primary,
      letterSpacing: 0.15,
    },
  });
}
