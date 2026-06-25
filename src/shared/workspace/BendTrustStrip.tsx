import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography, workspaceTheme } from '@/theme';

import type { BendTrustConfig } from './workspaceTypes';

export type BendTrustStripProps = BendTrustConfig;

/** Compact bender + setup trust row for calculator screens. */
export function BendTrustStrip({
  benderName,
  meta,
  note,
  noteTone = 'info',
  noteAction,
  onEdit,
  onNoteAction,
}: BendTrustStripProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={styles.bender} numberOfLines={1}>
            {benderName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        </View>
        {onEdit ? (
          <Pressable onPress={onEdit} style={styles.edit} accessibilityRole="button">
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        ) : null}
      </View>

      {note ? (
        <View style={[styles.noteRow, noteTone === 'warning' && styles.noteRowWarning]}>
          <Text style={[styles.note, noteTone === 'warning' && styles.noteWarning]} numberOfLines={2}>
            {note}
          </Text>
          {noteAction && onNoteAction ? (
            <Pressable onPress={onNoteAction} accessibilityRole="button">
              <Text style={styles.noteAction}>{noteAction}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: workspaceTheme.trustStrip.paddingVertical,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.screen,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  main: {
    flex: 1,
    gap: 1,
  },
  bender: {
    ...typography.label,
    color: colors.text,
    fontWeight: '700',
  },
  meta: {
    ...typography.subtitle,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 14,
  },
  edit: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  editText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '600',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.primaryMuted,
  },
  noteRowWarning: {
    backgroundColor: 'rgba(255, 210, 46, 0.1)',
  },
  note: {
    flex: 1,
    ...typography.subtitle,
    color: colors.muted,
    fontSize: workspaceTheme.trustStrip.noteFontSize,
    lineHeight: 14,
  },
  noteWarning: {
    color: colors.warning,
  },
  noteAction: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 11,
  },
});
