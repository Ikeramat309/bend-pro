import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FieldInput, OptionChipGroup, Sheet, type LengthInputMode } from '@/shared/ui';
import { spacing, typography, useTheme, type ThemePalette } from '@/theme';

import type {
  ParallelOffsetConduitLayout,
  ParallelOffsetShiftDirection,
} from '../engine/parallelOffset.types';
import { PARALLEL_OFFSET_CONFIG } from '../parallelOffset.config';
import { parallelOffsetCopy } from '../parallelOffset.copy';

const COUNT_OPTIONS = Array.from(
  {
    length:
      PARALLEL_OFFSET_CONFIG.maxConduitCount -
      PARALLEL_OFFSET_CONFIG.minConduitCount +
      1,
  },
  (_, index) => String(index + PARALLEL_OFFSET_CONFIG.minConduitCount),
);
const DIRECTION_OPTIONS = [
  parallelOffsetCopy.directions.toward,
  parallelOffsetCopy.directions.away,
] as const;

export type ParallelOffsetLayoutSheetProps = {
  visible: boolean;
  conduitCount: number;
  shiftDirection: ParallelOffsetShiftDirection;
  baseMarkText: string;
  baseMarkError?: string;
  lengthInput: LengthInputMode;
  unitLabel: string;
  conduits: readonly ParallelOffsetConduitLayout[];
  onConduitCountChange: (count: number) => void;
  onShiftDirectionChange: (direction: ParallelOffsetShiftDirection) => void;
  onBaseMarkChange: (text: string) => void;
  onClose: () => void;
  onUseSimpleMode: () => void;
};

export function ParallelOffsetLayoutSheet({
  visible,
  conduitCount,
  shiftDirection,
  baseMarkText,
  baseMarkError,
  lengthInput,
  unitLabel,
  conduits,
  onConduitCountChange,
  onShiftDirectionChange,
  onBaseMarkChange,
  onClose,
  onUseSimpleMode,
}: ParallelOffsetLayoutSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const directionLabel =
    shiftDirection === 'toward-free-end'
      ? parallelOffsetCopy.directions.toward
      : parallelOffsetCopy.directions.away;
  const hasAbsoluteMarks = conduits.some((conduit) => conduit.mark1 !== undefined);

  return (
    <Sheet
      visible={visible}
      title={parallelOffsetCopy.layoutSheetTitle}
      subtitle={parallelOffsetCopy.layoutSheetSubtitle}
      onClose={onClose}
      primaryLabel="Done"
      onPrimaryPress={onClose}
      secondaryLabel="Simple Shift"
      onSecondaryPress={onUseSimpleMode}>
      <OptionChipGroup
        title={parallelOffsetCopy.fields.conduitCount.label}
        options={COUNT_OPTIONS}
        selected={String(conduitCount)}
        onSelect={(value) => onConduitCountChange(Number(value))}
      />
      <OptionChipGroup
        title={parallelOffsetCopy.fields.shiftDirection.label}
        options={DIRECTION_OPTIONS}
        selected={directionLabel}
        onSelect={(value) =>
          onShiftDirectionChange(
            value === parallelOffsetCopy.directions.toward
              ? 'toward-free-end'
              : 'away-from-free-end',
          )
        }
      />
      <FieldInput
        label={parallelOffsetCopy.fields.baseMark.label}
        value={baseMarkText}
        onChangeText={onBaseMarkChange}
        placeholder={parallelOffsetCopy.fields.baseMark.placeholder}
        helperText={parallelOffsetCopy.fields.baseMark.hint}
        error={baseMarkError}
        unit={unitLabel}
        lengthInput={lengthInput}
      />

      {conduits.length > 0 ? (
        <View style={styles.layoutTable}>
          <Text style={styles.tableTitle}>PIPE MARKS</Text>
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, styles.pipeColumn]}>Pipe</Text>
            <Text style={styles.headerText}>Shift</Text>
            {hasAbsoluteMarks ? <Text style={styles.headerText}>Mark 1</Text> : null}
            {hasAbsoluteMarks ? <Text style={styles.headerText}>Mark 2</Text> : null}
          </View>
          {conduits.map((conduit) => (
            <View key={conduit.conduitNumber} style={styles.resultRow}>
              <Text style={[styles.pipeText, styles.pipeColumn]}>P{conduit.conduitNumber}</Text>
              <Text style={styles.valueText}>{conduit.display.cumulativeShift}</Text>
              {hasAbsoluteMarks ? (
                <Text style={styles.valueText}>{conduit.display.mark1 ?? '—'}</Text>
              ) : null}
              {hasAbsoluteMarks ? (
                <Text style={styles.valueText}>{conduit.display.mark2 ?? '—'}</Text>
              ) : null}
            </View>
          ))}
          {!hasAbsoluteMarks ? (
            <Text style={styles.tableHint}>
              Add Pipe 1 Mark 1 above to turn these relative shifts into absolute marks.
            </Text>
          ) : null}
        </View>
      ) : null}
    </Sheet>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    layoutTable: { gap: spacing.sm, paddingBottom: spacing.sm },
    tableTitle: { ...typography.label, color: c.muted },
    headerRow: { flexDirection: 'row', gap: spacing.sm },
    resultRow: { flexDirection: 'row', gap: spacing.sm, minHeight: 24, alignItems: 'center' },
    pipeColumn: { flex: 0.55 },
    headerText: {
      flex: 1,
      color: c.muted,
      fontSize: 11,
      fontWeight: '700',
      textAlign: 'right',
    },
    pipeText: { color: c.mark, fontSize: 12, fontWeight: '800' },
    valueText: {
      flex: 1,
      color: c.text,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'right',
      fontVariant: ['tabular-nums'],
    },
    tableHint: { color: c.muted, fontSize: 11, lineHeight: 15 },
  });
}
