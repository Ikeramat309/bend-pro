import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, touchTarget, typography } from '@/theme';

export type SetupSummaryProps = {
  title: string;
  subtitle: string;
  onEdit: () => void;
};

/** Collapsed conduit/bender setup row with Edit action. */
export function SetupSummary({ title, subtitle, onEdit }: SetupSummaryProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>⌁</Text>
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
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
  title: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
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
