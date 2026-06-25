import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, uiTheme } from '@/theme';

export type OptionalFieldButtonProps = {
  label: string;
  onPress: () => void;
};

/** Add control for optional calculator fields (Mark 1, Leg, etc.). */
export function OptionalFieldButton({ label, onPress }: OptionalFieldButtonProps) {
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

const styles = StyleSheet.create({
  button: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: uiTheme.field.shell.borderRadius,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  icon: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.15,
  },
});
