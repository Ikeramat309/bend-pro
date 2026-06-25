import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@/theme';

export type SheetDangerActionProps = {
  label: string;
  onPress: () => void;
};

/** Destructive sheet action — delete, remove, reset. */
export function SheetDangerAction({ label, onPress }: SheetDangerActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button">
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    ...typography.subtitle,
    color: colors.error,
    fontWeight: '600',
  },
});
