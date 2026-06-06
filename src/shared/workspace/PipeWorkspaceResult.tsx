import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

import { MeasurementChip, type MeasurementChipTone } from './MeasurementChip';
import { PipeWorkspaceCard } from './PipeWorkspaceCard';

export type PipeWorkspaceResultChip = {
  label: string;
  value: string;
  tone?: MeasurementChipTone;
};

export type PipeWorkspaceResultProps = {
  title?: string;
  diagram: ReactNode;
  primaryLabel: string;
  primaryValue: string;
  chips: PipeWorkspaceResultChip[];
};

/** Diagram-first pipe card with one primary result and measurement chips. */
export function PipeWorkspaceResult({
  title,
  diagram,
  primaryLabel,
  primaryValue,
  chips,
}: PipeWorkspaceResultProps) {
  return (
    <PipeWorkspaceCard variant="highlight" title={title}>
      {diagram}

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
          />
        ))}
      </View>
    </PipeWorkspaceCard>
  );
}

const styles = StyleSheet.create({
  resultBlock: {
    gap: spacing.xs,
  },
  resultLabel: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
  resultValue: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    color: colors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
