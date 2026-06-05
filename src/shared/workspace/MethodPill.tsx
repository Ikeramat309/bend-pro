import { StyleSheet, Text, View } from 'react-native';

import { fontSize, fontWeight } from '@/theme/typography';
import { workspaceColors, workspaceRadius, workspaceSpacing } from '@/theme/workspaceTheme';

type MethodPillProps = {
  label: string;
  active?: boolean;
};

export function MethodPill({ label, active = true }: MethodPillProps) {
  return (
    <View style={[styles.pill, active ? styles.pillActive : styles.pillDefault]}>
      <Text style={[styles.label, active ? styles.labelActive : styles.labelDefault]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: workspaceSpacing.md,
    paddingVertical: workspaceSpacing.xs + 2,
    borderRadius: workspaceRadius.full,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: workspaceColors.accentBlueSoft,
    borderColor: workspaceColors.accentBlueBorder,
  },
  pillDefault: {
    backgroundColor: workspaceColors.surfaceElevated,
    borderColor: workspaceColors.border,
  },
  label: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: workspaceColors.accentBlue,
  },
  labelDefault: {
    color: workspaceColors.textMuted,
  },
});
