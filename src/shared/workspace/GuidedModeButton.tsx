import { Pressable, StyleSheet, Text } from 'react-native';

import { touchTarget } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import { workspaceColors, workspaceRadius, workspaceSpacing } from '@/theme/workspaceTheme';

type GuidedModeButtonProps = {
  label?: string;
  onPress?: () => void;
};

export function GuidedModeButton({ label = 'Guided Mode', onPress }: GuidedModeButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.hint}>Step-by-step field guide</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touchTarget + workspaceSpacing.sm,
    paddingHorizontal: workspaceSpacing.lg,
    paddingVertical: workspaceSpacing.md,
    borderRadius: workspaceRadius.xl,
    borderWidth: 1,
    borderColor: workspaceColors.accentBlueBorder,
    backgroundColor: workspaceColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  buttonPressed: {
    backgroundColor: workspaceColors.accentBlueSoft,
  },
  label: {
    color: workspaceColors.textPrimary,
    fontSize: fontSize.base,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
  },
  hint: {
    color: workspaceColors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 16,
    fontWeight: fontWeight.medium,
  },
});
