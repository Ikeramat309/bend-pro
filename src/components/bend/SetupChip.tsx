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
      <View style={styles.left}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>⌁</Text>
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.mainText}>{mainText}</Text>
          <Text style={styles.subText}>{subText}</Text>
        </View>
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
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 74,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBadge: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
  },
  iconText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  mainText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  subText: {
    ...typography.subtitle,
    color: colors.muted,
  },
  editButton: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  editPressed: {
    opacity: 0.85,
  },
  editLabel: {
    ...typography.chip,
    color: colors.primary,
  },
});
