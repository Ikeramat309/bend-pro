import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useTheme, workspaceTheme, type ThemePalette } from '@/theme';

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
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    wrap: {
      gap: spacing.xs,
      paddingHorizontal: spacing.lg,
      paddingVertical: workspaceTheme.trustStrip.paddingVertical,
      // Continuous surface — quiet trust line, no divider or bar fill.
      backgroundColor: 'transparent',
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
      color: c.text,
      fontWeight: '700',
    },
    meta: {
      ...typography.subtitle,
      color: c.muted,
      fontSize: 11,
      lineHeight: 14,
    },
    edit: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    editText: {
      ...typography.label,
      color: c.primary,
      fontWeight: '600',
    },
    noteRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      paddingHorizontal: spacing.xs + 2,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: c.primaryMuted,
    },
    noteRowWarning: {
      backgroundColor: c.warningTint,
    },
    note: {
      flex: 1,
      ...typography.subtitle,
      color: c.muted,
      fontSize: workspaceTheme.trustStrip.noteFontSize,
      lineHeight: 14,
    },
    noteWarning: {
      color: c.warning,
    },
    noteAction: {
      ...typography.label,
      color: c.primary,
      fontWeight: '600',
      fontSize: 11,
    },
  });
}
