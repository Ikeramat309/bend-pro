/**
 * Figma: workbench/SetupChip — collapsed setup summary with Edit action.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing, touchTarget } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type SetupChipProps = {
  mainText: string;
  subText: string;
  onEdit: () => void;
};

export function SetupChip({ mainText, subText, onEdit }: SetupChipProps) {
  return (
    <View style={styles.card}>
      <View style={styles.textBlock}>
        <Text style={styles.mainText}>{mainText}</Text>
        <Text style={styles.subText}>{subText}</Text>
      </View>
      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [styles.editButton, pressed && styles.editPressed]}
        accessibilityRole="button"
        accessibilityLabel="Edit setup">
        <Text style={styles.editLabel}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 72,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  mainText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  subText: {
    ...typography.subtitle,
    color: colors.muted,
  },
  editButton: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  editPressed: {
    opacity: 0.85,
  },
  editLabel: {
    ...typography.chip,
    color: colors.primary,
  },
});
