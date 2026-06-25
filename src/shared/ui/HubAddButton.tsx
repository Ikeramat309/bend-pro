import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

export type HubAddButtonProps = {
  label: string;
  onPress: () => void;
};

export function HubAddButton({ label, onPress }: HubAddButtonProps) {
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
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
});
