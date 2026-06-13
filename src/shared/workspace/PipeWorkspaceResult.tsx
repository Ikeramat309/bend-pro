import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { MeasurementChip, type MeasurementChipTone } from './MeasurementChip';
import { PipeWorkspaceCard } from './PipeWorkspaceCard';

export type PipeWorkspaceResultChip = {
  label: string;
  value: string;
  tone?: MeasurementChipTone;
  onPress?: () => void;
};

export type PipeWorkspaceResultProps = {
  title?: string;
  diagram: ReactNode;
  primaryLabel: string;
  primaryValue: string;
  chips: PipeWorkspaceResultChip[];
  /** Optional secondary line under the chips for lower-priority detail. */
  note?: string;
};

/** Diagram-first pipe card with one primary result and measurement chips. */
export function PipeWorkspaceResult({
  title,
  diagram,
  primaryLabel,
  primaryValue,
  chips,
  note,
}: PipeWorkspaceResultProps) {
  return (
    <PipeWorkspaceCard variant="highlight" title={title}>
      <View style={styles.diagramWell}>{diagram}</View>

      <View style={styles.resultsPanel}>
        <View style={styles.resultBlock}>
          <Text style={styles.resultLabel}>{primaryLabel}</Text>
          <Text style={styles.resultValue}>{primaryValue}</Text>
        </View>

        <View style={styles.chipRow}>
          {chips.map((chip) => (
            <MeasurementChip
              key={chip.label}
              label={chip.label}
              value={chip.value}
              tone={chip.tone}
              onPress={chip.onPress}
            />
          ))}
        </View>

        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>
    </PipeWorkspaceCard>
  );
}

const styles = StyleSheet.create({
  diagramWell: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsPanel: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  resultBlock: {
    gap: spacing.xs,
  },
  resultLabel: {
    ...typography.tabLabel,
    color: colors.muted,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: spacing.sm,
    rowGap: spacing.sm,
  },
  note: {
    ...typography.subtitle,
    color: colors.muted,
    marginTop: -spacing.xs,
  },
});
