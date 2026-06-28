import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, touchTarget, typography, useTheme, type ThemePalette } from '@/theme';

export type SetupSummaryProps = {
  title: string;
  subtitle: string;
  onEdit: () => void;
};

/** Collapsed conduit/bender setup row with Edit action. */
export function SetupSummary({ title, subtitle, onEdit }: SetupSummaryProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.lg,
      padding: spacing.lg,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
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
      borderColor: c.primaryBorder,
      backgroundColor: c.primaryMuted,
    },
    iconText: {
      color: c.primary,
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
      color: c.text,
    },
    subtitle: {
      ...typography.subtitle,
      color: c.muted,
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
      color: c.primary,
    },
  });
}
